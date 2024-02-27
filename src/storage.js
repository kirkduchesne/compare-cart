const key = 'compare-cart-v1';
export const unitLabels = ['items', 'grams', 'milliliters'];

export function loadProducts(storage) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { products: [], unit: 'items', readable: true, warning: '' };
    const data = JSON.parse(raw);
    const legacy = Array.isArray(data);
    const products = legacy ? data : data.products;
    const unit = legacy ? 'items' : data.unit;
    if (!legacy && data.version !== 2) throw new Error('Unknown saved version');
    if (!unitLabels.includes(unit)) throw new Error('Invalid unit label');
    if (
      !Array.isArray(products) ||
      products.length > 6 ||
      !products.every(
        (product) =>
          product &&
          Number.isSafeInteger(product.id) &&
          product.id > 0 &&
          product.id < Number.MAX_SAFE_INTEGER &&
          typeof product.name === 'string' &&
          product.name.trim().length > 0 &&
          product.name.length <= 80 &&
          Number.isInteger(product.cents) &&
          product.cents > 0 &&
          product.cents <= 9999999 &&
          Number.isInteger(product.units) &&
          product.units >= 1 &&
          product.units <= 1000
      ) ||
      new Set(products.map((product) => product.id)).size !== products.length
    )
      throw new Error('Invalid products');
    return { products, unit, readable: true, warning: '' };
  } catch {
    return {
      products: [],
      unit: 'items',
      readable: false,
      warning:
        'Saved products could not be loaded. Changes are session-only; existing storage is preserved.',
    };
  }
}

export function saveProducts(products, storage, unit = 'items') {
  try {
    storage.setItem(key, JSON.stringify({ version: 2, products, unit }));
    return '';
  } catch {
    return 'Changes could not be saved. Keep this page open to retain them.';
  }
}
