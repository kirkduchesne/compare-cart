export function bestProducts(products) {
  if (!products.length) return [];
  const best = products.reduce((lowest, item) =>
    item.cents * lowest.units < lowest.cents * item.units ? item : lowest
  );
  return products.filter((item) => item.cents * best.units === best.cents * item.units);
}

export function sortProducts(products, order) {
  const sorted = [...products];
  if (order === 'price') sorted.sort((a, b) => a.cents * b.units - b.cents * a.units);
  if (order === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
  return sorted;
}

export function purchaseFor(product, target) {
  if (!Number.isInteger(target) || target < 1 || target > 10000) return null;
  const packs = Math.ceil(target / product.units);
  return { packs, cents: packs * product.cents, extra: packs * product.units - target };
}
