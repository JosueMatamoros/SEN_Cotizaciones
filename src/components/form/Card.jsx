export default function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {action}
      </div>

      <div className="h-px w-full bg-slate-200" />

      <div className="p-8">
        {children}
      </div>
    </div>
  );
}
