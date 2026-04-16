export type Currency = "USD";

export const parseMoney = (value: string) => {
  const num = Number.parseFloat(value);
  return Number.isFinite(num) && num > 0 ? num : 0;
};

export const formatMoney = (value: number, currency: Currency = "USD") => {
  const formatted = value.toLocaleString("es-CO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `$${formatted} ${currency}`;
};

export const formatPercent = (value: number) => {
  if (value > 0 && value < 1) return `${value.toFixed(1)}%`;
  return `${value.toFixed(0)}%`;
};
