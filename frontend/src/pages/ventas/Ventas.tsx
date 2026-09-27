import PageHeader from "../../components/common/PageHeader";

export default function Ventas() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Operaciones"
        title="Ventas"
        description="Registro y seguimiento de las ventas realizadas."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Registro de ventas
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Módulo preparado para registrar y consultar las operaciones
            comerciales.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-8 text-center">
            <p className="text-sm text-slate-400">
              Datos simulados — Fase 1
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}