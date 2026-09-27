import type { OperationResult } from "../types";

export const formatCurrency = (value: number, currency: "PEN" | "USD" = "PEN") =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export const formatResult = (result: OperationResult) => {
  if (typeof result === "number") return new Intl.NumberFormat("es-PE", { maximumFractionDigits: 3 }).format(result);
  if (Array.isArray(result[0])) return (result as number[][]).map((row) => `[ ${row.join("  ")} ]`).join("\n");
  return `[ ${(result as number[]).join(", ")} ]`;
};
