import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
}

export default function KpiCard({ title, value, change, trend = "neutral", icon: Icon }: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/40">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600"><Icon size={20} /></div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend === "down" ? "text-rose-600" : "text-emerald-600"}`}>
            {trend === "down" ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}
          </span>
        )}
      </div>
      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
