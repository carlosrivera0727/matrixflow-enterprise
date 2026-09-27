/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { initialMockState } from "../data/mockData";
import type {
  AppSettings,
  Branch,
  CompanyProfile,
  InventoryMovement,
  MatrixRecord,
  MockState,
  OperationRecord,
  Product,
  Sale,
  UserRecord,
  VectorRecord,
} from "../types";

type WithoutId<T> = Omit<T, "id">;

interface MockStoreValue extends MockState {
  saveCompany: (company: WithoutId<CompanyProfile> & { id?: number }) => void;
  removeCompany: (id: number) => boolean;
  saveBranch: (branch: WithoutId<Branch> & { id?: number }) => void;
  removeBranch: (id: number) => boolean;
  saveProduct: (product: WithoutId<Product> & { id?: number }) => void;
  removeProduct: (id: number) => boolean;
  addSale: (sale: Pick<Sale, "branchId" | "productId" | "quantity">) => { ok: boolean; message: string };
  adjustInventory: (id: number, stock: number, reason: string, user: string) => void;
  saveVector: (vector: WithoutId<VectorRecord> & { id?: number }) => void;
  removeVector: (id: number) => void;
  saveMatrix: (matrix: WithoutId<MatrixRecord> & { id?: number }) => void;
  removeMatrix: (id: number) => void;
  addOperation: (operation: WithoutId<OperationRecord>) => void;
  saveUser: (user: WithoutId<UserRecord> & { id?: number }) => void;
  removeUser: (id: number) => void;
  updateSettings: (settings: AppSettings) => void;
  resetDemo: () => void;
}

const STORAGE_KEY = "matrixflow_demo_data_v1";
const MockStoreContext = createContext<MockStoreValue | null>(null);
const nextId = (items: { id: number }[]) => Math.max(0, ...items.map((item) => item.id)) + 1;

function loadInitialState(): MockState {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return initialMockState;
  try {
    const parsed = JSON.parse(stored) as Partial<MockState> & {
      company?: Omit<CompanyProfile, "id" | "status">;
    };
    const companies = parsed.companies ?? (parsed.company
      ? [{ ...parsed.company, id: 1, status: "Activa" as const }]
      : initialMockState.companies);
    const branches = (parsed.branches ?? initialMockState.branches).map((branch) => ({
      ...branch,
      companyId: branch.companyId ?? companies[0]?.id ?? 1,
    }));
    return {
      ...initialMockState,
      ...parsed,
      companies,
      branches,
      inventoryMovements: parsed.inventoryMovements ?? initialMockState.inventoryMovements,
    };
  } catch {
    return initialMockState;
  }
}

