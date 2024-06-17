import { purchaseFor } from './comparison';
import { formatPrice } from './money';

export function ProductCard({ product, best, onRemove, onEdit, unit = 'items', target = null }) {
  const purchase = purchaseFor(product, target);
  return (
    <li className="product">
      <h3>{product.name}</h3>
      <p>
        {formatPrice(product.cents)} for {product.units} {unit}
      </p>
      <p className="unit-price">
        {formatPrice(Math.round(product.cents / product.units))} per unit
      </p>
      {purchase ? <p className="purchase">Buy {purchase.packs} pack{purchase.packs === 1 ? '' : 's'} for {formatPrice(purchase.cents)} · {purchase.extra} extra {unit}</p> : null}
      {best ? <span className="badge">Best unit price</span> : null}
      {onEdit ? <button type="button" className="secondary" onClick={onEdit} aria-label={'Edit ' + product.name}>Edit</button> : null}
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
