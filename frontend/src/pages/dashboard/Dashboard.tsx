import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Ventas del mes",
    value: "S/ 128,450",
    change: "+12.5%",
    positive: true,
    icon: ShoppingCart,
  },
  {
    title: "Productos",
    value: "1,284",
    change: "+8.2%",
    positive: true,
    icon: Package,
  },
  {
    title: "Inventario",
    value: "8,642",
    change: "-3.4%",
    positive: false,
    icon: Boxes,
  },
  {
    title: "Cumplimiento",
    value: "87.6%",
    change: "+5.1%",
    positive: true,
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-8 py-5">
        <p className="text-sm text-slate-500">
          Panel ejecutivo
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
      </header>

      {/* Contenido */}
      <section className="p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-blue-50 p-2.5">
                    <Icon
                      size={20}
                      className="text-blue-600"
                    />
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      stat.positive
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.positive ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}

                    {stat.change}
                  </div>
                </div>

                <p className="mt-5 text-sm text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Área de análisis */}
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
            <h2 className="font-semibold text-slate-900">
              Ventas por sucursal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información simulada para la Fase 1.
            </p>

            <div className="mt-8 flex h-64 items-center justify-center rounded-lg bg-slate-50">
              <p className="text-sm text-slate-400">
                Gráfico de ventas — próximamente
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold text-slate-900">
              Actividad reciente
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Nueva venta registrada",
                "Inventario actualizado",
                "Nueva sucursal agregada",
                "Operación matricial ejecutada",
              ].map((activity) => (
                <div
                  key={activity}
                  className="border-b border-slate-100 pb-3 text-sm text-slate-600 last:border-0"
                >
                  {activity}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}