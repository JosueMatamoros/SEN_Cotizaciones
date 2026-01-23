import { motion } from "framer-motion";

export default function Toggle({ label, checked, onChange, disabled }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={["inline-flex h-10 w-20 items-center rounded-full border transition-colors",
          "focus:outline-none focus:ring-4 focus:ring-cyan-100",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          checked ? "bg-cyan-400 border-cyan-400" : "bg-white border-slate-300",
        ].join(" ")}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={["h-8 w-8 rounded-full bg-white shadow-sm",
            checked ? "ml-11" : "ml-1",
          ].join(" ")}
        />
      </button>
      {label && (
        <span className="text-sm font-medium text-slate-700 select-none cursor-pointer">{label}</span>
      )}
    </div>
  );
}
