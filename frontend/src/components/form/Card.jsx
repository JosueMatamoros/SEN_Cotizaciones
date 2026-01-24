export default function Card({ title, action, children, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm ">
      <div className="flex items-center justify-between bg-gradient-to-r from-cyan-50 via-white to-cyan-50 rounded-t-2xl px-8 py-4 border-b border-slate-200 ">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="bg-cyan-100 p-2 rounded-lg text-cyan-500 flex items-center justify-center shadow-sm">
              {icon}
            </span>
          )}
          <span className="text-2xl font-extrabold text-cyan-900 drop-shadow-sm">{title}</span>
        </div>
        {action && (
          <div>
            {action}
          </div>
        )}
      </div>
      <div className="px-8 py-4">
        {children}
      </div>
    </div>
  );
}
