import PageHeader from "../../components/common/PageHeader";

export default function Reportes() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Información empresarial"
        title="Reportes"
        description="Consulta de indicadores y reportes del sistema."
      />

      <section className="p-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            "Reporte de ventas",
            "Reporte de inventario",
            "Reporte matemático",
          ].map((report) => (
            <div
              key={report}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">
                {report}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Reporte disponible para consulta.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}