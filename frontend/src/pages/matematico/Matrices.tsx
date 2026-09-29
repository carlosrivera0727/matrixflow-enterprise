import { useEffect, useMemo, useState } from "react";
import {
  Edit3,
  Grid3X3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";

import PageHeader from "../../components/common/PageHeader";
import Modal from "../../components/common/Modal";
import { apiClient } from "../../services/api/client";
import { formatDate } from "../../utils/formatters";

type MatrixRecord = {
  id: number;
  name: string;
  description: string;
  values: number[][];
  createdAt: string;
};

type ApiMatrix = {
  id: number;
  name: string;
  description: string;
  values: number[][];
  createdAt: string;
};

type MatrixForm = {
  name: string;
  description: string;
  rows: number;
  columns: number;
  values: number[][];
};

const createEmptyMatrix = (
  rows: number,
  columns: number,
): number[][] => {
  return Array.from(
    { length: rows },
    () =>
      Array.from(
        { length: columns },
        () => 0,
      ),
  );
};

export default function Matrices() {
  const [matrices, setMatrices] = useState<
    MatrixRecord[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [selectedMatrix, setSelectedMatrix] =
    useState<MatrixRecord | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm<MatrixForm>({
    defaultValues: {
      name: "",
      description: "",
      rows: 2,
      columns: 2,
      values: createEmptyMatrix(2, 2),
    },
  });

  const rows = watch("rows");
  const columns = watch("columns");
  const values = watch("values");

  // =========================================================
  // CARGAR MATRICES
  // =========================================================

  const loadMatrices = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response =
        await apiClient.get<ApiMatrix[]>(
          "/matrices",
        );

      console.log(
        "MATRICES RECIBIDAS DEL BACKEND:",
        response.data,
      );

      const mappedMatrices: MatrixRecord[] =
        response.data.map((matrix) => ({
          id: matrix.id,
          name: matrix.name,
          description: matrix.description,
          values: matrix.values,
          createdAt: matrix.createdAt,
        }));

      setMatrices(mappedMatrices);
    } catch (error) {
      console.error(
        "ERROR CARGANDO MATRICES:",
        error,
      );

      setMessage(
        "No se pudieron cargar las matrices.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMatrices();
  }, []);

  // =========================================================
  // CREAR MATRIZ
  // =========================================================

  const openCreateModal = () => {
    setSelectedMatrix(null);

    reset({
      name: "",
      description: "",
      rows: 2,
      columns: 2,
      values: createEmptyMatrix(2, 2),
    });

    setMessage("");
    setIsModalOpen(true);
  };

  // =========================================================
  // EDITAR MATRIZ
  // =========================================================

  const openEditModal = (
    matrix: MatrixRecord,
  ) => {
    setSelectedMatrix(matrix);

    reset({
      name: matrix.name,
      description: matrix.description,
      rows: matrix.values.length,
      columns:
        matrix.values[0]?.length ?? 1,
      values: matrix.values,
    });

    setMessage("");
    setIsModalOpen(true);
  };

  // =========================================================
  // CERRAR MODAL
  // =========================================================

  const closeModal = () => {
    if (saving) {
      return;
    }

    setIsModalOpen(false);
    setSelectedMatrix(null);
  };

  // =========================================================
  // CAMBIAR DIMENSIONES
  // =========================================================

  const changeDimensions = (
    newRows: number,
    newColumns: number,
  ) => {
    const safeRows = Math.min(
      Math.max(newRows, 1),
      6,
    );

    const safeColumns = Math.min(
      Math.max(newColumns, 1),
      6,
    );

    const newValues =
      createEmptyMatrix(
        safeRows,
        safeColumns,
      );

    for (
      let row = 0;
      row <
      Math.min(
        safeRows,
        values?.length ?? 0,
      );
      row++
    ) {
      for (
        let column = 0;
        column <
        Math.min(
          safeColumns,
          values?.[row]?.length ?? 0,
        );
        column++
      ) {
        newValues[row][column] =
          values[row][column];
      }
    }

    setValue(
      "rows",
      safeRows,
    );

    setValue(
      "columns",
      safeColumns,
    );

    setValue(
      "values",
      newValues,
    );
  };

  // =========================================================
  // CAMBIAR VALOR DE CELDA
  // =========================================================

  const updateCell = (
    rowIndex: number,
    columnIndex: number,
    value: string,
  ) => {
    const numericValue =
      value === ""
        ? 0
        : Number(value);

    const newValues =
      values.map((row) => [
        ...row,
      ]);

    newValues[rowIndex][
      columnIndex
    ] =
      Number.isFinite(
        numericValue,
      )
        ? numericValue
        : 0;

    setValue(
      "values",
      newValues,
    );
  };

  // =========================================================
  // GUARDAR MATRIZ
  // =========================================================

  const saveMatrix = async (
    data: MatrixForm,
  ) => {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        name: data.name.trim(),
        description:
          data.description.trim(),
        values: data.values,
      };

      // =====================================================
      // DIAGNÓSTICO
      // =====================================================

      console.log(
        "========================================",
      );

      console.log(
        "ENVIANDO MATRIZ AL BACKEND:",
      );

      console.log(
        "URL:",
        "/matrices",
      );

      console.log(
        "PAYLOAD:",
        payload,
      );

      console.log(
        "NOMBRE:",
        payload.name,
      );

      console.log(
        "DESCRIPCIÓN:",
        payload.description,
      );

      console.log(
        "VALORES:",
        payload.values,
      );

      console.log(
        "MODO:",
        selectedMatrix
          ? "EDITAR"
          : "CREAR",
      );

      console.log(
        "========================================",
      );

      // =====================================================
      // EDITAR
      // =====================================================

      if (selectedMatrix) {
        const response =
          await apiClient.patch(
            `/matrices/${selectedMatrix.id}`,
            payload,
          );

        console.log(
          "RESPUESTA EDITAR:",
          response.data,
        );
      }

      // =====================================================
      // CREAR
      // =====================================================

      else {
        const response =
          await apiClient.post(
            "/matrices",
            payload,
          );

        console.log(
          "RESPUESTA CREAR:",
          response.data,
        );
      }

      // =====================================================
      // RECARGAR LISTA
      // =====================================================

      await loadMatrices();

      setIsModalOpen(false);
      setSelectedMatrix(null);
    } catch (error: any) {
      console.error(
        "========================================",
      );

      console.error(
        "ERROR GUARDANDO MATRIZ:",
      );

      console.error(
        error,
      );

      console.error(
        "STATUS:",
        error?.response?.status,
      );

      console.error(
        "DATA:",
        error?.response?.data,
      );

      console.error(
        "MESSAGE:",
        error?.message,
      );

      console.error(
        "========================================",
      );

      // =====================================================
      // MOSTRAR ERROR REAL DEL BACKEND
      // =====================================================

      const backendDetail =
        error?.response?.data?.detail;

      if (
        typeof backendDetail ===
        "string"
      ) {
        setMessage(
          `Error del servidor: ${backendDetail}`,
        );
      } else if (
        Array.isArray(
          backendDetail,
        )
      ) {
        setMessage(
          `Error de validación: ${JSON.stringify(
            backendDetail,
          )}`,
        );
      } else if (
        error?.response?.status
      ) {
        setMessage(
          `Error HTTP ${error.response.status}. Revisa la consola del navegador.`,
        );
      } else {
        setMessage(
          "No se pudo conectar con el backend. Revisa la consola del navegador.",
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // ELIMINAR MATRIZ
  // =========================================================

  const removeMatrix = async (
    id: number,
  ) => {
    const confirmed =
      window.confirm(
        "¿Seguro que deseas eliminar esta matriz?",
      );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");

      await apiClient.delete(
        `/matrices/${id}`,
      );

      setMatrices(
        (current) =>
          current.filter(
            (matrix) =>
              matrix.id !== id,
          ),
      );
    } catch (error: any) {
      console.error(
        "ERROR ELIMINANDO MATRIZ:",
        error,
      );

      const backendDetail =
        error?.response?.data?.detail;

      if (
        typeof backendDetail ===
        "string"
      ) {
        setMessage(
          `Error del servidor: ${backendDetail}`,
        );
      } else {
        setMessage(
          "No se pudo eliminar la matriz.",
        );
      }
    }
  };

  // =========================================================
  // ESTADÍSTICAS
  // =========================================================

  const totalMatrices =
    matrices.length;

  const totalRows = useMemo(() => {
    return matrices.reduce(
      (total, matrix) =>
        total +
        matrix.values.length,
      0,
    );
  }, [matrices]);

  const totalColumns =
    useMemo(() => {
      return matrices.reduce(
        (total, matrix) =>
          total +
          (matrix.values[0]
            ?.length ?? 0),
        0,
      );
    }, [matrices]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div>
      {/* ===================================================
          HEADER
      =================================================== */}

      <PageHeader
        eyebrow="Análisis matemático"
        title="Matrices"
        description="Organiza información multidimensional por sucursal, producto o período."
      />

      {/* ===================================================
          BOTÓN NUEVA MATRIZ
      =================================================== */}

      <div className="px-4 pt-4 sm:px-6 lg:px-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={
              openCreateModal
            }
            className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Plus size={18} />

            Nueva matriz
          </button>
        </div>
      </div>

      {/* ===================================================
          MENSAJE
      =================================================== */}

      {message && (
        <div className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {message}
          </div>
        </div>
      )}

      {/* ===================================================
          CONTENIDO
      =================================================== */}

      <section className="p-4 sm:p-6 lg:p-8">
        {/* =================================================
            KPIs
        ================================================= */}

        <div className="grid gap-4 md:grid-cols-3">
          {/* MATRICES */}

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-zinc-100 p-2">
                <Grid3X3
                  size={20}
                />
              </div>

              <span className="text-xs font-medium text-zinc-500">
                Registradas
              </span>
            </div>

            <p className="text-2xl font-bold text-zinc-900">
              {totalMatrices}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Matrices disponibles
            </p>
          </div>

          {/* FILAS */}

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-zinc-100 p-2">
                <Grid3X3
                  size={20}
                />
              </div>

              <span className="text-xs font-medium text-zinc-500">
                Filas
              </span>
            </div>

            <p className="text-2xl font-bold text-zinc-900">
              {totalRows}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Filas registradas
            </p>
          </div>

          {/* COLUMNAS */}

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="rounded-xl bg-zinc-100 p-2">
                <Grid3X3
                  size={20}
                />
              </div>

              <span className="text-xs font-medium text-zinc-500">
                Columnas
              </span>
            </div>

            <p className="text-2xl font-bold text-zinc-900">
              {totalColumns}
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Columnas registradas
            </p>
          </div>
        </div>

        {/* =================================================
            MATRICES
        ================================================= */}

        <div className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-sm text-zinc-500">
              Cargando matrices...
            </div>
          ) : matrices.length ===
            0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center">
              <Grid3X3
                size={40}
                className="mx-auto mb-4 text-zinc-400"
              />

              <h3 className="text-lg font-semibold text-zinc-900">
                No hay matrices
                registradas.
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Crea una matriz para
                comenzar a trabajar.
              </p>

              <button
                type="button"
                onClick={
                  openCreateModal
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus
                  size={18}
                />

                Nueva matriz
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {matrices.map(
                (matrix) => (
                  <article
                    key={
                      matrix.id
                    }
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                  >
                    {/* CABECERA */}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-100 text-zinc-700">
                          <Grid3X3
                            size={
                              20
                            }
                          />
                        </div>

                        <div>
                          <h2 className="font-semibold text-zinc-950">
                            {
                              matrix.name
                            }
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            {
                              matrix.description
                            }
                          </p>
                        </div>
                      </div>

                      {/* ACCIONES */}

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              matrix,
                            )
                          }
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="Editar matriz"
                        >
                          <Edit3
                            size={
                              17
                            }
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void removeMatrix(
                              matrix.id,
                            )
                          }
                          className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-50 hover:text-red-600"
                          title="Eliminar matriz"
                        >
                          <Trash2
                            size={
                              17
                            }
                          />
                        </button>
                      </div>
                    </div>

                    {/* MATRIZ */}

                    <div className="mt-5 overflow-x-auto rounded-xl bg-zinc-950 p-4">
                      <div
                        className="inline-grid gap-2"
                        style={{
                          gridTemplateColumns: `repeat(${
                            matrix
                              .values[0]
                              ?.length ??
                            1
                          }, minmax(48px, 1fr))`,
                        }}
                      >
                        {matrix.values.flatMap(
                          (
                            row,
                            rowIndex,
                          ) =>
                            row.map(
                              (
                                value,
                                columnIndex,
                              ) => (
                                <span
                                  key={`${rowIndex}-${columnIndex}`}
                                  className="rounded-lg bg-white/10 px-3 py-2 text-center font-mono text-sm text-white"
                                >
                                  {
                                    value
                                  }
                                </span>
                              ),
                            ),
                        )}
                      </div>
                    </div>

                    {/* INFORMACIÓN */}

                    <div className="mt-4 flex items-center justify-between text-xs text-zinc-400">
                      <span>
                        Dimensión:{" "}
                        {
                          matrix
                            .values
                            .length
                        }{" "}
                        ×{" "}
                        {
                          matrix
                            .values[0]
                            ?.length ??
                          0
                        }
                      </span>

                      <span>
                        {formatDate(
                          matrix.createdAt,
                        )}
                      </span>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          MODAL
      =================================================== */}

      <Modal
        open={isModalOpen}
        onClose={
          closeModal
        }
        title={
          selectedMatrix
            ? "Editar matriz"
            : "Nueva matriz"
        }
      >
        <form
          onSubmit={handleSubmit(
            saveMatrix,
          )}
          className="space-y-5"
        >
          {/* NOMBRE */}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Nombre
              </label>

              <input
                {...register(
                  "name",
                  {
                    required:
                      true,
                  },
                )}
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-black"
                placeholder="Ej. Ventas por Sucursal"
              />
            </div>

            {/* DESCRIPCIÓN */}

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Descripción
              </label>

              <input
                {...register(
                  "description",
                  {
                    required:
                      true,
                  },
                )}
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-black"
                placeholder="Descripción de la matriz"
              />
            </div>
          </div>

          {/* DIMENSIONES */}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Filas
              </label>

              <input
                type="number"
                min="1"
                max="6"
                value={rows}
                onChange={(event) =>
                  changeDimensions(
                    Number(
                      event.target
                        .value,
                    ),
                    columns,
                  )
                }
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Columnas
              </label>

              <input
                type="number"
                min="1"
                max="6"
                value={columns}
                onChange={(event) =>
                  changeDimensions(
                    rows,
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="w-full rounded-xl border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-black"
              />
            </div>
          </div>

          {/* VALORES */}

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-700">
                Valores de la
                matriz
              </label>

              <span className="text-xs text-zinc-500">
                {rows} ×{" "}
                {columns}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div
                className="inline-grid gap-2"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(70px, 1fr))`,
                }}
              >
                {values.map(
                  (
                    row,
                    rowIndex,
                  ) =>
                    row.map(
                      (
                        value,
                        columnIndex,
                      ) => (
                        <input
                          key={`${rowIndex}-${columnIndex}`}
                          type="number"
                          step="any"
                          value={value}
                          onChange={(
                            event,
                          ) =>
                            updateCell(
                              rowIndex,
                              columnIndex,
                              event
                                .target
                                .value,
                            )
                          }
                          className="h-11 min-w-[70px] rounded-lg border border-zinc-300 bg-white px-2 text-center font-mono text-sm outline-none focus:border-black"
                          aria-label={`Fila ${
                            rowIndex +
                            1
                          }, columna ${
                            columnIndex +
                            1
                          }`}
                        />
                      ),
                    ),
                )}
              </div>
            </div>
          </div>

          {/* BOTONES */}

          <div className="flex justify-end gap-3 border-t border-zinc-200 pt-5">
            <button
              type="button"
              onClick={
                closeModal
              }
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
            >
              <X size={17} />

              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50"
            >
              <Save size={17} />

              {saving
                ? "Guardando..."
                : selectedMatrix
                  ? "Guardar cambios"
                  : "Crear matriz"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}