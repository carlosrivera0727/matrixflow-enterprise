import { Building2, Edit3, Mail, MapPin, Phone, Save, X } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useMockStore } from "../../hooks/useMockStore";
import type { CompanyProfile } from "../../types";

export default function Empresa() {
  const { company, branches, products, updateCompany } = useMockStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<CompanyProfile>(company);
  const setField = (field: keyof CompanyProfile, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const save = () => { updateCompany(form); setEditing(false); };

  return (
    <div>
      <PageHeader eyebrow="Gestión empresarial" title="Empresa" description="Información corporativa y configuración general del negocio." action={<button onClick={() => { setForm(company); setEditing((value) => !value); }} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">{editing ? <X size={17} /> : <Edit3 size={17} />}{editing ? "Cancelar" : "Editar información"}</button>} />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div className="flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-blue-600"><Building2 size={27} /></div><div><h2 className="text-lg font-semibold text-slate-950">Perfil corporativo</h2><p className="text-sm text-slate-500">Datos visibles en reportes y documentos.</p></div></div>
            <div className="mt-7 grid gap-5 md:grid-cols-2">
              {([ ["name", "Razón social"], ["taxId", "RUC"], ["sector", "Sector"], ["email", "Correo"], ["phone", "Teléfono"], ["address", "Dirección"] ] as [keyof CompanyProfile, string][]).map(([field, label]) => <label key={field} className={field === "address" ? "md:col-span-2" : ""}><span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>{editing ? <input value={form[field]} onChange={(event) => setField(field, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" /> : <p className="mt-2 rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-800">{company[field]}</p>}</label>)}
            </div>
            {editing && <div className="mt-6 flex justify-end"><button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"><Save size={17} />Guardar cambios</button></div>}
          </div>
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-400">Estado de la organización</p><div className="mt-3 flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /><span className="font-semibold">Empresa activa</span></div><div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/5 p-3"><p className="text-2xl font-bold">{branches.length}</p><p className="text-xs text-slate-400">Sucursales</p></div><div className="rounded-xl bg-white/5 p-3"><p className="text-2xl font-bold">{products.length}</p><p className="text-xs text-slate-400">Productos</p></div></div></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-semibold text-slate-900">Contacto</h3><div className="mt-4 space-y-3 text-sm text-slate-600"><p className="flex gap-3"><Mail size={17} className="text-blue-600" />{company.email}</p><p className="flex gap-3"><Phone size={17} className="text-blue-600" />{company.phone}</p><p className="flex gap-3"><MapPin size={17} className="shrink-0 text-blue-600" />{company.address}</p></div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
