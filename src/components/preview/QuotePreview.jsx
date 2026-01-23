import { Building2, User, Mail, Phone, Globe } from "lucide-react";

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function toInt(value, fallback = 1) {
  const n = Math.trunc(toNumber(value));
  return n >= 1 ? n : fallback;
}

function formatMoney(amount, currency) {
  const n = Number.isFinite(amount) ? amount : 0;
  try {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return String(n.toFixed(2));
  }
}

function normalizeItems(productos = [], servicios = []) {
  const p = productos.map((it) => ({
    id: it.id,
    tipo: "Producto",
    nombre: it.nombre ?? "",
    detalle: it.detalle ?? "",
    cantidad: toInt(it.cantidad, 1),
    precioUnitario: toNumber(it.precioUnitario),
  }));

  const s = servicios.map((it) => ({
    id: it.id,
    tipo: "Servicio",
    nombre: it.nombre ?? "",
    detalle: it.detalle ?? "",
    cantidad: toInt(it.cantidad, 1),
    precioUnitario: toNumber(it.precioUnitario),
  }));

  return [...p, ...s].filter((x) => x.nombre.trim() !== "");
}

function InfoLine({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-slate-700">
      <div className="text-cyan-600">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function HeaderCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-cyan-700 px-5 py-3">
        <div className="text-sm font-semibold tracking-wide text-white">
          {title}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function QuotePreview({
  empresa,
  cliente,
  productos,
  servicios,
  moneda = "CRC",
  tipoCambio = "",
  aplicarIVA = false,
  ivaRate = 0.13,
  nota = "",
}) {
  const items = normalizeItems(productos, servicios);

  const subtotal = items.reduce(
    (acc, it) => acc + it.precioUnitario * it.cantidad,
    0,
  );

  const iva = aplicarIVA ? subtotal * ivaRate : 0;
  const total = subtotal + iva;

  const tipoCambioNum = toNumber(tipoCambio);
  const showTipoCambio = moneda === "USD" && tipoCambioNum > 0;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <HeaderCard title="EMPRESA">
            <div className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  Soluciones Eléctricas del Norte
                </div>
                <div className="mt-3 space-y-2">
                  <InfoLine icon={<Phone size={18} />} text="61350349" />
                  <InfoLine
                    icon={<Mail size={18} />}
                    text="solusioneselectricas@gmail.com"
                  />
                  <InfoLine
                    icon={<Globe size={18} />}
                    text="https://solusioneselectricas.com"
                  />
                </div>
              </div>
            </div>
          </HeaderCard>

          <HeaderCard title="CLIENTE">
            <div className="space-y-4">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {cliente?.nombre || "Nombre del cliente"}
                  </div>
                  <div className="mt-3 space-y-2">
                    {cliente?.correo ? (
                      <InfoLine icon={<Mail size={18} />} text={cliente.correo} />
                    ) : null}
                    {cliente?.numero ? (
                      <InfoLine icon={<Phone size={18} />} text={cliente.numero} />
                    ) : null}
                  </div>
                </div>
            </div>
          </HeaderCard>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-slate-200">
          <div className="grid grid-cols-12 bg-cyan-700 px-5 py-4 text-xs font-semibold tracking-wide text-white md:text-sm">
            <div className="col-span-6">DESCRIPCIÓN</div>
            <div className="col-span-2 text-right">PRECIO</div>
            <div className="col-span-2 text-center">CANT.</div>
            <div className="col-span-2 text-right">TOTAL</div>
          </div>

          <div className="divide-y divide-slate-200">
            {items.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">
                Agrega productos o servicios para ver el detalle aquí.
              </div>
            ) : (
              items.map((it, idx) => {
                const lineTotal = it.precioUnitario * it.cantidad;
                const alt = idx % 2 === 1;
                return (
                  <div
                    key={it.id}
                    className={[
                      "grid grid-cols-12 px-5 py-5",
                      alt ? "bg-slate-50" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="col-span-6">
                      <div className="text-sm font-semibold text-slate-900 md:text-base">
                        {it.nombre}
                      </div>
                      {it.detalle ? (
                        <div className="mt-1 text-sm text-slate-500">
                          {it.detalle}
                        </div>
                      ) : (
                        <div className="mt-1 text-sm text-slate-500">
                          {it.tipo}
                        </div>
                      )}
                    </div>

                    <div className="col-span-2 text-right text-sm text-slate-700 md:text-base">
                      {formatMoney(it.precioUnitario, moneda)}
                    </div>

                    <div className="col-span-2 text-center text-sm text-slate-700 md:text-base">
                      {it.cantidad}
                    </div>

                    <div className="col-span-2 text-right text-sm font-semibold text-slate-900 md:text-base">
                      {formatMoney(lineTotal, moneda)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-12 ">
          <div className="md:col-span-8">
            <div className="rounded-xl border border-slate-200 bg-white">
              <div className="p-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="text-sm font-semibold text-slate-600">
                    SUBTOTAL:
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatMoney(subtotal, moneda)}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200 py-4">
                  <div className="text-sm font-semibold text-slate-600">
                    IVA ({Math.round(ivaRate * 100)}%):
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    {formatMoney(iva, moneda)}
                  </div>
                </div>

                <div className="pt-5">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-md bg-cyan-700 px-4 py-2 text-sm font-semibold text-white">
                      TOTAL:
                    </div>
                    <div className="text-2xl font-semibold text-cyan-700">
                      {formatMoney(total, moneda)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
         <div className="md:col-span-7 mt-6">
            <div className="text-sm font-semibold tracking-wide text-cyan-700">
              NOTAS
            </div>
            <div className=" text-sm leading-7 text-slate-600">
              {nota}
            </div>

            {showTipoCambio ? (
              <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">
                  Tipo de cambio
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {formatMoney(tipoCambioNum, "CRC")} por 1 USD
                </div>
              </div>
            ) : null}
          </div>
      </div>
    </div>
  );
}
