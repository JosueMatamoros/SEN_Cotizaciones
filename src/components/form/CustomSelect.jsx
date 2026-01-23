import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const options = [
  { value: "CRC", label: "Colón (₡)" },
  { value: "USD", label: "Dólar ($)" },
];

export default function CustomSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  React.useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div ref={ref} className="relative w-full s">
      <button
        type="button"
        className="w-full flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition shadow-sm"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <svg className="ml-2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute z-10 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg py-1 text-sm"
            role="listbox"
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-2 cursor-pointer hover:bg-cyan-50 ${opt.value === value ? "bg-cyan-100 text-cyan-700 font-semibold" : "text-slate-700"}`}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                role="option"
                aria-selected={opt.value === value}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
