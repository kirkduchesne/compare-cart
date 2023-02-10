import { formatPrice } from './money';

export function ProductCard({ product, best }) {
  return <li className="product">
    <h3>{product.name}</h3>
    <p>{formatPrice(product.cents)} for {product.units} units</p>
    <p className="unit-price">{formatPrice(product.cents / product.units)} per unit</p>
    {best ? <span className="badge">Best unit price</span> : null}
  </li>;
}
