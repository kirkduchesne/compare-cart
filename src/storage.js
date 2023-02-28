const key = 'compare-cart-v1';

export function loadProducts(storage) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { products: [], readable: true, warning: '' };
    const products = JSON.parse(raw);
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
    return { products, readable: true, warning: '' };
  } catch {
    return {
      products: [],
      readable: false,
      warning:
        'Saved products could not be loaded. Changes are session-only; existing storage is preserved.',
    };
  }
}

export function saveProducts(products, storage) {
  try {
    storage.setItem(key, JSON.stringify(products));
    return '';
  } catch {
    return 'Changes could not be saved. Keep this page open to retain them.';
  }
}
