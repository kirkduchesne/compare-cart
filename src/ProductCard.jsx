import { formatPrice } from './money';

export function ProductCard({ product, best, onRemove, unit = 'items' }) {
  return (
    <li className="product">
      <h3>{product.name}</h3>
      <p>
        {formatPrice(product.cents)} for {product.units} {unit}
      </p>
      <p className="unit-price">
        {formatPrice(Math.round(product.cents / product.units))} per unit
      </p>
      {best ? <span className="badge">Best unit price</span> : null}
      <button
        type="button"
        className="secondary"
        onClick={onRemove}
        aria-label={'Remove ' + product.name}
      >
        Remove
      </button>
    </li>
  );
}
