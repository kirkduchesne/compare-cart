export function bestProducts(products) {
  if (!products.length) return [];
  const best = products.reduce((lowest, item) => item.cents * lowest.units < lowest.cents * item.units ? item : lowest);
  return products.filter(item => item.cents * best.units === best.cents * item.units);
}
