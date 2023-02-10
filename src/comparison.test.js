import { expect, test } from 'vitest';
import { bestProducts } from './comparison';

test('compares exact ratios and preserves ties', () => {
  const products = [{ cents: 100, units: 3 }, { cents: 200, units: 6 }, { cents: 34, units: 1 }];
  expect(bestProducts(products)).toEqual(products.slice(0, 2));
  expect(bestProducts([])).toEqual([]);
});
