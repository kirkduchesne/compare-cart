import { downloadComparison, parseBackup } from './backup';
import { useRef, useState } from 'react';
import { parsePrice } from './money';
import { bestProducts, sortProducts } from './comparison';
import { ProductCard } from './ProductCard';
import { loadProducts, saveProducts, unitLabels } from './storage';

export function App() {
  const nameRef = useRef(null);
  const priceRef = useRef(null);
  const unitsRef = useRef(null);
  const [name, setName] = useState('');
  const [units, setUnits] = useState('1');
  const [price, setPrice] = useState('');
  const [initial] = useState(() => loadProducts({ getItem: (key) => localStorage.getItem(key) }));
  const savedRaw = useRef(initial.raw);
  const [unit, setUnit] = useState(initial.unit);
  const [products, setProducts] = useState(initial.products);
  const [warning, setWarning] = useState(initial.warning);
  const [error, setError] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const [target, setTarget] = useState('');
  const [order, setOrder] = useState('added');
  const [editing, setEditing] = useState(null);

  async function importComparison(event) {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 16000) throw new Error('Choose a comparison JSON file smaller than 16 KB.');
      const backup = parseBackup(await file.text());
      if (
        !window.confirm(
          'Replace this comparison with the backup? Export first if you want to keep the current products or unsaved form edits.'
        )
      )
        return;
      setUnit(backup.unit);
      updateProducts(backup.products, backup.unit);
      resetForm();
      setBackupMessage('Comparison imported. Check the storage warning before closing this page.');
    } catch (error) {
      setBackupMessage(
        error.message || 'The file could not be read. Your comparison is unchanged.'
      );
    }
  }

  function exportComparison() {
    try {
      downloadComparison(products, unit);
      setBackupMessage(
        'Comparison exported. Quantity needed and unsaved form edits are not included.'
      );
    } catch {
      setBackupMessage('The download could not start. Keep this page open and try again.');
    }
  }

  function resetForm() {
    setEditing(null);
    setUnits('1');
    setPrice('');
    setName('');
    setError('');
    nameRef.current.focus();
  }

  function editProduct(product) {
    setEditing(product.id);
    setName(product.name);
    setUnits(String(product.units));
    setPrice((product.cents / 100).toFixed(2));
    setError('');
    nameRef.current.focus();
  }

  function updateProducts(next, nextUnit = unit) {
    setProducts(next);
    if (!initial.readable) return;
    const message = saveProducts(
      next,
      {
        getItem: (key) => localStorage.getItem(key),
        setItem: (key, value) => localStorage.setItem(key, value),
      },
      nextUnit,
      savedRaw.current
    );
    setWarning(message);
    if (!message) savedRaw.current = JSON.stringify({ version: 2, products: next, unit: nextUnit });
  }

  function addProduct(event) {
    event.preventDefault();
    if (!name.trim() || name.trim().length > 80) {
      setError('Enter a product name of 1–80 characters.');
      nameRef.current.focus();
      return;
    }
    const cents = parsePrice(price.trim());
    if (cents === null) {
      setError('Enter a price from 0.01 to 99999.99 with at most two decimals.');
      priceRef.current.focus();
      return;
    }
    const count = Number(units);
    if (!Number.isInteger(count) || count < 1 || count > 1000) {
      setError('Units per pack must be a whole number from 1 to 1000.');
      unitsRef.current.focus();
      return;
    }
    if (editing === null && products.length >= 6) {
      setError('Compare up to six products. Remove one before adding another.');
      return;
    }
    let id = 1;
    while (products.some((product) => product.id === id)) id += 1;
    const updated = { id: editing === null ? id : editing, name: name.trim(), cents, units: count };
    updateProducts(
      editing === null
        ? [...products, updated]
        : products.map((product) => (product.id === editing ? updated : product))
    );
    setEditing(null);
    setUnits('1');
    setPrice('');
    setName('');
    nameRef.current.focus();
    setError('');
  }

  const best = bestProducts(products);

  return (
    <main>
      <header>
        <p className="eyebrow">SMALL CHOICES, CLEARER VALUE</p>
        <h1>Compare Cart</h1>
        <p>A little help choosing what goes in your basket.</p>
      </header>
      <section aria-labelledby="add-title">
        <h2 id="add-title">{editing === null ? 'Add a product' : 'Edit product'}</h2>
        <form onSubmit={addProduct} noValidate>
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={80}
            aria-describedby="form-error"
          />
          <label htmlFor="price">Pack price ($)</label>
          <input
            id="price"
            ref={priceRef}
            inputMode="decimal"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            aria-describedby="form-error"
          />
          <label htmlFor="units">Units per pack</label>
          <input
            id="units"
            ref={unitsRef}
            type="number"
            min="1"
            max="1000"
            step="1"
            value={units}
            onChange={(event) => setUnits(event.target.value)}
            aria-describedby="form-error"
          />
          <p id="form-error" role="alert">
            {error}
          </p>
          <button>{editing === null ? 'Add product' : 'Save changes'}</button>
          {editing !== null ? (
            <button type="button" className="secondary" onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </form>
      </section>
      <section aria-labelledby="comparison-title">
        <h2 id="comparison-title">Your comparison</h2>
        <label htmlFor="unit-label">Measure</label>
        <select
          id="unit-label"
          value={unit}
          onChange={(event) => {
            setUnit(event.target.value);
            updateProducts(products, event.target.value);
          }}
        >
          {unitLabels.map((label) => (
            <option key={label}>{label}</option>
          ))}
        </select>
        <p className="help">
          Changing the label does not convert quantities. Use one measure for all products.
        </p>
        <p className="help">
          Use the same unit for every product, such as grams or items. Unit prices display rounded
          to the nearest cent; best value uses the unrounded ratio.
        </p>
        <label htmlFor="target">Quantity needed (optional)</label>
        <input
          id="target"
          type="number"
          min="1"
          max="10000"
          step="1"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          aria-describedby="target-help"
        />
        <p id="target-help" className="help">
          Enter 1–10000 {unit} to compare whole-pack purchase costs. Best unit price may cost more
          for a small purchase.
        </p>
        {target !== '' &&
        (!Number.isInteger(Number(target)) || Number(target) < 1 || Number(target) > 10000) ? (
          <p role="alert">Quantity needed must be a whole number from 1 to 10000.</p>
        ) : null}
        <label htmlFor="sort">Order products</label>
        <select id="sort" value={order} onChange={(event) => setOrder(event.target.value)}>
          <option value="added">Added order</option>
          <option value="price">Lowest unit price</option>
          <option value="name">Product name</option>
        </select>
        <p role="status">{warning}</p>
        <button type="button" className="secondary" onClick={exportComparison}>
          Export comparison
        </button>
        <label htmlFor="backup">Import comparison backup</label>
        <input
          id="backup"
          type="file"
          accept=".json,application/json"
          onChange={importComparison}
        />
        <p role="status">{backupMessage}</p>
        {products.length === 0 ? (
          <p>Add your first product to get started.</p>
        ) : (
          <ul>
            {sortProducts(products, order).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                unit={unit}
                target={Number(target)}
                best={best.includes(product)}
                onEdit={() => editProduct(product)}
                onRemove={() => {
                  if (editing === product.id) resetForm();
                  updateProducts(products.filter((item) => item.id !== product.id));
                  nameRef.current.focus();
                }}
              />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
