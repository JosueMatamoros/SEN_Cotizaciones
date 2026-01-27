
import { BrushCleaning } from "../../utils/icons";

export function ConfirmDialog({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white border border-cyan-100 rounded-3xl shadow-2xl px-6 py-8 md:px-12 md:py-12 w-full max-w-lg animate-in fade-in relative transition-all duration-200 mx-6">
        <button
          className="absolute top-5 right-5 text-gray-300 hover:text-cyan-500 text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-200/60 rounded-full transition"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="bg-cyan-50 rounded-full p-5 mb-3 shadow-sm border border-cyan-100">
            <BrushCleaning size={56} className="text-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold text-cyan-800 mb-1 text-center tracking-tight">Limpiar formulario</h2>
          <p className="text-cyan-700 text-base text-center mb-2 max-w-xs">La información de todos los campos se eliminará <span className='font-semibold'>definitivamente</span>. Esta acción no se puede deshacer.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            className="flex-1 px-4 py-3 rounded-xl border border-cyan-100 bg-white text-cyan-700 font-semibold text-lg hover:bg-cyan-50 hover:text-cyan-900 transition shadow-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 text-white font-semibold text-lg hover:bg-cyan-600 transition shadow-lg"
            onClick={onConfirm}
          >
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}

