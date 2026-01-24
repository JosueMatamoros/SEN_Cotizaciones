import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, History, BookOpen, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const logo = "/logo.png";

function NavList({ vertical = false, onClick }) {
  const navClass = vertical
    ? "flex flex-col items-center gap-2 py-2"
    : "flex flex-row items-center justify-center gap-4";

  const linkClass = vertical
    ? "w-1/2 flex items-center justify-center gap-2 font-medium px-4 py-2 rounded-xl transition hover:bg-gray-100 text-center"
    : "flex items-center gap-2 font-medium px-4 py-2 rounded-xl transition hover:bg-gray-100";

  return (
    <nav className={navClass}>
      <Link to="/" className={linkClass} onClick={onClick}>
        <Home className="w-5 h-5" />
        Inicio
      </Link>
      <Link to="/historial" className={linkClass} onClick={onClick}>
        <History className="w-5 h-5" />
        Historial
      </Link>
      <Link to="/catalogo" className={linkClass} onClick={onClick}>
        <BookOpen className="w-5 h-5" />
        Catálogo
      </Link>
    </nav>
  );
}


export function NavbarSimple() {
  const [open, setOpen] = useState(false);

  return (
    <header className="mx-auto max-w-7xl px-4 pt-2 relative z-50">
      <nav className="bg-white shadow-md rounded-2xl px-4 py-2">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            <span className="ml-2 font-bold text-lg font-roboto-slab">
              Grupo SEN
            </span>
          </div>

          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
            <NavList />
          </div>

          <div className="lg:hidden flex items-center">
            <button
              className="p-2 rounded focus:outline-none"
              onClick={() => setOpen(!open)}
              aria-label="Abrir menú"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden w-full justify-center "
              style={{ overflow: "hidden" }}
            >
              <NavList vertical onClick={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
