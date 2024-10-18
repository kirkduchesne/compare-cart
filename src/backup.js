import { loadProducts } from './storage';

export function downloadComparison(products, unit) {
  const content = JSON.stringify({ version: 2, products, unit }, null, 2);
  const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'compare-cart.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseBackup(text) {
  if (typeof text !== 'string' || text.length > 16000) throw new Error('Choose a comparison JSON file smaller than 16 KB.');
  const loaded = loadProducts({ getItem: () => text });
  if (!loaded.readable) throw new Error('This file is not a valid comparison backup.');
  return { products: loaded.products, unit: loaded.unit };
}
