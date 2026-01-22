const baseInput =
  "w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

const baseLabel = "mb-2 block text-sm font-medium text-slate-700";

export default function Field({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div>
      <label className={baseLabel}>{label}</label>
      <input
        type={type}
        className={baseInput}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
