import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import Empresa from "./pages/empresa/Empresa";
import Sucursales from "./pages/empresa/Sucursales";
import Productos from "./pages/empresa/Productos";

import Ventas from "./pages/ventas/Ventas";
import Inventario from "./pages/inventario/Inventario";

import Vectores from "./pages/matematico/Vectores";
import Matrices from "./pages/matematico/Matrices";
import Operaciones from "./pages/matematico/Operaciones";

import Historial from "./pages/historial/Historial";
import Reportes from "./pages/reportes/Reportes";
import Usuarios from "./pages/usuarios/Usuarios";
import Configuracion from "./pages/configuracion/Configuracion";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Autenticación */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Empresa */}
        <Route
          path="/empresa"
          element={
            <MainLayout>
              <Empresa />
            </MainLayout>
          }
        />

        <Route
          path="/sucursales"
          element={
            <MainLayout>
              <Sucursales />
            </MainLayout>
          }
        />

        <Route
          path="/productos"
          element={
            <MainLayout>
              <Productos />
            </MainLayout>
          }
        />

        {/* Operaciones */}
        <Route
          path="/ventas"
          element={
            <MainLayout>
              <Ventas />
            </MainLayout>
          }
        />

        <Route
          path="/inventario"
          element={
            <MainLayout>
              <Inventario />
            </MainLayout>
          }
        />

        {/* Análisis matemático */}
        <Route
          path="/vectores"
          element={
            <MainLayout>
              <Vectores />
            </MainLayout>
          }
        />

        <Route
          path="/matrices"
          element={
            <MainLayout>
              <Matrices />
            </MainLayout>
          }
        />

        <Route
          path="/operaciones"
          element={
            <MainLayout>
              <Operaciones />
            </MainLayout>
          }
        />

        {/* Historial */}
        <Route
          path="/historial"
          element={
            <MainLayout>
              <Historial />
            </MainLayout>
          }
        />

        {/* Reportes */}
        <Route
          path="/reportes"
          element={
            <MainLayout>
              <Reportes />
            </MainLayout>
          }
        />

        {/* Usuarios */}
        <Route
          path="/usuarios"
          element={
            <MainLayout>
              <Usuarios />
            </MainLayout>
          }
        />

        {/* Configuración */}
        <Route
          path="/configuracion"
          element={
            <MainLayout>
              <Configuracion />
            </MainLayout>
          }
        />

        {/* Ruta por defecto */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;