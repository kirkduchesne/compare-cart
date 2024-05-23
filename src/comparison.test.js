import { expect, test } from 'vitest';
import { bestProducts, sortProducts } from './comparison';

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
  const products = [{ name: 'Z', cents: 34, units: 1 }, { name: 'A', cents: 100, units: 3 }];
  expect(sortProducts(products, 'price')[0]).toBe(products[1]);
  expect(sortProducts(products, 'name')[0]).toBe(products[1]);
  expect(sortProducts(products, 'added')).toEqual(products);
  expect(products[0].name).toBe('Z');
});
