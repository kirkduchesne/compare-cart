import { expect, test } from 'vitest';
import { parseBackup } from './backup';

test('imports validated current and legacy comparisons', () => {
  const products = [{ id: 1, name: '<b>Oats</b>', cents: 299, units: 500 }];
  expect(parseBackup(JSON.stringify({ version: 2, products, unit: 'grams' }))).toEqual({ products, unit: 'grams' });
  expect(parseBackup(JSON.stringify(products)).unit).toBe('items');
});

test('rejects oversized, malformed, duplicate and future-version backups', () => {
  const item = { id: 1, name: 'Oats', cents: 299, units: 2 };
  for (const value of ['x'.repeat(16001), 'null', '{}', 'broken', JSON.stringify([item, item]), JSON.stringify({version: 3, products: [], unit: 'items'}), JSON.stringify([{...item, cents: 0}])]) expect(() => parseBackup(value)).toThrow();
});
