import { useMemo } from "react";
import { User, Building2 } from "../../utils/icons";

export default function Tabs({ value, onChange }) {
  const items = useMemo(
    () => [
      { key: "cliente", label: "Cliente", icon: User },
      { key: "empresa", label: "Empresa", icon: Building2 },
    ],
    []
  );

  return (
    <div className="mb-4 flex w-full flex-col gap-4 sm:flex-row sm:gap-6 ">
      {items.map((it) => {
        const active = it.key === value;
        const Icon = it.icon;
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => onChange(it.key)}
            className={[
              "h-12 w-full rounded-lg text-sm font-semibold transition-all  flex items-center justify-center gap-2 hover:scale-105  duration-300",
              active
                ? "bg-cyan-400 text-slate-900 shadow-sm"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            ].join(" ")}
          >
            <Icon size={20} className="shrink-0" />
            {it.label}
          </button>
        );
      })}
    </div>
  );
}
