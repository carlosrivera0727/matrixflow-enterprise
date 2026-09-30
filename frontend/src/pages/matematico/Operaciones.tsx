import {
  AlertCircle,
  CheckCircle2,
  Play,
  RotateCcw,
} from "lucide-react";
import { useEffect, useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import apiClient from "../../services/api/client";
import type {
  MatrixRecord,
  OperationResult,
  VectorRecord,
} from "../../types";

const vectorOperations = [
  "Suma",
  "Resta",
  "Producto escalar",
  "Multiplicación por escalar",
  "Combinación lineal",
];

const matrixOperations = [
  "Suma",
  "Resta",
  "Multiplicación",
  "Transposición",
  "Multiplicación por escalar",
];

interface ApiOperationResponse {
  id: number;
  operationType: string;
  category: "Vector" | "Matriz";
  inputs: string;
  result: OperationResult;
  createdAt: string;
  user: string;
  status: "Completada" | "Error";
}

interface ApiVector {
  id: number;
  name: string;
  description: string;
  values: number[];
  createdAt: string;
}

interface ApiMatrix {
  id: number;
  name: string;
  description: string;
  values: number[][];
  createdAt: string;
}

const formatResult = (value: OperationResult): string => {
  if (typeof value === "number") {
    return String(value);
  }

  return value
    .map((row) =>
      Array.isArray(row)
        ? row.join("   ")
        : String(row),
    )
    .join("\n");
};

export default function Operaciones() {

  const [vectors, setVectors] = useState<VectorRecord[]>([]);
  const [matrices, setMatrices] = useState<MatrixRecord[]>([]);

  const [category, setCategory] =
    useState<"Vector" | "Matriz">("Vector");

  const [operation, setOperation] =
    useState("Suma");

  const [firstId, setFirstId] = useState(0);
  const [secondId, setSecondId] = useState(0);

  const [scalar, setScalar] = useState(2);
  const [coefficientB, setCoefficientB] = useState(1);

  const [result, setResult] =
    useState<OperationResult | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const options =
    category === "Vector" ? vectors : matrices;

  const needsSecond =
    operation !== "Multiplicación por escalar" &&
    operation !== "Transposición";

  const reset = () => {
    setResult(null);
    setError("");
    setScalar(2);
    setCoefficientB(1);
  };

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [vectorsResponse, matricesResponse] =
        await Promise.all([
          apiClient.get<ApiVector[]>("/vectors"),
          apiClient.get<ApiMatrix[]>("/matrices"),
        ]);

      setVectors(
        vectorsResponse.data.map((vector) => ({
          id: vector.id,
          name: vector.name,
          description: vector.description,
          values: vector.values,
          createdAt: vector.createdAt,
        })),
      );

      setMatrices(
        matricesResponse.data.map((matrix) => ({
          id: matrix.id,
          name: matrix.name,
          description: matrix.description,
          values: matrix.values,
          createdAt: matrix.createdAt,
        })),
      );
    } catch (caught: unknown) {
      console.error(
        "ERROR CARGANDO DATOS MATEMÁTICOS:",
        caught,
      );

      setError(
        "No se pudieron cargar los vectores y matrices.",
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const currentOptions =
      category === "Vector" ? vectors : matrices;

    setFirstId(currentOptions[0]?.id ?? 0);
    setSecondId(currentOptions[1]?.id ?? currentOptions[0]?.id ?? 0);
    setResult(null);
    setError("");
  }, [category, vectors, matrices]);

  const changeCategory = (
    next: "Vector" | "Matriz",
  ) => {
    setCategory(next);
    setOperation("Suma");
    setResult(null);
    setError("");
  };

  const execute = async () => {
    setError("");
    setResult(null);

    if (!firstId) {
      setError(
        category === "Vector"
          ? "Selecciona el primer vector."
          : "Selecciona la primera matriz.",
      );
      return;
    }

    if (needsSecond && !secondId) {
      setError(
        category === "Vector"
          ? "Selecciona el segundo vector."
          : "Selecciona la segunda matriz.",
      );
      return;
    }

    try {
      setLoading(true);

      const payload: Record<string, unknown> = {
        category,
        operationType: operation,
        firstId,
      };

      if (needsSecond) {
        payload.secondId = secondId;
      }

      if (
        operation === "Multiplicación por escalar" ||
        operation === "Combinación lineal"
      ) {
        payload.scalar = scalar;
      }

      if (operation === "Combinación lineal") {
        payload.coefficientB = coefficientB;
      }

      console.log(
        "POST /operations:",
        payload,
      );

      const response =
        await apiClient.post<ApiOperationResponse>(
          "/operations",
          payload,
        );

      console.log(
        "RESPUESTA /operations:",
        response.data,
      );

      setResult(response.data.result);
    } catch (caught: any) {
      console.error(
        "ERROR EJECUTANDO OPERACIÓN:",
        caught,
      );

      const detail =
        caught?.response?.data?.detail;

      if (typeof detail === "string") {
        setError(detail);
      } else {
        setError(
          "No se pudo ejecutar la operación.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Motor matemático"
        title="Operaciones"
        description="Ejecuta operaciones de álgebra lineal utilizando el motor Python + NumPy."
      />

      <section className="p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() =>
                  changeCategory("Vector")
                }
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                  category === "Vector"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Vectores
              </button>

              <button
                onClick={() =>
                  changeCategory("Matriz")
                }
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${
                  category === "Matriz"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Matrices
              </button>
            </div>

            {loadingData ? (
              <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center text-sm text-slate-500">
                Cargando vectores y matrices...
              </div>
            ) : options.length === 0 ? (
              <div className="mt-8 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
                <AlertCircle
                  size={19}
                  className="shrink-0"
                />
                No existen registros disponibles para
                realizar operaciones.
              </div>
            ) : (
              <>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700 md:col-span-2">
                    Operación

                    <select
                      value={operation}
                      onChange={(event) => {
                        setOperation(
                          event.target.value,
                        );
                        setResult(null);
                        setError("");
                      }}
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                    >
                      {(category === "Vector"
                        ? vectorOperations
                        : matrixOperations
                      ).map((item) => (
                        <option key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm font-medium text-slate-700">
                    {category === "Vector"
                      ? "Vector A"
                      : "Matriz A"}

                    <select
                      value={firstId}
                      onChange={(event) =>
                        setFirstId(
                          Number(event.target.value),
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                    >
                      {options.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {needsSecond && (
                    <label className="text-sm font-medium text-slate-700">
                      {category === "Vector"
                        ? "Vector B"
                        : "Matriz B"}

                      <select
                        value={secondId}
                        onChange={(event) =>
                          setSecondId(
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                      >
                        {options.map((item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  {(operation ===
                    "Multiplicación por escalar" ||
                    operation ===
                      "Combinación lineal") && (
                    <label className="text-sm font-medium text-slate-700">
                      {operation ===
                      "Combinación lineal"
                        ? "Coeficiente A"
                        : "Escalar"}

                      <input
                        value={scalar}
                        onChange={(event) =>
                          setScalar(
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        type="number"
                        step="any"
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                      />
                    </label>
                  )}

                  {operation ===
                    "Combinación lineal" && (
                    <label className="text-sm font-medium text-slate-700">
                      Coeficiente B

                      <input
                        value={coefficientB}
                        onChange={(event) =>
                          setCoefficientB(
                            Number(
                              event.target.value,
                            ),
                          )
                        }
                        type="number"
                        step="any"
                        className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5"
                      />
                    </label>
                  )}
                </div>

                {error && (
                  <div className="mt-5 flex gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle
                      size={19}
                      className="shrink-0"
                    />
                    {error}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={execute}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Play size={17} />

                    {loading
                      ? "Procesando..."
                      : "Ejecutar operación"}
                  </button>

                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    <RotateCcw size={16} />
                    Limpiar
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="rounded-2xl bg-slate-950 p-6 text-white shadow-xl shadow-slate-300">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-400">
              Resultado
            </p>

            {result !== null ? (
              <div className="mt-5">
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 size={18} />
                  Operación completada con NumPy
                </div>

                <pre className="mt-5 overflow-x-auto whitespace-pre rounded-xl bg-white/5 p-5 font-mono text-lg leading-9 text-white">
                  {formatResult(result)}
                </pre>

                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Resultado procesado por el backend
                  y almacenado en el historial de
                  operaciones.
                </p>
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center text-center">
                <div>
                  <Play
                    className="mx-auto text-slate-600"
                    size={34}
                  />

                  <p className="mt-4 text-sm text-slate-400">
                    Configura y ejecuta una operación
                    <br />
                    para visualizar el resultado.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}