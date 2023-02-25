import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

afterEach(cleanup);
test('rounds half cents upward for display', () => {
  render(<ProductCard product={{ name: 'Pair', cents: 201, units: 2 }} best={true} onRemove={() => {}} />);
  expect(screen.getByText('$1.01 per unit')).toBeTruthy();
});
