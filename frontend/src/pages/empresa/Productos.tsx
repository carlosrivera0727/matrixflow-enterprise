import PageHeader from "../../components/common/PageHeader";

const products = [
  {
    name: "Laptop empresarial",
    category: "Tecnología",
    stock: 42,
  },
  {
    name: "Monitor 24 pulgadas",
    category: "Periféricos",
    stock: 86,
  },
  {
    name: "Teclado mecánico",
    category: "Periféricos",
    stock: 124,
  },
];

export default function Productos() {
  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        eyebrow="Empresa"
        title="Productos"
        description="Catálogo y disponibilidad de productos."
      />

      <section className="p-8">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="font-semibold text-slate-900">
              Catálogo de productos
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4">Categoría</th>
                  <th className="px-6 py-4">Stock</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.name}>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {product.category}
                    </td>

                    <td className="px-6 py-4 text-slate-700">
                      {product.stock}
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