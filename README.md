# TPI P4 - Food Store

**Materia:** Programación 4

**Alumno:**  Matias Higa

Aplicación web para un negocio de comidas. Los clientes se registran, recorren el catálogo, arman un carrito y confirman pedidos. El admin gestiona categorías, productos, stock, pedidos y usuarios desde un panel.

- **Repositorio:** https://github.com/emegiga/p4-tpi-foodstore
- **Video:** https://youtu.be/0geoujDrWfY

---

## Requisitos

| Herramienta | Versión |
|---|---|
| Python | 3.11 a 3.13 
| PostgreSQL | 15 o superior |
| Node.js | 20.19 o superior |
| pnpm | 9 o superior |

---

## Estructura del repositorio

```
p4-tpi-foodstore/
├── backend/     API REST con FastAPI + SQLModel + PostgreSQL
│   └── app/
│       ├── core/        configuración, base de datos, seguridad, dependencias, Unit of Work y repositorio base
│       ├── modules/     auth, usuarios, categorias, productos y pedidos (router, service, unit of work, repository, models, schemas)
│       └── db/seed.py   carga inicial de datos
└── frontend/    React + TypeScript + Vite + Tailwind CSS
    └── src/
        ├── features/    auth, categorias, productos, usuarios y pedidos (pages, components, hooks, api, types)
        ├── shared/      cliente Axios, componentes de interfaz y layout
        ├── store/       authStore y cartStore (Zustand)
        └── routes/      AppRouter y ProtectedRoute
```

---

## Backend

### 1. Crear la base de datos

En PostgreSQL (pgAdmin o psql), crear una base vacía:

```sql
CREATE DATABASE foodstore_db;
```

### 2. Instalar dependencias

Desde la carpeta `backend/`:

```bash
python -m venv .venv
.venv\Scripts\activate      
pip install -r requirements.txt
```

### 3. Configurar las variables de entorno

Copiar `.env.example` como `.env` y completar los valores:

```bash
copy .env.example .env          # Windows
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:CLAVE@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar el JWT (mínimo 32 caracteres) | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración de la sesión (cookie y token) | `30` |
| `FRONTEND_ORIGIN` | Origen permitido en CORS | `http://localhost:5173` |

Para generar una `SECRET_KEY` aleatoria:

```bash
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

### 4. Cargar los datos iniciales

```bash
python -m app.db.seed
```

Crea las tablas, los usuarios de prueba, 3 categorías y 8 productos con stock. Se puede ejecutar varias veces sin duplicar datos.

### 5. Ejecutar

```bash
uvicorn app.main:app --reload
```

- API: http://localhost:8000/api/v1
- Documentación: http://localhost:8000/docs y http://localhost:8000/redoc

---

## Frontend

Con el backend en ejecución, desde la carpeta `frontend/`:

### 1. Configurar las variables de entorno

```bash
copy .env.example .env          # Windows
```

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

### 2. Instalar, verificar y ejecutar

```bash
pnpm install
pnpm build      
pnpm dev
```

- Aplicación: http://localhost:5173

> El backend acepta peticiones solo desde `FRONTEND_ORIGIN` (`http://localhost:5173`). Si Vite levanta en otro puerto, el navegador no envía la cookie de sesión y las peticiones fallan.

---

## Usuarios de prueba

Los crea `python -m app.db.seed`:

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |
| `juan` | `Juan1234!` | user |

También se puede registrar un usuario nuevo desde la aplicación (con rol `user`).

---

## Funcionalidades

**Cliente (rol `user`)**
- Catálogo público con búsqueda por nombre, filtro por categoría y paginación.
- Carrito que se mantiene al recargar la página.
- Confirmación del pedido con dirección de entrega, forma de pago (efectivo o transferencia) y notas.
- Mis pedidos: listado, detalle y cancelación mientras el pedido está en `PENDIENTE`

**Administrador (rol `admin`)**
- Resumen con pedidos por estado, pedidos del día e ingresos de los pedidos entregados.
- ABM de categorías y productos, con cambio de stock y disponibilidad.
- Gestión de pedidos: avanzar (`PENDIENTE` → `EN_PREPARACION` → `ENTREGADO`) o cancelar.
- Gestión de usuarios: activar y desactivar cuentas (el admin no puede desactivarse a sí mismo).

**Reglas principales**
- El pedido se crea en una sola transacción: si un producto no tiene stock, no se guarda nada.
- El stock se descuenta al crear el pedido y se restituye al cancelarlo.
- Cada línea del pedido guarda una copia del nombre y del precio del producto.
- Las bajas son lógicas: categorías y productos se marcan como inactivos y los pedidos no se borran.

---

## Tecnologías

**Backend:** FastAPI, SQLModel, PostgreSQL, JWT en cookie HttpOnly (python-jose), bcrypt (passlib), pydantic-settings. Arquitectura en capas

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form, TanStack Table, React Router, Zustand y Axios. Organización x features
