import { NavLink } from "react-router-dom";
import {
  Building2,
  Boxes,
  Calculator,
  FileBarChart,
  History,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Warehouse,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Empresa",
    icon: Building2,
    path: "/empresa",
  },
  {
    label: "Sucursales",
    icon: Boxes,
    path: "/sucursales",
  },
  {
    label: "Productos",
    icon: Package,
    path: "/productos",
  },
  {
    label: "Ventas",
    icon: ShoppingCart,
    path: "/ventas",
  },
  {
    label: "Inventario",
    icon: Warehouse,
    path: "/inventario",
  },
  {
    label: "Análisis Matemático",
    icon: Calculator,
    path: "/vectores",
  },
  {
    label: "Historial",
    icon: History,
    path: "/historial",
  },
  {
    label: "Reportes",
    icon: FileBarChart,
    path: "/reportes",
  },
  {
    label: "Usuarios",
    icon: Users,
    path: "/usuarios",
  },
  {
    label: "Configuración",
    icon: Settings,
    path: "/configuracion",
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold">
          M
        </div>

        <div>
          <h1 className="text-sm font-bold tracking-wide">
            MATRIXFLOW
          </h1>
          <p className="text-[10px] text-slate-400">
            ENTERPRISE
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
         `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
            isActive
            ? "bg-blue-600 text-white"
         : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`
  }
>
  <Icon size={18} />
  <span>{item.label}</span>
</NavLink>
          );
        })}
      </nav>

      {/* Estado */}
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

          <div>
            <p className="text-xs font-medium">
              Sistema operativo
            </p>
            <p className="text-[10px] text-slate-400">
              MatrixFlow v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}