import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

afterEach(cleanup);
test('rejects blank names and adds a product as text', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Add product'));
  expect(screen.getByRole('alert').textContent).toContain('product name');
  fireEvent.change(screen.getByLabelText('Product name'), { target: { value: '<b>Oats</b>' } });
  fireEvent.click(screen.getByText('Add product'));
  expect(screen.getByText('<b>Oats</b>')).toBeTruthy();
});
