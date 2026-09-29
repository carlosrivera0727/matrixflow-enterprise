import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { companySchema, type CompanyFormData } from "../../schemas";
import { apiClient } from "../../services/api/client";
import type { CompanyProfile } from "../../types";

type Branch = {
  id: number;
  companyId: number;
  name: string;
  city: string;
  address: string;
  status: "Activa" | "Inactiva";
};

const emptyCompany: CompanyFormData = {
  name: "",
  taxId: "",
  sector: "",
  email: "",
  phone: "",
  address: "",
  status: "Activa",
};

export default function Empresa() {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [editing, setEditing] = useState<CompanyProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: emptyCompany,
  });

  const loadData = async () => {
    try {
      setLoading(true);

      const [companiesResponse, branchesResponse] = await Promise.all([
        apiClient.get<CompanyProfile[]>("/companies"),
        apiClient.get<Branch[]>("/branches"),
      ]);

      setCompanies(companiesResponse.data);
      setBranches(branchesResponse.data);
    } catch (error) {
      console.error("Error cargando empresas:", error);
      setMessage("No se pudieron cargar las empresas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const showCreate = () => {
    setEditing(null);
    reset(emptyCompany);
    setOpen(true);
  };

  const showEdit = (company: CompanyProfile) => {
    setEditing(company);

    reset({
      name: company.name,
      taxId: company.taxId,
      sector: company.sector,
      email: company.email,
      phone: company.phone,
      address: company.address,
      status: company.status,
    });

    setOpen(true);
  };

  const submit = async (data: CompanyFormData) => {
    try {
      const payload = {
        name: data.name,
        tax_id: data.taxId,
        sector: data.sector,
        email: data.email,
        phone: data.phone,
        address: data.address,
        status: data.status,
      };

      if (editing) {
        await apiClient.patch(`/companies/${editing.id}`, payload);
        setMessage("Empresa actualizada correctamente.");
      } else {
        await apiClient.post("/companies", payload);
        setMessage("Empresa registrada correctamente.");
      }

      setOpen(false);
      await loadData();
    } catch (error) {
      console.error("Error guardando empresa:", error);
      setMessage("No se pudo guardar la empresa.");
    }
  };

  const remove = async (company: CompanyProfile) => {
    if (!window.confirm(`¿Eliminar ${company.name}?`)) return;

    try {
      await apiClient.delete(`/companies/${company.id}`);

      setMessage("Empresa eliminada correctamente.");
      await loadData();
    } catch (error) {
      console.error("Error eliminando empresa:", error);
      setMessage(
        "No se puede eliminar porque tiene sucursales relacionadas.",
      );
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Gestión empresarial"
        title="Empresas"
        description="Registra, consulta, actualiza y elimina las organizaciones del sistema."
        action={
          <button
            onClick={showCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Nueva empresa
          </button>
        }
      />

      <section className="space-y-5 p-4 sm:p-6 lg:p-8">
        {message && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Cargando empresas...
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {companies.map((company) => {
              const companyBranches = branches.filter(
                (branch) => branch.companyId === company.id,
              );

              return (
                <article
                  key={company.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                        <Building2 size={24} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-slate-950">
                          {company.name}
                        </h2>

                        <p className="mt-1 text-xs font-medium text-slate-500">
                          RUC {company.taxId}
                        </p>
                      </div>
                    </div>

                    <StatusBadge label={company.status} />
                  </div>

                  <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-2">
                    <p className="flex items-center gap-2">
                      <Mail size={16} className="text-blue-600" />
                      {company.email}
                    </p>

                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-blue-600" />
                      {company.phone}
                    </p>

                    <p className="flex items-start gap-2 sm:col-span-2">
                      <MapPin
                        size={16}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />
                      {company.address}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Sector</p>

                      <p className="text-sm font-medium text-slate-800">
                        {company.sector} · {companyBranches.length} sucursales
                      </p>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => showEdit(company)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        aria-label={`Editar ${company.name}`}
                      >
                        <Edit3 size={17} />
                      </button>

                      <button
                        onClick={() => void remove(company)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                        aria-label={`Eliminar ${company.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
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
        title={editing ? "Editar empresa" : "Nueva empresa"}
        description="Completa la información corporativa."
        size="lg"
      >
        <form
          onSubmit={handleSubmit(submit)}
          className="grid gap-4 md:grid-cols-2"
        >
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Razón social

            <input
              {...register("name")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.name && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            RUC

            <input
              {...register("taxId")}
              inputMode="numeric"
              maxLength={11}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.taxId && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.taxId.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Sector

            <input
              {...register("sector")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.sector && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.sector.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Correo

            <input
              {...register("email")}
              type="email"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.email && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.email.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Teléfono

            <input
              {...register("phone")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.phone && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.phone.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            Dirección

            <input
              {...register("address")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            />

            {errors.address && (
              <span className="mt-1 block text-xs text-rose-600">
                {errors.address.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium text-slate-700">
            Estado

            <select
              {...register("status")}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
            >
              <option>Activa</option>
              <option>Inactiva</option>
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-4 md:col-span-2">
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
              Guardar empresa
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}