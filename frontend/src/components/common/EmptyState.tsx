import { Inbox } from "lucide-react";

interface EmptyStateProps { title: string; description: string }

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="rounded-2xl bg-slate-100 p-3 text-slate-500"><Inbox size={24} /></div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}
