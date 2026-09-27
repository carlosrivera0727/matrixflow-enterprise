import { AlertTriangle, Boxes, Edit3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import KpiCard from "../../components/common/KpiCard";
import Modal from "../../components/common/Modal";
import PageHeader from "../../components/common/PageHeader";
import StatusBadge from "../../components/common/StatusBadge";
import { useMockStore } from "../../hooks/useMockStore";
import type { InventoryItem } from "../../types";
import { formatDate } from "../../utils/formatters";

export default function Inventario() {
  const { inventory, products, branches, adjustInventory } = useMockStore();
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [editing, setEditing] = useState<InventoryItem | null>(null);
  const [stock, setStock] = useState(0);
  const filtered = useMemo(() => inventory.filter((item) => {
    const product = products.find((value) => value.id === item.productId)?.name ?? "";
    const branch = branches.find((value) => value.id === item.branchId)?.name ?? "";
    return `${product} ${branch}`.toLowerCase().includes(search.toLowerCase()) && (branchFilter === "all" || item.branchId === Number(branchFilter));
  }), [inventory, products, branches, search, branchFilter]);
  const total = inventory.reduce((sum, item) => sum + item.stock, 0);
  const low = inventory.filter((item) => item.stock <= (products.find((product) => product.id === item.productId)?.minimumStock ?? 0)).length;

  return (
    <div>
      <PageHeader eyebrow="Operaciones" title="Inventario" description="Control de existencias por producto y sucursal." />
      <section className="space-y-5 p-4 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><KpiCard title="Unidades disponibles" value={total.toLocaleString("es-PE")} icon={Boxes} /><KpiCard title="Posiciones registradas" value={String(inventory.length)} icon={Boxes} /><KpiCard title="Alertas de stock" value={String(low)} change={low ? "Requiere atención" : "Sin alertas"} trend={low ? "down" : "up"} icon={AlertTriangle} /></div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o sucursal" className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500" /></div><select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600"><option value="all">Todas las sucursales</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Producto</th><th className="px-5 py-4">Sucursal</th><th className="px-5 py-4">Stock</th><th className="px-5 py-4">Mínimo</th><th className="px-5 py-4">Estado</th><th className="px-5 py-4">Actualización</th><th className="px-5 py-4" /></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map((item) => { const product = products.find((value) => value.id === item.productId); const status = item.stock <= (product?.minimumStock ?? 0) ? "Stock bajo" : "Disponible"; return <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-semibold text-slate-900">{product?.name}</td><td className="px-5 py-4 text-slate-600">{branches.find((value) => value.id === item.branchId)?.name}</td><td className="px-5 py-4 text-lg font-bold text-slate-900">{item.stock}</td><td className="px-5 py-4 text-slate-500">{product?.minimumStock}</td><td className="px-5 py-4"><StatusBadge label={status} /></td><td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500">{formatDate(item.updatedAt)}</td><td className="px-5 py-4"><button onClick={() => { setEditing(item); setStock(item.stock); }} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><Edit3 size={17} /></button></td></tr>; })}</tbody></table></div></div>
      </section>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Ajustar existencia" description="Registra la cantidad física disponible.">
        <label className="block text-sm font-medium text-slate-700">Nuevo stock<input value={stock} onChange={(event) => setStock(Number(event.target.value))} type="number" min="0" className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5" /></label>
        <div className="mt-5 flex justify-end gap-3"><button onClick={() => setEditing(null)} className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancelar</button><button onClick={() => { if (editing) adjustInventory(editing.id, stock); setEditing(null); }} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Guardar ajuste</button></div>
      </Modal>
    </div>
  );
}
