interface StatusBadgeProps { label: string }

export default function StatusBadge({ label }: StatusBadgeProps) {
  const positive = ["Activa", "Activo", "Completada", "Disponible", "Normal"].includes(label);
  const warning = ["Stock bajo", "Pendiente"].includes(label);
  const color = positive
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : warning
      ? "bg-amber-50 text-amber-700 ring-amber-600/20"
      : "bg-slate-100 text-slate-600 ring-slate-500/20";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${color}`}>{label}</span>;
}
