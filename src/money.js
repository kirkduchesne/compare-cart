export function parsePrice(value) {
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(value)) return null;
  const [whole, fraction = ''] = value.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return cents > 0 ? cents : null;
}

export function formatPrice(cents) {
  return '$' + (cents / 100).toFixed(2);
}
