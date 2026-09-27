export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8">
          <p className="text-sm text-slate-500">
            MatrixFlow Enterprise
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Accede al sistema empresarial.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
          />

          <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700">
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
}