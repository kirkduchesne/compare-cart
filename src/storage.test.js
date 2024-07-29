import { expect, test } from 'vitest';
import { loadProducts, saveProducts } from './storage';

test('protects malformed and inconsistent stored records', () => {
  ['', '{}', '[null]', '[{"id":1}]'].forEach((raw) => {
    expect(loadProducts({ getItem: () => raw }).readable).toBe(false);
  });
});
test('reports unavailable storage without throwing', () => {
  expect(
    loadProducts({
      getItem: () => {
        throw new Error('denied');
      },
    }).warning
  ).toContain('session-only');
  expect(
    saveProducts([], {
      setItem: () => {
        throw new Error('full');
      },
    })
  ).toContain('could not be saved');
});
test('restores validated products', () => {
  const products = [{ id: 1, name: 'Oats', cents: 450, units: 3 }];
  expect(loadProducts({ getItem: () => JSON.stringify(products) }).products).toEqual(products);
  expect(loadProducts({ getItem: () => JSON.stringify([...products, ...products]) }).readable).toBe(
    false
  );
});


test('loads legacy arrays and stores a versioned measurement', () => {
  const products = [{ id: 1, name: 'Oats', cents: 450, units: 3 }];
  expect(loadProducts({ getItem: () => JSON.stringify(products) }).unit).toBe('items');
  let saved;
  saveProducts(products, { setItem: (key, value) => { saved = value; } }, 'grams');
  expect(loadProducts({ getItem: () => saved }).unit).toBe('grams');
  expect(loadProducts({ getItem: () => '{"version":99,"products":[],"unit":"items"}' }).readable).toBe(false);
});

test('refuses to overwrite changes saved by another tab', () => {
  const values = new Map([['compare-cart-v1', 'other tab']]);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  expect(saveProducts([], storage, 'items', null)).toContain('another tab');
  expect(values.get('compare-cart-v1')).toBe('other tab');
});