export function MockStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>(loadInitialState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<MockStoreValue>(() => ({
    ...state,
    saveCompany: (company) => setState((current) => ({
      ...current,
      companies: company.id
        ? current.companies.map((item) => item.id === company.id ? { ...item, ...company } as CompanyProfile : item)
        : [...current.companies, { ...company, id: nextId(current.companies) } as CompanyProfile],
    })),
    removeCompany: (id) => {
      if (state.branches.some((branch) => branch.companyId === id)) return false;
      setState((current) => ({ ...current, companies: current.companies.filter((item) => item.id !== id) }));
      return true;
    },
    saveBranch: (branch) => setState((current) => ({
      ...current,
      branches: branch.id
        ? current.branches.map((item) => item.id === branch.id ? { ...item, ...branch } as Branch : item)
        : [...current.branches, { ...branch, id: nextId(current.branches) } as Branch],
    })),
    removeBranch: (id) => {
      if (state.sales.some((sale) => sale.branchId === id) || state.inventory.some((item) => item.branchId === id)) return false;
      setState((current) => ({ ...current, branches: current.branches.filter((item) => item.id !== id) }));
      return true;
    },
    saveProduct: (product) => setState((current) => ({
      ...current,
      products: product.id
        ? current.products.map((item) => item.id === product.id ? { ...item, ...product } as Product : item)
        : [...current.products, { ...product, id: nextId(current.products) } as Product],
    })),
    removeProduct: (id) => {
      if (state.sales.some((sale) => sale.productId === id) || state.inventory.some((item) => item.productId === id)) return false;
      setState((current) => ({ ...current, products: current.products.filter((item) => item.id !== id) }));
      return true;
    },
    addSale: ({ branchId, productId, quantity }) => {
      const product = state.products.find((item) => item.id === productId);
      const inventoryItem = state.inventory.find((item) => item.branchId === branchId && item.productId === productId);
      if (!product) return { ok: false, message: "El producto seleccionado no existe." };
      if (!inventoryItem || inventoryItem.stock < quantity) return { ok: false, message: "No existe stock suficiente en esa sucursal." };
      const id = nextId(state.sales);
      const sale: Sale = {
        id,
        code: `V-${String(id).padStart(4, "0")}`,
        branchId,
        productId,
        quantity,
        unitPrice: product.price,
        total: product.price * quantity,
        date: new Date().toISOString(),
        status: "Completada",
      };
      setState((current) => ({
        ...current,
        sales: [sale, ...current.sales],
        inventory: current.inventory.map((item) => item.id === inventoryItem.id
          ? { ...item, stock: item.stock - quantity, updatedAt: new Date().toISOString() }
          : item),
        inventoryMovements: [{
          id: nextId(current.inventoryMovements),
          inventoryId: inventoryItem.id,
          branchId,
          productId,
          type: "Salida",
          quantity,
          previousStock: inventoryItem.stock,
          newStock: inventoryItem.stock - quantity,
          reason: `Venta ${sale.code}`,
          user: "Sistema de ventas",
          createdAt: sale.date,
        } as InventoryMovement, ...current.inventoryMovements],
      }));
      return { ok: true, message: `Venta ${sale.code} registrada correctamente.` };
    },
    adjustInventory: (id, stock, reason, user) => setState((current) => {
      const item = current.inventory.find((inventoryItem) => inventoryItem.id === id);
      if (!item) return current;
      const safeStock = Math.max(0, stock);
      const createdAt = new Date().toISOString();
      const movement: InventoryMovement = {
        id: nextId(current.inventoryMovements),
        inventoryId: item.id,
        branchId: item.branchId,
        productId: item.productId,
        type: "Ajuste",
        quantity: Math.abs(safeStock - item.stock),
        previousStock: item.stock,
        newStock: safeStock,
        reason,
        user,
        createdAt,
      };
      return {
        ...current,
        inventory: current.inventory.map((inventoryItem) => inventoryItem.id === id
          ? { ...inventoryItem, stock: safeStock, updatedAt: createdAt }
          : inventoryItem),
        inventoryMovements: [movement, ...current.inventoryMovements],
      };
    }),
    saveVector: (vector) => setState((current) => ({
      ...current,
      vectors: vector.id
        ? current.vectors.map((item) => item.id === vector.id ? { ...item, ...vector } as VectorRecord : item)
        : [{ ...vector, id: nextId(current.vectors) } as VectorRecord, ...current.vectors],
    })),
    removeVector: (id) => setState((current) => ({ ...current, vectors: current.vectors.filter((item) => item.id !== id) })),
    saveMatrix: (matrix) => setState((current) => ({
      ...current,
      matrices: matrix.id
        ? current.matrices.map((item) => item.id === matrix.id ? { ...item, ...matrix } as MatrixRecord : item)
        : [{ ...matrix, id: nextId(current.matrices) } as MatrixRecord, ...current.matrices],
    })),
    removeMatrix: (id) => setState((current) => ({ ...current, matrices: current.matrices.filter((item) => item.id !== id) })),
    addOperation: (operation) => setState((current) => ({
      ...current,
      operations: [{ ...operation, id: nextId(current.operations) }, ...current.operations],
    })),
    saveUser: (user) => setState((current) => ({
      ...current,
      users: user.id
        ? current.users.map((item) => item.id === user.id ? { ...item, ...user } as UserRecord : item)
        : [...current.users, { ...user, id: nextId(current.users) } as UserRecord],
    })),
    removeUser: (id) => setState((current) => ({ ...current, users: current.users.filter((item) => item.id !== id) })),
    updateSettings: (settings) => setState((current) => ({ ...current, settings })),
    resetDemo: () => setState(initialMockState),
  }), [state]);

  return <MockStoreContext.Provider value={value}>{children}</MockStoreContext.Provider>;
}

export function useMockStore() {
  const context = useContext(MockStoreContext);
  if (!context) throw new Error("useMockStore debe usarse dentro de MockStoreProvider");
  return context;
}
