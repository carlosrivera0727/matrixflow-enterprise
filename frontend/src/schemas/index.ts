import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const branchSchema = z.object({
  name: z.string().min(3, "Ingresa el nombre de la sucursal"),
  city: z.string().min(2, "Ingresa la ciudad"),
  address: z.string().min(5, "Ingresa una dirección válida"),
  status: z.enum(["Activa", "Inactiva"]),
});

export const productSchema = z.object({
  sku: z.string().min(3, "Ingresa un SKU"),
  name: z.string().min(3, "Ingresa el nombre del producto"),
  category: z.string().min(2, "Ingresa una categoría"),
  price: z.number().positive("El precio debe ser mayor a cero"),
  minimumStock: z.number().int().min(0, "El stock mínimo no puede ser negativo"),
  status: z.enum(["Activo", "Inactivo"]),
});

export const saleSchema = z.object({
  branchId: z.number().int().positive("Selecciona una sucursal"),
  productId: z.number().int().positive("Selecciona un producto"),
  quantity: z.number().int().positive("La cantidad debe ser mayor a cero"),
});

export const vectorSchema = z.object({
  name: z.string().min(3, "Ingresa un nombre"),
  description: z.string().min(3, "Ingresa una descripción"),
  values: z.string().refine(
    (value) => value.split(",").every((item) => item.trim() !== "" && Number.isFinite(Number(item))),
    "Usa números separados por comas",
  ),
});

export const userSchema = z.object({
  name: z.string().min(3, "Ingresa el nombre"),
  email: z.string().email("Ingresa un correo válido"),
  role: z.enum(["Administrador", "Analista", "Consulta"]),
  status: z.enum(["Activo", "Inactivo"]),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type BranchFormData = z.infer<typeof branchSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type SaleFormData = z.infer<typeof saleSchema>;
export type VectorFormData = z.infer<typeof vectorSchema>;
export type UserFormData = z.infer<typeof userSchema>;
