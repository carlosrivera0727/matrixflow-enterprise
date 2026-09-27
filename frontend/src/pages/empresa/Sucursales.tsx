import PageHeader from "../../components/common/PageHeader";

const branches = [
  {
    name: "Sucursal Centro",
    city: "Lima",
    status: "Activa",
  },
  {
    name: "Sucursal Norte",
    city: "Los Olivos",
    status: "Activa",
  },
  {
    name: "Sucursal Sur",
    city: "San Juan de Miraflores",
    status: "Activa",
  },
];

export default function Sucursales() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Empresa"
        title="Sucursales"
        description="Administración de las sucursales de la empresa."
      />

      <section className="p-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">
              Sucursales registradas
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            {branches.map((branch) => (
              <div
                key={branch.name}
                className="flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    {branch.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {branch.city}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                  {branch.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}