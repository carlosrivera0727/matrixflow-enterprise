import { AlertCircle, CheckCircle2, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { useMockStore } from "../../hooks/useMockStore";
import type { OperationResult } from "../../types";
import { formatResult } from "../../utils/formatters";
import { addMatrices, addVectors, dotProduct, linearCombination, multiplyMatrices, scaleMatrix, scaleVector, subtractMatrices, subtractVectors, transposeMatrix } from "../../utils/linearAlgebra";

const vectorOperations = ["Suma", "Resta", "Producto escalar", "Multiplicación por escalar", "Combinación lineal"];
const matrixOperations = ["Suma", "Resta", "Multiplicación", "Transposición", "Multiplicación por escalar"];

export default function Operaciones() {
  const { vectors, matrices, addOperation } = useMockStore();
  const { user } = useAuth();
  const [category, setCategory] = useState<"Vector" | "Matriz">("Vector");
  const [operation, setOperation] = useState("Suma");
  const [firstId, setFirstId] = useState(1);
  const [secondId, setSecondId] = useState(2);
  const [scalar, setScalar] = useState(2);
  const [coefficientB, setCoefficientB] = useState(1);
  const [result, setResult] = useState<OperationResult | null>(null);
  const [error, setError] = useState("");
  const options = category === "Vector" ? vectors : matrices;
  const needsSecond = operation !== "Multiplicación por escalar" && operation !== "Transposición";
  const reset = () => { setResult(null); setError(""); setScalar(2); setCoefficientB(1); };
  const changeCategory = (next: "Vector" | "Matriz") => { setCategory(next); setOperation("Suma"); setFirstId(next === "Vector" ? (vectors[0]?.id ?? 0) : (matrices[0]?.id ?? 0)); setSecondId(next === "Vector" ? (vectors[1]?.id ?? 0) : (matrices[1]?.id ?? 0)); setResult(null); setError(""); };

  const execute = () => {
    setError("");
    try {
      let calculated: OperationResult;
      let inputLabel = "";
      if (category === "Vector") {
        const a = vectors.find((item) => item.id === firstId);
        const b = vectors.find((item) => item.id === secondId);
        if (!a) throw new Error("Selecciona el primer vector.");
        inputLabel = a.name;
        if (operation === "Suma") { if (!b) throw new Error("Selecciona el segundo vector."); calculated = addVectors(a.values, b.values); inputLabel += ` + ${b.name}`; }
        else if (operation === "Resta") { if (!b) throw new Error("Selecciona el segundo vector."); calculated = subtractVectors(a.values, b.values); inputLabel += ` − ${b.name}`; }
        else if (operation === "Producto escalar") { if (!b) throw new Error("Selecciona el segundo vector."); calculated = dotProduct(a.values, b.values); inputLabel += ` · ${b.name}`; }
        else if (operation === "Multiplicación por escalar") { calculated = scaleVector(a.values, scalar); inputLabel = `${scalar} × ${a.name}`; }
        else { if (!b) throw new Error("Selecciona el segundo vector."); calculated = linearCombination(a.values, b.values, scalar, coefficientB); inputLabel = `${scalar}·${a.name} + ${coefficientB}·${b.name}`; }
      } else {
        const a = matrices.find((item) => item.id === firstId);
        const b = matrices.find((item) => item.id === secondId);
        if (!a) throw new Error("Selecciona la primera matriz.");
        inputLabel = a.name;
        if (operation === "Suma") { if (!b) throw new Error("Selecciona la segunda matriz."); calculated = addMatrices(a.values, b.values); inputLabel += ` + ${b.name}`; }
        else if (operation === "Resta") { if (!b) throw new Error("Selecciona la segunda matriz."); calculated = subtractMatrices(a.values, b.values); inputLabel += ` − ${b.name}`; }
        else if (operation === "Multiplicación") { if (!b) throw new Error("Selecciona la segunda matriz."); calculated = multiplyMatrices(a.values, b.values); inputLabel += ` × ${b.name}`; }
        else if (operation === "Transposición") { calculated = transposeMatrix(a.values); inputLabel = `${a.name}ᵀ`; }
        else { calculated = scaleMatrix(a.values, scalar); inputLabel = `${scalar} × ${a.name}`; }
      }
      setResult(calculated);
      addOperation({ type: operation, category, inputs: inputLabel, result: calculated, createdAt: new Date().toISOString(), user: user?.name ?? "Usuario", status: "Completada" });
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : "No se pudo ejecutar la operación.");
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Motor matemático" title="Operaciones" description="Valida dimensiones y simula cálculos antes de conectarlos con NumPy." />
      <section className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex rounded-xl bg-slate-100 p-1"><button onClick={() => changeCategory("Vector")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${category === "Vector" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Vectores</button><button onClick={() => changeCategory("Matriz")} className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${category === "Matriz" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500"}`}>Matrices</button></div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700 md:col-span-2">Operación<select value={operation} onChange={(event) => { setOperation(event.target.value); setResult(null); setError(""); }} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5">{(category === "Vector" ? vectorOperations : matrixOperations).map((item) => <option key={item}>{item}</option>)}</select></label>
              <label className="text-sm font-medium text-slate-700">{category === "Vector" ? "Vector A" : "Matriz A"}<select value={firstId} onChange={(event) => setFirstId(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5">{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
              {needsSecond && <label className="text-sm font-medium text-slate-700">{category === "Vector" ? "Vector B" : "Matriz B"}<select value={secondId} onChange={(event) => setSecondId(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5">{options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
              {(operation === "Multiplicación por escalar" || operation === "Combinación lineal") && <label className="text-sm font-medium text-slate-700">{operation === "Combinación lineal" ? "Coeficiente A" : "Escalar"}<input value={scalar} onChange={(event) => setScalar(Number(event.target.value))} type="number" step="any" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>}
              {operation === "Combinación lineal" && <label className="text-sm font-medium text-slate-700">Coeficiente B<input value={coefficientB} onChange={(event) => setCoefficientB(Number(event.target.value))} type="number" step="any" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>}
            </div>
            {error && <div className="mt-5 flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700"><AlertCircle size={19} className="shrink-0" />{error}</div>}
            <div className="mt-6 flex gap-3"><button onClick={execute} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"><Play size={17} />Ejecutar operación</button><button onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"><RotateCcw size={16} />Limpiar</button></div>
          </div>
          <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">Resultado</p>
            {result !== null ? <div className="mt-5"><div className="flex items-center gap-2 text-sm text-emerald-300"><CheckCircle2 size={18} />Dimensiones compatibles</div><pre className="mt-5 overflow-x-auto whitespace-pre rounded-xl bg-white/5 p-5 font-mono text-lg leading-9 text-white">{formatResult(result)}</pre><p className="mt-4 text-xs leading-5 text-slate-400">Resultado de demostración calculado en el frontend. En la Fase 4, el procesamiento será reemplazado por Python + NumPy.</p></div> : <div className="flex min-h-64 items-center justify-center text-center"><div><Play className="mx-auto text-slate-600" size={34} /><p className="mt-4 text-sm text-slate-400">Configura y ejecuta una operación<br />para visualizar el resultado.</p></div></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
