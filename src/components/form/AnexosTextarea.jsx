import React from "react";

export default function AnexosTextarea({ value, onChange }) {
  return (
    <textarea
      className="w-full min-h-30 max-h-[600px] rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-cyan-100 resize-y"
      placeholder="Agrega aquí los anexos o información adicional (puede ser muy extenso)"
      value={value}
      onChange={onChange}
      rows={6}
    />
  );
}
