"""
Script de seed — carga usuarios iniciales para pruebas.
Idempotente: se puede ejecutar múltiples veces sin duplicar datos.

Uso:
    python -m app.db.seed

Requiere PostgreSQL corriendo con las variables de .env configuradas.

Crea:
  - admin / Admin1234!  (role=admin)
  - juan / Juan1234!    (role=user)
"""

from sqlmodel import Session, select
from app.core.database import engine, create_all_tables
from app.core.security import hash_password
from app.modules.usuarios.models import Usuario
from app.modules.categorias.models import Categoria
from app.modules.productos.models import Producto


USUARIOS_INICIALES = [
    {
        "username":  "admin",
        "full_name": "Administrador del Sistema",
        "email":     "admin@example.com",
        "password":  "Admin1234!",
        "role":      "admin",
    },
    {
        "username":  "juan",
        "full_name": "Juan Garcia",
        "email":     "juan@example.com",
        "password":  "Juan1234!",
        "role":      "user",
    },
]

CATEGORIAS_INICIALES = [
    {"nombre": "Pizzas", "descripcion": "Pizzas a la piedra"},
    {"nombre": "Hamburguesas", "descripcion": "Hamburguesas caseras con papas"},
    {"nombre": "Bebidas", "descripcion": "Gaseosas, cervezas y jugos"},
]

# (categoría, nombre, descripción, precio, stock)
PRODUCTOS_INICIALES = [
    ("Pizzas", "Pizza muzzarella", "Salsa de tomate y muzzarella", 9500, 20),
    ("Pizzas", "Pizza napolitana", "Muzzarella, tomate en rodajas y ajo", 10500, 15),
    ("Pizzas", "Pizza fugazzeta", "Muzzarella y cebolla", 10000, 10),
    ("Hamburguesas", "Hamburguesa clasica", "Carne, lechuga, tomate y queso", 8500, 25),
    ("Hamburguesas", "Hamburguesa doble", "Doble carne, cheddar y panceta", 11000, 12),
    ("Hamburguesas", "Hamburguesa veggie", "Medallón de lentejas y calabaza", 8000, 8),
    ("Bebidas", "Coca-Cola 500 ml", "Versión regular", 2000, 50),
    ("Bebidas", "Agua mineral Villavicencio 1 ltr", "Agua mineral sin gas", 1500, 40),
]


def cargar_catalogo(session: Session) -> None:
    categorias: dict[str, Categoria] = {}
    for data in CATEGORIAS_INICIALES:
        categoria = session.exec(select(Categoria).where(Categoria.nombre == data["nombre"])).first()
        if categoria:
            print(f"  [=] Ya existe la categoría: {data['nombre']}")
        else:
            categoria = Categoria(**data)
            session.add(categoria)
            session.flush()  # para obtener el id
            print(f"  [+] Categoría creada: {data['nombre']}")
        categorias[data["nombre"]] = categoria

    for cat, nombre, descripcion, precio, stock in PRODUCTOS_INICIALES:
        if session.exec(select(Producto).where(Producto.nombre == nombre)).first():
            print(f"  [=] Ya existe el producto: {nombre}")
            continue
        session.add(Producto(
            categoria_id=categorias[cat].id,
            nombre=nombre,
            descripcion=descripcion,
            precio_base=precio,
            stock=stock,
        ))
        print(f"  [+] Producto creado: {nombre}")

def run() -> None:
    print("=== Seed — Seguridad JWT (PostgreSQL) ===")
    create_all_tables()

    with Session(engine) as session:
        for data in USUARIOS_INICIALES:
            existing = session.exec(
                select(Usuario).where(Usuario.username == data["username"])
            ).first()

            if existing:
                print(f"  [=] Ya existe: {data['username']} ({data['role']})")
            else:
                usuario = Usuario(
                    username        = data["username"],
                    full_name       = data["full_name"],
                    email           = data["email"],
                    hashed_password = hash_password(data["password"]),
                    role            = data["role"],
                )
                session.add(usuario)
                print(f"  [+] Creado:    {data['username']} / {data['password']}  (role={data['role']})")
        cargar_catalogo(session)
        session.commit()

    print("\nUsuarios disponibles para pruebas:")
    print("  admin / Admin1234!  → role=admin  (acceso total)")
    print("  juan  / Juan1234!   → role=user   (acceso básico)")
    print()


if __name__ == "__main__":
    run()
