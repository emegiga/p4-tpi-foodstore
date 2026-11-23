import type { ReactNode } from "react";
import Modal from "@/shared/components/Modal";

interface CategoriaModalProps {
  isOpen: boolean;
  esEdicion: boolean;
  onClose: () => void;
  onSubmit: () => void;
  errorMessage: string | null;
  children: ReactNode;
}

function CategoriaModal({ esEdicion, ...props }: CategoriaModalProps) {
  return <Modal titulo={esEdicion ? "Editar categoría" : "Nueva categoría"} {...props} />;
}

export default CategoriaModal;