export default function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  error
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "w-full rounded-md border px-4 py-2 text-sm text-slate-700",
          "focus:ring-4 transition-colors",
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-100"
            : "border-slate-200 bg-white focus:border-cyan-400 focus:ring-cyan-100"
        ].join(" ")}
      />
      {error && (
        <p className="text-xs text-red-600 font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
