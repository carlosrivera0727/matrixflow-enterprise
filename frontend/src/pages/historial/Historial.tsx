import PageHeader from "../../components/common/PageHeader";

const history = [
  "Operación de suma de vectores",
  "Multiplicación de matrices",
  "Actualización de inventario",
  "Registro de venta",
];

export default function Historial() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Seguimiento"
        title="Historial"
        description="Registro de actividades y operaciones realizadas."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-medium text-blue-600">
                  {index + 1}
                </span>

                <p className="text-sm text-slate-700">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}