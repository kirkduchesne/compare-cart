import { expect, test } from 'vitest';
import { loadProducts, saveProducts } from './storage';

test('protects malformed and inconsistent stored records', () => {
  ['', '{}', '[null]', '[{"id":1}]'].forEach(raw => {
    expect(loadProducts({ getItem: () => raw }).readable).toBe(false);
  });
});
test('reports unavailable storage without throwing', () => {
  expect(loadProducts({ getItem: () => { throw new Error('denied'); } }).warning).toContain('session-only');
  expect(saveProducts([], { setItem: () => { throw new Error('full'); } })).toContain('could not be saved');
});
test('restores validated products', () => {
  const products = [{ id: 1, name: 'Oats', cents: 450, units: 3 }];
  expect(loadProducts({ getItem: () => JSON.stringify(products) }).products).toEqual(products);
  expect(loadProducts({ getItem: () => JSON.stringify([...products, ...products]) }).readable).toBe(false);
});
