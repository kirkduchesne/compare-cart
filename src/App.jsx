import { useRef, useState } from 'react';
import { parsePrice } from './money';
import { bestProducts } from './comparison';
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
  const [unit, setUnit] = useState(initial.unit);
  const [products, setProducts] = useState(initial.products);
  const [warning, setWarning] = useState(initial.warning);
  const [error, setError] = useState('');

  function updateProducts(next, nextUnit = unit) {
    setProducts(next);
    if (initial.readable)
      setWarning(saveProducts(next, { setItem: (key, value) => localStorage.setItem(key, value) }, nextUnit));
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
    if (products.length >= 6) {
      setError('Compare up to six products. Remove one before adding another.');
      return;
    }
    let id = 1;
    while (products.some((product) => product.id === id)) id += 1;
    updateProducts([...products, { id, name: name.trim(), cents, units: count }]);
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
        <h2 id="add-title">Add a product</h2>
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
          <button>Add product</button>
        </form>
      </section>
      <section aria-labelledby="comparison-title">
        <h2 id="comparison-title">Your comparison</h2>
        <label htmlFor="unit-label">Measure</label>
        <select id="unit-label" value={unit} onChange={event => { setUnit(event.target.value); updateProducts(products, event.target.value); }}>
          {unitLabels.map(label => <option key={label}>{label}</option>)}
        </select>
        <p className="help">Changing the label does not convert quantities. Use one measure for all products.</p>
        <p className="help">
          Use the same unit for every product, such as grams or items. Unit prices display rounded
          to the nearest cent; best value uses the unrounded ratio.
        </p>
        <p role="status">{warning}</p>
        {products.length === 0 ? (
          <p>Add your first product to get started.</p>
        ) : (
          <ul>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                unit={unit}
                best={best.includes(product)}
                onRemove={() => {
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
