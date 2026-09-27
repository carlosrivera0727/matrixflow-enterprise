import PageHeader from "../../components/common/PageHeader";

export default function Configuracion() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Configuración general de MatrixFlow Enterprise."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Configuración general
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                Versión del sistema
              </p>
              <p className="mt-1 text-sm text-slate-500">
                MatrixFlow Enterprise v1.0
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-900">
                Entorno
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Desarrollo
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}