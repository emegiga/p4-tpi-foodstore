"""
Engine de SQLModel.

Usa PostgreSQL, configurado mediante variables de entorno.
Las pruebas reemplazan el engine que usa el Unit of Work por SQLite en memoria.
"""

from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL, echo=False)

def session_factory() -> Session:
    # expire_on_commit=False: los objetos siguen legibles después del commit
    return Session(engine, expire_on_commit=False)

def create_all_tables() -> None:
    """Crea las tablas registradas en SQLModel.metadata al arrancar la app."""
    import app.modules.usuarios.models  # noqa: F401
    import app.modules.categorias.models  # noqa: F401
    import app.modules.productos.models  # noqa: F401
    import app.modules.pedidos.models  # noqa: F401
    SQLModel.metadata.create_all(engine)
