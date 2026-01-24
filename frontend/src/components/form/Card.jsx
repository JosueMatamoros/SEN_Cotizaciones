export default function Card({ title, icon, children, className = "", action }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className="text-slate-600">{icon}</div>}
          <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}
