import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, ReceiptText, Search, ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import KpiCard from "../../components/common/KpiCard";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { saleSchema, type SaleFormData } from "../../schemas";
import type { Branch, Product, Sale } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { apiClient } from "../../services/api/client";

export default function Ventas() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const currency = "PEN";

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      branchId: 0,
      productId: 0,
      quantity: 1,
    },
  });

  const selectedProductId = useWatch({
    control,
    name: "productId",
  });

  const watchedQuantity = useWatch({
    control,
    name: "quantity",
  });

  const selectedProduct = products.find(
    (product) => product.id === Number(selectedProductId),
  );

  const quantity = Number(watchedQuantity) || 0;

  const loadData = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [salesResponse, branchesResponse, productsResponse] =
        await Promise.all([
          apiClient.get<Sale[]>("/sales"),
          apiClient.get<Branch[]>("/branches"),
          apiClient.get<Product[]>("/products"),
        ]);

      setSales(salesResponse.data);
      setBranches(branchesResponse.data);
      setProducts(productsResponse.data);
    } catch (error: any) {
      setMessage(
        error?.response?.data?.detail ??
          "No se pudieron cargar las ventas.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(
    () =>
      sales.filter((sale) => {
        const branch =
          branches.find((item) => item.id === sale.branchId)?.name ?? "";

        const product =
          products.find((item) => item.id === sale.productId)?.name ?? "";

        return `${sale.code} ${branch} ${product}`
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
    [sales, branches, products, search],
  );

  const total = sales.reduce((sum, sale) => sum + sale.total, 0);

  const submit = async (data: SaleFormData) => {
    try {
      setSaving(true);
      setMessage("");

      await apiClient.post("/sales", {
        branch_id: data.branchId,
        product_id: data.productId,
        quantity: data.quantity,
      });

      setMessage(
        "Venta registrada correctamente. El inventario fue actualizado.",
      );

      setOpen(false);

      reset({
        branchId: 0,
        productId: 0,
        quantity: 1,
      });

      await loadData();
    } catch (error: any) {
      setMessage(
        error?.response?.data?.detail ??
          "No se pudo registrar la venta.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Operaciones comerciales"
        title="Ventas"
        description="Registra ventas y consulta su impacto en el inventario."
        action={
          <button
            onClick={() => {
              setMessage("");
              setOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Registrar venta
          </button>
        }
      />

      <section className="space-y-5 p-4 sm:p-6 lg:p-8">
        {message && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            title="Ingresos registrados"
            value={formatCurrency(total, currency)}
            change="12.5%"
            trend="up"
            icon={ShoppingCart}
          />

          <KpiCard
            title="Operaciones"
            value={String(sales.length)}
            change="Ventas registradas"
            trend="up"
            icon={ReceiptText}
          />

          <KpiCard
            title="Ticket promedio"
            value={formatCurrency(
              total / Math.max(1, sales.length),
              currency,
            )}
            icon={ReceiptText}
          />
        </div>

        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={18}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar venta, producto o sucursal"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Código</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Sucursal</th>
                  <th className="px-5 py-4">Producto</th>
                  <th className="px-5 py-4">Cantidad</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      Cargando ventas...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-slate-500"
                    >
                      No hay ventas registradas.
                    </td>
                  </tr>
                ) : (
                  filtered.map((sale) => (
                    <tr
                      key={sale.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-semibold text-blue-700">
                        {sale.code}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                        {formatDate(sale.date)}
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {
                          branches.find(
                            (item) => item.id === sale.branchId,
                          )?.name
                        }
                      </td>

                      <td className="px-5 py-4 text-slate-700">
                        {
                          products.find(
                            (item) => item.id === sale.productId,
                          )?.name
                        }
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {sale.quantity}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-900">
                        {formatCurrency(sale.total, currency)}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge label={sale.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Registrar venta"
        description="El stock se descontará automáticamente del inventario."
      >
        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-slate-700">
            Sucursal

            <select
              {...register("branchId", {
                valueAsNumber: true,
              })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            >
              <option value={0}>
                Selecciona una sucursal
              </option>

              {branches
                .filter((branch) => branch.status === "Activa")
                .map((branch) => (
                  <option
                    key={branch.id}
                    value={branch.id}
                  >
                    {branch.name}
                  </option>
                ))}
            </select>

            {errors.branchId && (
              <span className="text-xs text-rose-600">
                {errors.branchId.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Producto

            <select
              {...register("productId", {
                valueAsNumber: true,
              })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            >
              <option value={0}>
                Selecciona un producto
              </option>

              {products
                .filter((product) => product.status === "Activo")
                .map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </option>
                ))}
            </select>

            {errors.productId && (
              <span className="text-xs text-rose-600">
                {errors.productId.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Cantidad

            <input
              {...register("quantity", {
                valueAsNumber: true,
              })}
              type="number"
              min="1"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.quantity && (
              <span className="text-xs text-rose-600">
                {errors.quantity.message}
              </span>
            )}
          </label>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              Total estimado
            </p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(
                (selectedProduct?.price ?? 0) * quantity,
                currency,
              )}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Registrando..." : "Confirmar venta"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}