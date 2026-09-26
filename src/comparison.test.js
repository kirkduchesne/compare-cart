import { expect, test } from 'vitest';
import { bestProducts, sortProducts, purchaseFor } from './comparison';

test('compares exact ratios and preserves ties', () => {
  const products = [
    { cents: 100, units: 3 },
    { cents: 200, units: 6 },
    { cents: 34, units: 1 },
  ];
  expect(bestProducts(products)).toEqual(products.slice(0, 2));
  expect(bestProducts([])).toEqual([]);
});

test('sorts by exact unit ratio without mutating storage order', () => {
  const products = [
    { name: 'Z', cents: 34, units: 1 },
    { name: 'A', cents: 100, units: 3 },
  ];
  expect(sortProducts(products, 'price')[0]).toBe(products[1]);
  expect(sortProducts(products, 'name')[0]).toBe(products[1]);
  expect(sortProducts(products, 'added')).toEqual(products);
  expect(products[0].name).toBe('Z');
});

test('calculates whole-pack cost and surplus with bounded integer quantities', () => {
  expect(purchaseFor({ cents: 299, units: 6 }, 7)).toEqual({ packs: 2, cents: 598, extra: 5 });
  expect(purchaseFor({ cents: 9999999, units: 1 }, 10000).cents).toBe(99999990000);
  for (const target of [0, -1, 0.5, 10001, NaN, Infinity, null])
    expect(purchaseFor({ cents: 100, units: 1 }, target)).toBeNull();
});
