import React from "react";
import { Download } from "lucide-react";

const logo = "/logo.png";

export function NavbarSimple({ onDescargar, guardando }) {
  return (
    <header className="mx-auto max-w-7xl px-4 pt-2 pb-4 relative z-50">
      <nav className="bg-white shadow-md rounded-2xl px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
              <span
                className="ml-2 text-2xl italic font-[cursive] font-light"
                style={{ fontFamily: 'Dancing Script, cursive' }}
              >
                Si hay de otra...
              </span>
          </div>

          <button
            onClick={onDescargar}
            disabled={guardando}
            className={[
              "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm",
              "bg-gradient-to-r from-cyan-500 to-cyan-600",
              "text-white shadow-lg shadow-cyan-500/30",
              "transition-all duration-200 ease-out",
              "hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-105",
              "active:scale-95",
              guardando
                ? "opacity-70 cursor-not-allowed"
                : "hover:-translate-y-0.5",
            ].join(" ")}
          >
            {guardando ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span className="block md:hidden">PDF</span>
                <span className="hidden md:block">Descargar PDF</span>
              </>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
