import type { MockState } from "../types";

const today = new Date();
const isoDaysAgo = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const initialMockState: MockState = {
  company: {
    name: "MatrixFlow Enterprise S.A.C.",
    taxId: "20601234567",
    sector: "Tecnología y comercio",
    email: "contacto@matrixflow.pe",
    phone: "+51 1 555 0142",
    address: "Av. Javier Prado 2450, San Borja, Lima",
  },
  branches: [
    { id: 1, name: "Sucursal Lima Centro", city: "Lima", address: "Av. Garcilaso 1250", status: "Activa" },
    { id: 2, name: "Sucursal Arequipa", city: "Arequipa", address: "Calle Mercaderes 318", status: "Activa" },
    { id: 3, name: "Sucursal Trujillo", city: "Trujillo", address: "Jr. Pizarro 650", status: "Activa" },
    { id: 4, name: "Sucursal Cusco", city: "Cusco", address: "Av. El Sol 420", status: "Activa" },
    { id: 5, name: "Sucursal Piura", city: "Piura", address: "Av. Grau 880", status: "Activa" },
  ],
  products: [
    { id: 1, sku: "TEC-LAP-001", name: "Laptop empresarial", category: "Computadoras", price: 3299, minimumStock: 8, status: "Activo" },
    { id: 2, sku: "TEC-PC-002", name: "PC de escritorio", category: "Computadoras", price: 2499, minimumStock: 6, status: "Activo" },
    { id: 3, sku: "PER-MON-003", name: "Monitor 24 pulgadas", category: "Periféricos", price: 699, minimumStock: 12, status: "Activo" },
    { id: 4, sku: "PER-TEC-004", name: "Teclado mecánico", category: "Periféricos", price: 249, minimumStock: 15, status: "Activo" },
    { id: 5, sku: "PER-MOU-005", name: "Mouse inalámbrico", category: "Periféricos", price: 119, minimumStock: 18, status: "Activo" },
  ],
  inventory: [
    { id: 1, branchId: 1, productId: 1, stock: 42, updatedAt: isoDaysAgo(0) },
    { id: 2, branchId: 1, productId: 2, stock: 26, updatedAt: isoDaysAgo(1) },
    { id: 3, branchId: 1, productId: 3, stock: 54, updatedAt: isoDaysAgo(0) },
    { id: 4, branchId: 2, productId: 1, stock: 18, updatedAt: isoDaysAgo(2) },
    { id: 5, branchId: 2, productId: 4, stock: 36, updatedAt: isoDaysAgo(1) },
    { id: 6, branchId: 3, productId: 3, stock: 8, updatedAt: isoDaysAgo(0) },
    { id: 7, branchId: 3, productId: 5, stock: 64, updatedAt: isoDaysAgo(3) },
    { id: 8, branchId: 4, productId: 2, stock: 11, updatedAt: isoDaysAgo(1) },
    { id: 9, branchId: 4, productId: 4, stock: 7, updatedAt: isoDaysAgo(0) },
    { id: 10, branchId: 5, productId: 5, stock: 29, updatedAt: isoDaysAgo(2) },
  ],
  sales: [
    { id: 1, code: "V-0008", branchId: 1, productId: 1, quantity: 3, unitPrice: 3299, total: 9897, date: isoDaysAgo(0), status: "Completada" },
    { id: 2, code: "V-0007", branchId: 2, productId: 3, quantity: 7, unitPrice: 699, total: 4893, date: isoDaysAgo(1), status: "Completada" },
    { id: 3, code: "V-0006", branchId: 3, productId: 5, quantity: 14, unitPrice: 119, total: 1666, date: isoDaysAgo(2), status: "Completada" },
    { id: 4, code: "V-0005", branchId: 4, productId: 2, quantity: 2, unitPrice: 2499, total: 4998, date: isoDaysAgo(4), status: "Completada" },
    { id: 5, code: "V-0004", branchId: 5, productId: 4, quantity: 9, unitPrice: 249, total: 2241, date: isoDaysAgo(6), status: "Completada" },
    { id: 6, code: "V-0003", branchId: 1, productId: 3, quantity: 12, unitPrice: 699, total: 8388, date: isoDaysAgo(9), status: "Completada" },
  ],
  vectors: [
    { id: 1, name: "Ventas Lima", description: "Unidades vendidas por producto", values: [35, 22, 48, 61, 74], createdAt: isoDaysAgo(2) },
    { id: 2, name: "Meta Lima", description: "Meta mensual por producto", values: [40, 25, 45, 60, 70], createdAt: isoDaysAgo(2) },
    { id: 3, name: "Precios", description: "Precio unitario referencial", values: [3299, 2499, 699, 249, 119], createdAt: isoDaysAgo(4) },
  ],
  matrices: [
    { id: 1, name: "Ventas por sucursal", description: "Filas: sucursales; columnas: productos", values: [[35, 22, 48], [18, 15, 31], [21, 19, 27]], createdAt: isoDaysAgo(2) },
    { id: 2, name: "Metas trimestrales", description: "Metas para tres sucursales", values: [[40, 25, 45], [20, 18, 30], [22, 20, 30]], createdAt: isoDaysAgo(3) },
    { id: 3, name: "Factores de ponderación", description: "Pesos para indicadores", values: [[1, 0.8, 0.5], [0.9, 1, 0.7], [0.6, 0.8, 1]], createdAt: isoDaysAgo(5) },
  ],
  operations: [
    { id: 1, type: "Producto escalar", category: "Vector", inputs: "Ventas Lima · Precios", result: 221535, createdAt: isoDaysAgo(1), user: "Ana Torres", status: "Completada" },
    { id: 2, type: "Resta", category: "Matriz", inputs: "Ventas por sucursal − Metas trimestrales", result: [[-5, -3, 3], [-2, -3, 1], [-1, -1, -3]], createdAt: isoDaysAgo(2), user: "Ana Torres", status: "Completada" },
  ],
  users: [
    { id: 1, name: "Ana Torres", email: "admin@matrixflow.pe", role: "Administrador", status: "Activo" },
    { id: 2, name: "Luis Mendoza", email: "analista@matrixflow.pe", role: "Analista", status: "Activo" },
    { id: 3, name: "Carla Rojas", email: "consulta@matrixflow.pe", role: "Consulta", status: "Activo" },
  ],
  settings: {
    currency: "PEN",
    lowStockNotifications: true,
    compactTables: false,
  },
};
