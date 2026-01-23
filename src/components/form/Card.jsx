export default function Card({ title, action, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm ">
      <div className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
        <h2 className="text-3xl font-semibold text-slate-900">{title}</h2>
        {action}
      </div>
      <div className="px-8 py-4">
        {children}
      </div>
    </div>
  );
}
