import PageHeader from "../../components/common/PageHeader";

export default function Matrices() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Análisis Matemático"
        title="Matrices"
        description="Representación y análisis de matrices."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Operaciones con matrices
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Módulo preparado para el procesamiento matricial.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Suma", "Resta", "Multiplicación"].map((operation) => (
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