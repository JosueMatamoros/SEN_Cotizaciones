const baseInput =
  "w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

function onlyDigits(value) {
  return String(value ?? "").replace(/[^\d]/g, "");
}

export function parseIntSafe(value, fallback = 1) {
  const cleaned = onlyDigits(value);
  if (cleaned === "") return fallback;
  const n = Number(cleaned);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

export default function IntegerInput({
  label,
  placeholder,
  value,
  onChange,
  min = 1,
}) {
  const displayValue = String(value ?? "");

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type="text"
        inputMode="numeric"
        className={baseInput}
        placeholder={placeholder}
        value={displayValue}
        onChange={(e) => {
          const cleaned = onlyDigits(e.target.value);
          if (cleaned === "") {
            onChange("");
            return;
          }
          const n = Number(cleaned);
          if (!Number.isFinite(n)) {
            onChange("");
            return;
          }
          const clamped = n < min ? min : n;
          onChange(String(clamped));
        }}
      />
    </div>
  );
}
