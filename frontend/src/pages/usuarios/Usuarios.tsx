import PageHeader from "../../components/common/PageHeader";

export default function Usuarios() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Administración"
        title="Usuarios"
        description="Gestión de usuarios y roles del sistema."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Usuarios del sistema
          </h2>

          <div className="mt-6 overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Usuario</th>
                  <th className="px-5 py-4">Rol</th>
                  <th className="px-5 py-4">Estado</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    Administrador
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    Admin
                  </td>
                  <td className="px-5 py-4 text-emerald-600">
                    Activo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}