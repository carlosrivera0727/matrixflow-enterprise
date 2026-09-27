# MatrixFlow Enterprise - Frontend

Frontend de la Fase 1 del plan maestro de MatrixFlow Enterprise. Está construido con React, TypeScript, Vite y Tailwind CSS, y utiliza datos simulados persistidos en `localStorage` hasta que se complete la integración con FastAPI.

## Ejecución

```bash
npm ci
npm run dev
```

Para validar una entrega:

```bash
npm run lint
npm run build
```

## Acceso de demostración

- Administrador: `admin@matrixflow.pe`
- Analista: `analista@matrixflow.pe`
- Consulta: `consulta@matrixflow.pe`
- Contraseña para los tres perfiles: `demo123`

## Módulos incluidos

- Login y sesión local de demostración.
- Layout responsive, navegación móvil y rutas protegidas.
- Dashboard con indicadores y gráficos.
- Perfil de empresa y CRUD visual de sucursales, productos y usuarios.
- Registro de ventas con actualización de inventario.
- Gestión y edición de vectores y matrices.
- Operaciones vectoriales y matriciales con validación de dimensiones.
- Historial de cálculos, reportes y exportación CSV.
- Configuración y restauración de datos simulados.

## Integración futura

El cliente HTTP está preparado en `src/services/api/client.ts`. Define `VITE_API_URL` cuando la API FastAPI esté disponible. Los cálculos que actualmente se simulan en React deben delegarse al motor Python + NumPy durante las fases 4 y 5.
