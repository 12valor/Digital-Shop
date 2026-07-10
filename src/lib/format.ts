export function formatPeso(cents: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function getDiscountPercent(priceCents: number, salePriceCents: number | null) {
  if (!salePriceCents || salePriceCents >= priceCents || priceCents <= 0) {
    return 0;
  }

  return Math.round(((priceCents - salePriceCents) / priceCents) * 100);
}
