import { Bell, Menu, Search } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <div className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Abrir navegación"><Menu size={21} /></button>
          <div className="hidden max-w-md flex-1 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-slate-400 sm:flex"><Search size={17} /><span className="text-sm">Buscar módulos y registros</span></div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Notificaciones"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-white" /></button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{user?.name}</p><p className="text-xs text-slate-500">{user?.role}</p></div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">{user?.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</div>
          </div>
        </div>
        <main><Outlet /></main>
      </div>
    </div>
  );
}
