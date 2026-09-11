const euroFormatter = new Intl.NumberFormat(
  'es-ES',
  {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
);

export const formatCurrency = (value) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return euroFormatter.format(0);
  }

  return euroFormatter.format(numericValue);
};

export default formatCurrency;