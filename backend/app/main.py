"""
Entry point de la aplicación FastAPI.

Responsabilidades:
  - Registrar routers (auth + categorías).
  - Configurar CORS para consumo desde frontend (React, etc.).
  - Crear tablas al arrancar (lifespan).
  - Health check en /health.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import create_all_tables
from app.core.config import settings
from app.modules.usuarios.router import router as auth_router
from app.modules.categorias.router import router as categorias_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Crea las tablas de BD al arrancar la aplicación"""
    create_all_tables()
    yield


app = FastAPI(
    title="Food Store (TPI - P4)",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS (ajustar origins en producción) ────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api/v1")
app.include_router(categorias_router, prefix="/api/v1")