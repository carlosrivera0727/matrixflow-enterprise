export const formatDate = (value: string | Date | null | undefined) => {
  if (!value) {
    return "Sin fecha";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
  }).format(date);
};

export const formatCurrency = (
  value: number | null | undefined,
  currency = "PEN",
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "S/ 0.00";
  }

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
  }).format(value);
};