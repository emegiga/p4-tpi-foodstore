import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cambiarEstadoPedido } from "../api/pedidos";
import type { EstadoPedido } from "../types/pedido.types";

export function useCambiarEstadoPedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: EstadoPedido }) => cambiarEstadoPedido(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos"] });
      queryClient.invalidateQueries({ queryKey: ["resumen"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] }); // cancelar devuelve stock
    },
  });
}
