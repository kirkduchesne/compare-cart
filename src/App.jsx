import { useState } from 'react';
import { parsePrice, formatPrice } from './money';

export function App() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  function addProduct(event) {
    event.preventDefault();
    if (!name.trim() || name.trim().length > 80) {
      setError('Enter a product name of 1–80 characters.');
      return;
    }
    const cents = parsePrice(price.trim());
    if (cents === null) {
      setError('Enter a price from 0.01 to 99999.99 with at most two decimals.');
      return;
    }
    setProducts([...products, { name: name.trim(), cents }]);
    setPrice('');
    setName('');
    setError('');
  }

  return <main>
    <header><p className="eyebrow">SMALL CHOICES, CLEARER VALUE</p><h1>Compare Cart</h1><p>A little help choosing what goes in your basket.</p></header>
    <section aria-labelledby="add-title"><h2 id="add-title">Add a product</h2>
      <form onSubmit={addProduct} noValidate>
        <label htmlFor="name">Product name</label><input id="name" value={name} onChange={event => setName(event.target.value)} maxLength={80} aria-describedby="form-error" />
        <label htmlFor="price">Pack price ($)</label><input id="price" inputMode="decimal" value={price} onChange={event => setPrice(event.target.value)} aria-describedby="form-error" />
        <p id="form-error" role="alert">{error}</p><button>Add product</button>
      </form>
    </section>
    <section aria-labelledby="comparison-title"><h2 id="comparison-title">Your comparison</h2>
      {products.length === 0 ? <p>Add your first product to get started.</p> : <ul>{products.map((product, index) => <li key={index}>{product.name} — {formatPrice(product.cents)}</li>)}</ul>}
    </section>
  </main>;
}
