import PageHeader from "../../components/common/PageHeader";

const inventory = [
  {
    product: "Laptop empresarial",
    branch: "Sucursal Centro",
    stock: 42,
    status: "Disponible",
  },
  {
    product: "Monitor 24 pulgadas",
    branch: "Sucursal Norte",
    stock: 86,
    status: "Disponible",
  },
  {
    product: "Teclado mecánico",
    branch: "Sucursal Sur",
    stock: 8,
    status: "Stock bajo",
  },
];

export default function Inventario() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Operaciones"
        title="Inventario"
        description="Control de existencias y disponibilidad de productos."
      />

      <section className="p-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">
              Estado del inventario
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Sucursal</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {inventory.map((item) => (
                  <tr key={`${item.product}-${item.branch}`}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {item.product}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {item.branch}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {item.stock}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status === "Disponible"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}