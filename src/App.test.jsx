import React from 'react';
import { afterEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from './App';

afterEach(() => {
  cleanup();
  localStorage.clear();
});
test('rejects blank names and adds a product as text', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Add product'));
  expect(screen.getByRole('alert').textContent).toContain('product name');
  fireEvent.change(screen.getByLabelText('Product name'), { target: { value: '<b>Oats</b>' } });
  fireEvent.change(screen.getByLabelText('Pack price ($)'), { target: { value: '4.25' } });
  fireEvent.click(screen.getByText('Add product'));
  expect(screen.getByText('<b>Oats</b>')).toBeTruthy();
});

test('compares two packs and removes the cheapest option', () => {
  render(<App />);
  function add(name, price, units) {
    fireEvent.change(screen.getByLabelText('Product name'), { target: { value: name } });
    fireEvent.change(screen.getByLabelText('Pack price ($)'), { target: { value: price } });
    fireEvent.change(screen.getByLabelText('Units per pack'), { target: { value: units } });
    fireEvent.click(screen.getByText('Add product'));
  }
  add('Small', '3.00', '2');
  add('Large', '5.00', '5');
  expect(screen.getByText('Best unit price').closest('li').textContent).toContain('Large');
  fireEvent.click(screen.getByRole('button', { name: 'Remove Large' }));
  expect(screen.getByText('Best unit price').closest('li').textContent).toContain('Small');
  expect(document.activeElement.id).toBe('name');
});

test('rejects invalid pack sizes without changing the list', () => {
  render(<App />);
  fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Oats' } });
  fireEvent.change(screen.getByLabelText('Pack price ($)'), { target: { value: '3.00' } });
  fireEvent.change(screen.getByLabelText('Units per pack'), { target: { value: '1.5' } });
  fireEvent.click(screen.getByText('Add product'));
  expect(screen.getByRole('alert').textContent).toContain('whole number');
  expect(screen.queryAllByRole('listitem')).toHaveLength(0);
});

test('new IDs remain valid when loaded IDs are large', () => {
  localStorage.setItem(
    'compare-cart-v1',
    JSON.stringify([{ id: Number.MAX_SAFE_INTEGER - 1, name: 'Existing', cents: 100, units: 1 }])
  );
  render(<App />);
  fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'New' } });
  fireEvent.change(screen.getByLabelText('Pack price ($)'), { target: { value: '2.01' } });
  fireEvent.click(screen.getByText('Add product'));
  const saved = JSON.parse(localStorage.getItem('compare-cart-v1'));
  expect(saved.products[1].id).toBe(1);
});


test('edits a product without adding a duplicate and can cancel', () => {
  localStorage.setItem('compare-cart-v1', JSON.stringify([{ id: 1, name: 'Oats', cents: 200, units: 2 }]));
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Edit Oats' }));
  fireEvent.change(screen.getByLabelText('Pack price ($)'), { target: { value: '3.00' } });
  fireEvent.click(screen.getByText('Save changes'));
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(screen.getByText('$1.50 per unit')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Edit Oats' }));
  fireEvent.change(screen.getByLabelText('Product name'), { target: { value: 'Discarded' } });
  fireEvent.click(screen.getByText('Cancel edit'));
  expect(screen.queryByText('Discarded')).toBeNull();
});
