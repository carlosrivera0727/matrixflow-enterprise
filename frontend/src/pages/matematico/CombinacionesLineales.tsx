import { AlertCircle, CheckCircle2, GitMerge, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useMockStore } from "../../hooks/useMockStore";
import type { OperationResult } from "../../types";
import { formatResult } from "../../utils/formatters";
import { linearCombination } from "../../utils/linearAlgebra";

export default function CombinacionesLineales() {
  const { vectors, addOperation } = useMockStore();
  const { user } = useAuth();
  const [firstId, setFirstId] = useState(vectors[0]?.id ?? 0);
  const [secondId, setSecondId] = useState(vectors[1]?.id ?? 0);
  const [coefficientA, setCoefficientA] = useState(1);
  const [coefficientB, setCoefficientB] = useState(1);
  const [result, setResult] = useState<OperationResult | null>(null);
  const [error, setError] = useState("");
  const first = vectors.find((vector) => vector.id === firstId);
  const second = vectors.find((vector) => vector.id === secondId);

  const execute = () => {
    setError("");
    try {
      if (!first || !second) throw new Error("Selecciona dos vectores.");
      const calculated = linearCombination(first.values, second.values, coefficientA, coefficientB);
      setResult(calculated);
      addOperation({
        type: "Combinación lineal",
        category: "Vector",
        inputs: `${coefficientA}·${first.name} + ${coefficientB}·${second.name}`,
        result: calculated,
        createdAt: new Date().toISOString(),
        user: user?.name ?? "Usuario",
        status: "Completada",
      });
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "No se pudo calcular la combinación lineal.");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Análisis matemático" title="Combinaciones lineales" description="Construye indicadores ponderados a partir de dos vectores empresariales." />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4"><div className="grid h-11 w-11 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><GitMerge size={21} /></div><div><h2 className="font-semibold text-slate-950">Configurar combinación</h2><p className="mt-1 text-sm text-slate-500">Resultado = α·Vector A + β·Vector B</p></div></div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">Vector A<select value={firstId} onChange={(event) => { setFirstId(Number(event.target.value)); setResult(null); }} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5">{vectors.map((vector) => <option key={vector.id} value={vector.id}>{vector.name} · dimensión {vector.values.length}</option>)}</select></label>
              <label className="text-sm font-medium text-slate-700">Coeficiente α<input value={coefficientA} onChange={(event) => setCoefficientA(Number(event.target.value))} type="number" step="any" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
              <label className="text-sm font-medium text-slate-700">Vector B<select value={secondId} onChange={(event) => { setSecondId(Number(event.target.value)); setResult(null); }} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5">{vectors.map((vector) => <option key={vector.id} value={vector.id}>{vector.name} · dimensión {vector.values.length}</option>)}</select></label>
              <label className="text-sm font-medium text-slate-700">Coeficiente β<input value={coefficientB} onChange={(event) => setCoefficientB(Number(event.target.value))} type="number" step="any" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
            </div>
            <div className="mt-6 grid gap-3 rounded-xl bg-slate-50 p-4 md:grid-cols-2"><div><p className="text-xs font-semibold uppercase text-slate-400">Vector A</p><p className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-700">[ {first?.values.join(", ")} ]</p></div><div><p className="text-xs font-semibold uppercase text-slate-400">Vector B</p><p className="mt-2 overflow-x-auto whitespace-nowrap font-mono text-sm text-slate-700">[ {second?.values.join(", ")} ]</p></div></div>
            {error && <div className="mt-5 flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={19} className="shrink-0" />{error}</div>}
            <div className="mt-6 flex gap-3"><button onClick={execute} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20"><Play size={17} />Calcular combinación</button><button onClick={() => { setCoefficientA(1); setCoefficientB(1); setResult(null); setError(""); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"><RotateCcw size={16} />Restablecer</button></div>
          </div>
          <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-300">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">Resultado ponderado</p>
            {result !== null ? <div className="mt-5"><div className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={18} />Combinación válida</div><pre className="mt-5 overflow-x-auto whitespace-pre rounded-xl bg-white/5 p-5 font-mono text-lg leading-9 text-white">{formatResult(result)}</pre><p className="mt-4 text-xs leading-5 text-slate-400">La ejecución quedó registrada en el historial con sus coeficientes, vectores, usuario y fecha.</p></div> : <div className="flex min-h-64 items-center justify-center text-center"><div><GitMerge className="mx-auto text-slate-600" size={36} /><p className="mt-4 text-sm text-slate-400">Selecciona los vectores y coeficientes<br />para construir el indicador.</p></div></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
