import PageHeader from "../../components/common/PageHeader";

export default function Empresa() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Gestión empresarial"
        title="Empresa"
        description="Información general de la empresa y su estructura operativa."
      />

      <section className="p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">
            Información de la empresa
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Módulo preparado para administrar la información empresarial.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Razón social
              </p>

              <p className="mt-1 font-medium text-slate-900">
                MatrixFlow Enterprise S.A.C.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Estado
              </p>

              <p className="mt-1 font-medium text-emerald-600">
                Activa
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}