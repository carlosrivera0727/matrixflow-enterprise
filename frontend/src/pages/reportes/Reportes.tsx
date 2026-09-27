import { BarChart3, Download, Package, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import KpiCard from "../../components/common/KpiCard";
import PageHeader from "../../components/common/PageHeader";
import { useMockStore } from "../../hooks/useMockStore";
import { formatCurrency } from "../../utils/formatters";

export default function Reportes() {
  const { sales, branches, products, inventory, operations, settings } = useMockStore();
  const salesByBranch = useMemo(() => branches.map((branch) => ({ name: branch.city, ventas: sales.filter((sale) => sale.branchId === branch.id).reduce((sum, sale) => sum + sale.total, 0), unidades: sales.filter((sale) => sale.branchId === branch.id).reduce((sum, sale) => sum + sale.quantity, 0) })), [branches, sales]);
  const stockByProduct = useMemo(() => products.map((product) => ({ name: product.name.split(" ").slice(0, 2).join(" "), stock: inventory.filter((item) => item.productId === product.id).reduce((sum, item) => sum + item.stock, 0), minimo: product.minimumStock * Math.max(1, branches.length) })), [products, inventory, branches.length]);
  const total = sales.reduce((sum, sale) => sum + sale.total, 0);
  const exportCsv = () => {
    const rows = [["Sucursal", "Ventas", "Unidades"], ...salesByBranch.map((item) => [item.name, item.ventas, item.unidades])];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "matrixflow-reporte-ventas.csv"; link.click(); URL.revokeObjectURL(url);
  };
  return (
    <div>
      <PageHeader eyebrow="Analítica empresarial" title="Reportes" description="Indicadores construidos a partir de los datos simulados del sistema." action={<button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Download size={17} />Exportar CSV</button>} />
      <section className="space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><KpiCard title="Ingresos totales" value={formatCurrency(total, settings.currency)} icon={ShoppingCart} /><KpiCard title="Unidades vendidas" value={sales.reduce((sum, sale) => sum + sale.quantity, 0).toString()} icon={Package} /><KpiCard title="Cálculos ejecutados" value={operations.length.toString()} icon={BarChart3} /></div>
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-950">Ventas y unidades por sucursal</h2><p className="mt-1 text-sm text-slate-500">Comparación del desempeño comercial</p><div className="mt-6 h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={salesByBranch} margin={{ left: -18 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip formatter={(value, name) => name === "ventas" ? formatCurrency(Number(value), settings.currency) : value} /><Legend /><Bar dataKey="ventas" name="Ventas" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold text-slate-950">Inventario frente al mínimo</h2><p className="mt-1 text-sm text-slate-500">Stock consolidado por producto</p><div className="mt-6 h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={stockByProduct} margin={{ left: -18, right: 12 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip /><Legend /><Line type="monotone" dataKey="stock" name="Stock" stroke="#06b6d4" strokeWidth={3} dot={{ fill: "#06b6d4" }} /><Line type="monotone" dataKey="minimo" name="Mínimo" stroke="#f59e0b" strokeDasharray="5 5" /></LineChart></ResponsiveContainer></div></div>
        </div>
      </section>
    </div>
  );
}
