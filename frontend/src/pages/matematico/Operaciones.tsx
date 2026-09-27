import PageHeader from "../../components/common/PageHeader";

export default function Operaciones() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Análisis Matemático"
        title="Operaciones"
        description="Ejecución de operaciones de álgebra lineal."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Operaciones disponibles
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Suma",
              "Resta",
              "Multiplicación",
              "Combinación lineal",
            ].map((operation) => (
              <div
                key={operation}
                className="rounded-lg bg-slate-50 p-5"
              >
                <p className="font-medium text-slate-900">
                  {operation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}