import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  titulo: string;
  onClose: () => void;
  onSubmit: () => void;
  errorMessage: string | null;
  children: ReactNode; // los campos del formulario
}

// Modal reutilizable
function Modal({ isOpen, titulo, onClose, onSubmit, errorMessage, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">{titulo}</h2>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {children}

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-200 px-4 py-2 hover:bg-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;