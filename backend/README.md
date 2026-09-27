# MatrixFlow Enterprise - Backend

Backend de MatrixFlow Enterprise construido con FastAPI, Pydantic y SQLAlchemy.

## Requisitos

- Python 3.12 o superior.
- PowerShell, CMD o una terminal compatible.

## Instalación en Windows

Desde la carpeta `backend`:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Si el comando `py` no está disponible, utiliza la ruta de tu instalación de Python 3.12 para crear el entorno virtual.

## Ejecución

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Servicios disponibles:

- API: `http://127.0.0.1:8000`
- Documentación Swagger: `http://127.0.0.1:8000/docs`
- Estado de salud: `http://127.0.0.1:8000/health`

La opción `--reload` es sólo para desarrollo. En producción debe ejecutarse sin recarga automática.

## Pruebas

```powershell
python -m pytest -q
```

## Variables de entorno

Copia `.env.example` como `.env` y ajusta los valores. El archivo `.env` real está excluido de Git. Nunca se debe publicar `JWT_SECRET_KEY` de producción.

## Arquitectura

```text
app/
├── api/
│   ├── dependencies.py   # Dependencias compartidas de FastAPI
│   ├── router.py         # Router central y prefijo /api/v1
│   └── routes/           # Entrada y salida HTTP
├── algorithms/           # Contratos y algoritmos matemáticos puros
├── core/                 # Configuración, base de datos y errores comunes
├── models/               # Entidades SQLAlchemy
├── repositories/         # Consultas y persistencia
├── schemas/              # Contratos Pydantic
└── services/             # Casos de uso y control de transacciones
```

Reglas de dependencia:

- Los routers sólo traducen HTTP y llaman servicios.
- Los servicios aplican reglas de negocio y controlan `commit` o `rollback`.
- Los repositorios contienen las consultas SQLAlchemy y nunca confirman transacciones.
- Los algoritmos no dependen de FastAPI, SQLAlchemy ni Pydantic.
- Los modelos no importan routers, servicios ni repositorios.
