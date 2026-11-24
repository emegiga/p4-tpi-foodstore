import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ItemCarrito {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
}

interface CartState {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "cantidad">) => void;
  quitar: (producto_id: number) => void;
  cambiarCantidad: (producto_id: number, cantidad: number) => void;
  vaciar: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // +1 si el producto ya está en el carrito
      agregar: (item) =>
        set((state) => {
          const existe = state.items.find((i) => i.producto_id === item.producto_id);
          if (existe) {
            return {
              items: state.items.map((i) =>
                i.producto_id === item.producto_id ? { ...i, cantidad: i.cantidad + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, cantidad: 1 }] };
        }),

      quitar: (producto_id) =>
        set((state) => ({ items: state.items.filter((i) => i.producto_id !== producto_id) })),

      cambiarCantidad: (producto_id, cantidad) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.producto_id === producto_id ? { ...i, cantidad: Math.max(1, cantidad) } : i,
          ),
        })),

      vaciar: () => set({ items: [] }),

      total: () => get().items.reduce((suma, i) => suma + i.precio_unitario * i.cantidad, 0),
    }),
    { name: "carrito" },
  ),
);