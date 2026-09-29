import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, MapPin, Plus, Search, Trash2, Warehouse } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { branchSchema, type BranchFormData } from "../../schemas";
import { apiClient } from "../../services/api/client";
import type { Branch } from "../../types";

type Company = {
  id: number;
  name: string;
  status: "Activa" | "Inactiva";
};

type InventoryRecord = {
  id: number;
  branchId: number;
  stock: number;
};

type SaleRecord = {
  id: number;
  branchId: number;
};

const emptyBranch: BranchFormData = {
  companyId: 0,
  name: "",
  city: "",
  address: "",
  status: "Activa",
};

export default function Sucursales() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Branch | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: emptyBranch,
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        companiesResponse,
        branchesResponse,
        inventoryResponse,
        salesResponse,
      ] = await Promise.all([
        apiClient.get<Company[]>("/companies"),
        apiClient.get<Branch[]>("/branches"),
        apiClient.get<InventoryRecord[]>("/inventory"),
        apiClient.get<SaleRecord[]>("/sales"),
      ]);

      setCompanies(companiesResponse.data);
      setBranches(branchesResponse.data);
      setInventory(inventoryResponse.data);
      setSales(salesResponse.data);
    } catch (error) {
      console.error("Error cargando sucursales:", error);
      setMessage("No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(
    () =>
      branches.filter((branch) =>
        `${branch.name} ${branch.city}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [branches, search],
  );

  const showCreate = () => {
    setEditing(null);
    reset(emptyBranch);
    setOpen(true);
  };

  const showEdit = (branch: Branch) => {
    setEditing(branch);
    reset({
      companyId: branch.companyId,
      name: branch.name,
      city: branch.city,
      address: branch.address,
      status: branch.status,
    });
    setOpen(true);
  };

  const submit = async (data: BranchFormData) => {
    try {
      const payload = {
        company_id: data.companyId,
        name: data.name,
        city: data.city,
        address: data.address,
        status: data.status,
      };

      if (editing) {
        await apiClient.patch(`/branches/${editing.id}`, payload);
        setMessage("Sucursal actualizada.");
      } else {
        await apiClient.post("/branches", payload);
        setMessage("Sucursal registrada.");
      }

      setOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error guardando sucursal:", error);
      setMessage("No se pudo guardar la sucursal.");
    }
  };

  const remove = async (branch: Branch) => {
    if (!window.confirm(`¿Eliminar ${branch.name}?`)) return;

    try {
      await apiClient.delete(`/branches/${branch.id}`);
      setMessage("Sucursal eliminada.");
      await loadData();
    } catch (error) {
      console.error("Error eliminando sucursal:", error);
      setMessage(
        "No se puede eliminar porque tiene ventas o inventario relacionado.",
      );
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Empresa"
        title="Sucursales"
        description="Administra las sedes y su información operativa."
        action={
          <button
            onClick={showCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Nueva sucursal
          </button>
        }
      />

      <section className="space-y-5 p-4 sm:p-6 lg:p-8">
        {message && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search
              className="absolute left-3 top-2.5 text-slate-400"
              size={18}
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o ciudad"
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <p className="text-sm text-slate-500">
            {filtered.length} de {branches.length} sucursales
          </p>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Cargando sucursales...
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((branch) => {
              const units = inventory
                .filter((item) => item.branchId === branch.id)
                .reduce((sum, item) => sum + item.stock, 0);

              const branchSales = sales.filter(
                (sale) => sale.branchId === branch.id,
              ).length;

              return (
                <article
                  key={branch.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
                      <Warehouse size={21} />
                    </div>

                    <StatusBadge label={branch.status} />
                  </div>

                  <h2 className="mt-5 font-semibold text-slate-950">
                    {branch.name}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {companies.find(
                      (company) => company.id === branch.companyId,
                    )?.name ?? "Empresa no disponible"}
                  </p>

                  <p className="mt-2 flex gap-2 text-sm text-slate-500">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0"
                    />
                    {branch.address}, {branch.city}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-lg font-bold text-slate-900">
                        {units}
                      </p>
                      <p className="text-xs text-slate-500">Unidades</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <p className="text-lg font-bold text-slate-900">
                        {branchSales}
                      </p>
                      <p className="text-xs text-slate-500">Ventas</p>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => showEdit(branch)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      aria-label="Editar"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      onClick={() => void remove(branch)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                      aria-label="Eliminar"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Editar sucursal" : "Nueva sucursal"}
        description="Completa la información de la sede."
      >
        <form
          onSubmit={handleSubmit(submit)}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-slate-700">
            Empresa

            <select
              {...register("companyId", { valueAsNumber: true })}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none"
            >
              <option value={0}>Selecciona una empresa</option>

              {companies
                .filter(
                  (company) =>
                    company.status === "Activa" ||
                    company.id === editing?.companyId,
                )
                .map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
            </select>

            {errors.companyId && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.companyId.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Nombre

            <input
              {...register("name")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.name && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Ciudad

            <input
              {...register("city")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.city && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.city.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Dirección

            <input
              {...register("address")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none focus:border-blue-500"
            />

            {errors.address && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.address.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Estado

            <select
              {...register("status")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 outline-none"
            >
              <option>Activa</option>
              <option>Inactiva</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Guardar sucursal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}