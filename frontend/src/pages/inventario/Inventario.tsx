import { useEffect, useMemo, useState } from "react";

import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Boxes,
  Edit3,
  Plus,
  Search,
} from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import { apiClient } from "../../services/api/client";

import type {
  Branch,
  InventoryItem,
  InventoryMovement,
  Product,
} from "../../types";

type Tab = "existencias" | "movimientos";

type AdjustmentForm = {
  stock: number;
  reason: string;
};

type CreateInventoryForm = {
  productId: string;
  branchId: string;
  stock: number;
};

const emptyAdjustment: AdjustmentForm = {
  stock: 0,
  reason: "",
};

const emptyCreateInventory: CreateInventoryForm = {
  productId: "",
  branchId: "",
  stock: 0,
};

const movementStyle = {
  Entrada: {
    icon: ArrowUp,
    label: "Entrada",
  },
  Salida: {
    icon: ArrowDown,
    label: "Salida",
  },
  Ajuste: {
    icon: ArrowLeftRight,
    label: "Ajuste",
  },
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function Inventario() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [activeTab, setActiveTab] = useState<Tab>("existencias");
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [form, setForm] = useState<AdjustmentForm>(emptyAdjustment);

  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] =
    useState<CreateInventoryForm>(emptyCreateInventory);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        inventoryResponse,
        movementsResponse,
        productsResponse,
        branchesResponse,
      ] = await Promise.all([
        apiClient.get<InventoryItem[]>("/inventory"),
        apiClient.get<InventoryMovement[]>("/inventory/movements"),
        apiClient.get<Product[]>("/products"),
        apiClient.get<Branch[]>("/branches"),
      ]);

      setInventory(inventoryResponse.data);
      setMovements(movementsResponse.data);
      setProducts(productsResponse.data);
      setBranches(branchesResponse.data);
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.detail ||
        "No se pudo cargar la información del inventario.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const productMap = useMemo(() => {
    return new Map(products.map((product) => [product.id, product]));
  }, [products]);

  const branchMap = useMemo(() => {
    return new Map(branches.map((branch) => [branch.id, branch]));
  }, [branches]);

  const filteredInventory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const product = productMap.get(item.productId);
      const branch = branchMap.get(item.branchId);

      const matchesSearch =
        !normalizedSearch ||
        product?.name.toLowerCase().includes(normalizedSearch) ||
        product?.sku.toLowerCase().includes(normalizedSearch) ||
        branch?.name.toLowerCase().includes(normalizedSearch);

      const matchesBranch =
        branchFilter === "all" ||
        item.branchId === Number(branchFilter);

      return matchesSearch && matchesBranch;
    });
  }, [
    inventory,
    productMap,
    branchMap,
    search,
    branchFilter,
  ]);

  const filteredMovements = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return movements.filter((movement) => {
      const product = productMap.get(movement.productId);
      const branch = branchMap.get(movement.branchId);

      const matchesSearch =
        !normalizedSearch ||
        product?.name.toLowerCase().includes(normalizedSearch) ||
        product?.sku.toLowerCase().includes(normalizedSearch) ||
        branch?.name.toLowerCase().includes(normalizedSearch) ||
        movement.reason.toLowerCase().includes(normalizedSearch) ||
        movement.user.toLowerCase().includes(normalizedSearch);

      const matchesBranch =
        branchFilter === "all" ||
        movement.branchId === Number(branchFilter);

      return matchesSearch && matchesBranch;
    });
  }, [
    movements,
    productMap,
    branchMap,
    search,
    branchFilter,
  ]);

  const totalUnits = inventory.reduce(
    (total, item) => total + item.stock,
    0,
  );

  const lowStockCount = inventory.filter((item) => {
    const product = productMap.get(item.productId);

    return product
      ? item.stock <= product.minimumStock
      : false;
  }).length;

  const openCreateInventory = () => {
    setCreateForm(emptyCreateInventory);
    setError("");
    setCreating(true);
  };

  const closeCreateInventory = () => {
    if (saving) {
      return;
    }

    setCreating(false);
    setCreateForm(emptyCreateInventory);
    setError("");
  };

  const saveNewInventory = async () => {
    const productId = Number(createForm.productId);
    const branchId = Number(createForm.branchId);

    if (!productId) {
      setError("Selecciona un producto.");
      return;
    }

    if (!branchId) {
      setError("Selecciona una sucursal.");
      return;
    }

    if (createForm.stock < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }

    const alreadyExists = inventory.some(
      (item) =>
        item.productId === productId &&
        item.branchId === branchId,
    );

    if (alreadyExists) {
      setError(
        "Ese producto ya tiene inventario registrado en esa sucursal.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiClient.post("/inventory", {
        product_id: productId,
        branch_id: branchId,
        stock: createForm.stock,
      });

      setCreating(false);
      setCreateForm(emptyCreateInventory);

      await loadData();

      setActiveTab("existencias");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.detail ||
        "No se pudo agregar el producto al inventario.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const openAdjustment = (item: InventoryItem) => {
    setEditing(item);

    setForm({
      stock: item.stock,
      reason: "",
    });

    setError("");
  };

  const closeAdjustment = () => {
    if (saving) {
      return;
    }

    setEditing(null);
    setForm(emptyAdjustment);
    setError("");
  };

  const saveAdjustment = async () => {
    if (!editing) {
      return;
    }

    if (form.stock < 0) {
      setError("El stock no puede ser negativo.");
      return;
    }

    if (form.reason.trim().length < 5) {
      setError("El motivo debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiClient.patch(`/inventory/${editing.id}`, {
        stock: form.stock,
        reason: form.reason.trim(),
      });

      setEditing(null);
      setForm(emptyAdjustment);

      await loadData();

      setActiveTab("movimientos");
    } catch (err: any) {
      console.error(err);

      const message =
        err?.response?.data?.detail ||
        "No se pudo actualizar el inventario.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventario"
        description="Control de existencias y movimientos de inventario."
      />

      {error && !editing && !creating && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Unidades disponibles
              </p>

              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {totalUnits.toLocaleString("es-PE")}
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-3">
              <Boxes className="h-6 w-6 text-slate-700" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Movimientos registrados
          </p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {movements.length.toLocaleString("es-PE")}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Alertas de stock bajo
          </p>

          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {lowStockCount.toLocaleString("es-PE")}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("existencias")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "existencias"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Existencias
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("movimientos")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                activeTab === "movimientos"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Movimientos
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 sm:w-64"
              />
            </div>

            <select
              value={branchFilter}
              onChange={(event) =>
                setBranchFilter(event.target.value)
              }
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              <option value="all">
                Todas las sucursales
              </option>

              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>

            {activeTab === "existencias" && (
              <button
                type="button"
                onClick={openCreateInventory}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Agregar inventario
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center p-8">
            <p className="text-sm text-slate-500">
              Cargando inventario...
            </p>
          </div>
        ) : activeTab === "existencias" ? (
          <div className="overflow-x-auto">
            {filteredInventory.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No se encontraron existencias.
              </div>
            ) : (
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Producto
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Sucursal
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Stock mínimo
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Estado
                    </th>

                    <th className="px-6 py-4 text-right font-medium">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredInventory.map((item) => {
                    const product = productMap.get(item.productId);
                    const branch = branchMap.get(item.branchId);

                    const isLowStock = product
                      ? item.stock <= product.minimumStock
                      : false;

                    return (
                      <tr
                        key={item.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {product?.name ??
                                `Producto #${item.productId}`}
                            </p>

                            <p className="text-xs text-slate-500">
                              {product?.sku ?? "Sin SKU"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {branch?.name ??
                            `Sucursal #${item.branchId}`}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`font-semibold ${
                              isLowStock
                                ? "text-amber-600"
                                : "text-slate-900"
                            }`}
                          >
                            {item.stock.toLocaleString("es-PE")}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {product?.minimumStock?.toLocaleString(
                            "es-PE",
                          ) ?? "-"}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              isLowStock
                                ? "bg-amber-100 text-amber-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {isLowStock
                              ? "Stock bajo"
                              : "Stock normal"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              openAdjustment(item)
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          >
                            <Edit3 className="h-4 w-4" />
                            Ajustar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredMovements.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No se encontraron movimientos.
              </div>
            ) : (
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">
                      Tipo
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Producto
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Sucursal
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Cantidad
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Stock
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Motivo
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Usuario
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Fecha
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredMovements.map((movement) => {
                    const product = productMap.get(
                      movement.productId,
                    );

                    const branch = branchMap.get(
                      movement.branchId,
                    );

                    const style =
                      movementStyle[
                        movement.type as keyof typeof movementStyle
                      ] ?? movementStyle.Ajuste;

                    const Icon = style.icon;

                    return (
                      <tr
                        key={movement.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-slate-100 p-2">
                              <Icon className="h-4 w-4 text-slate-700" />
                            </div>

                            <span className="font-medium text-slate-700">
                              {style.label}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {product?.name ??
                                `Producto #${movement.productId}`}
                            </p>

                            <p className="text-xs text-slate-500">
                              {product?.sku ?? "Sin SKU"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {branch?.name ??
                            `Sucursal #${movement.branchId}`}
                        </td>

                        <td className="px-6 py-4 font-medium text-slate-900">
                          {movement.quantity.toLocaleString(
                            "es-PE",
                          )}
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {movement.previousStock} →{" "}
                          {movement.newStock}
                        </td>

                        <td className="max-w-[220px] px-6 py-4 text-slate-600">
                          <span className="line-clamp-2">
                            {movement.reason}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {movement.user}
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(movement.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal para agregar inventario */}
      {creating && (
        <Modal
          open={true}
          onClose={closeCreateInventory}
          title="Agregar al inventario"
        >
          <div className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Producto
              </label>

              <select
                value={createForm.productId}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    productId: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option value="">
                  Selecciona un producto
                </option>

                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} — {product.sku}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sucursal
              </label>

              <select
                value={createForm.branchId}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    branchId: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
              >
                <option value="">
                  Selecciona una sucursal
                </option>

                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Stock inicial
              </label>

              <input
                type="number"
                min={0}
                value={createForm.stock}
                onChange={(event) =>
                  setCreateForm((current) => ({
                    ...current,
                    stock: Number(event.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={closeCreateInventory}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveNewInventory}
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : "Agregar al inventario"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de ajuste */}
      {editing && (
        <Modal
          open={true}
          onClose={closeAdjustment}
          title="Ajustar inventario"
        >
          <div className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-slate-900">
                {productMap.get(editing.productId)?.name ??
                  `Producto #${editing.productId}`}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Stock actual:{" "}
                <span className="font-medium text-slate-700">
                  {editing.stock}
                </span>
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Nuevo stock
              </label>

              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    stock: Number(event.target.value),
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Motivo del ajuste
              </label>

              <textarea
                rows={3}
                value={form.reason}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
                placeholder="Ej. Corrección por conteo físico"
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={closeAdjustment}
                disabled={saving}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={saveAdjustment}
                disabled={saving}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Guardando..."
                  : "Guardar ajuste"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}