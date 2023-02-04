import { expect, test } from 'vitest';
import { parsePrice, formatPrice } from './money';

test('stores prices as integer cents', () => {
  expect(parsePrice('0.10') + parsePrice('0.20')).toBe(30);
  expect(formatPrice(425)).toBe('$4.25');
});
test('rejects ambiguous and invalid prices', () => {
  ['', '0', '-1', 'Infinity', '1e2', '1.234', '100000'].forEach(value => expect(parsePrice(value)).toBeNull());
});
