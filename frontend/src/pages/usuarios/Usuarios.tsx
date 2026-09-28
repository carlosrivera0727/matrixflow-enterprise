import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Plus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { useMockStore } from "../../hooks/useMockStore";
import { userSchema, type UserFormData } from "../../schemas";
import type { UserRecord } from "../../types";

const emptyUser: UserFormData = { name: "", email: "", role: "Consulta", status: "Activo" };

export default function Usuarios() {
  const { users, saveUser, removeUser } = useMockStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<UserRecord | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserFormData>({ resolver: zodResolver(userSchema), defaultValues: emptyUser });
  const showCreate = () => { setEditing(null); reset(emptyUser); setOpen(true); };
  const showEdit = (user: UserRecord) => { setEditing(user); reset(user); setOpen(true); };
  const submit = (data: UserFormData) => { saveUser({ ...data, id: editing?.id }); setOpen(false); };
  return (
    <div>
      <PageHeader eyebrow="Administración" title="Usuarios y roles" description="Gestiona los perfiles de acceso previstos para el sistema." action={<button onClick={showCreate} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />Nuevo usuario</button>} />
      <section className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 md:grid-cols-3">{[{ role: "Administrador", description: "Control total y configuración", color: "bg-blue-50 text-blue-700" }, { role: "Analista", description: "Ventas, inventario y análisis", color: "bg-cyan-50 text-cyan-700" }, { role: "Consulta", description: "Dashboard y reportes", color: "bg-violet-50 text-violet-700" }].map((item) => <div key={item.role} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`grid h-10 w-10 place-items-center rounded-xl ${item.color}`}><ShieldCheck size={20} /></div><h2 className="mt-4 font-semibold text-slate-900">{item.role}</h2><p className="mt-1 text-sm text-slate-500">{item.description}</p></div>)}</div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Usuario</th><th className="px-5 py-4">Rol</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4 text-right">Acciones</th></tr></thead><tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id} className="hover:bg-slate-50"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500"><UserRound size={17} /></div><div><p className="font-semibold text-slate-900">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div></div></td><td className="px-5 py-4 text-slate-600">{user.role}</td><td className="px-5 py-4"><StatusBadge label={user.status} /></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><button onClick={() => showEdit(user)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={17} /></button><button disabled={user.id === 1} onClick={() => window.confirm(`¿Eliminar ${user.name}?`) && removeUser(user.id)} className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div></div>
      </section>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Editar usuario" : "Nuevo usuario"}>
        <form onSubmit={handleSubmit(submit)} className="space-y-4"><label className="block text-sm font-medium text-slate-700">Nombre<input {...register("name")} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" />{errors.name && <span className="text-xs text-rose-600">{errors.name.message}</span>}</label><label className="block text-sm font-medium text-slate-700">Correo<input {...register("email")} type="email" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" />{errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}</label><label className="block text-sm font-medium text-slate-700">Rol<select {...register("role")} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"><option>Administrador</option><option>Analista</option><option>Consulta</option></select></label><label className="block text-sm font-medium text-slate-700">Estado<select {...register("status")} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"><option>Activo</option><option>Inactivo</option></select></label><div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancelar</button><button className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Guardar usuario</button></div></form>
      </Modal>
    </div>
  );
}
