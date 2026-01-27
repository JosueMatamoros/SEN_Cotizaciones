import { Mail, Phone, Globe, MapPin, User } from "lucide-react";
import React from "react";

function toNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function toInt(value, fallback = 1) {
  const n = Math.trunc(toNumber(value));
  return n >= 1 ? n : fallback;
}

function getTipoCambio(value, fallback = 520) {
  const n = toNumber(value);
  return n > 0 ? n : fallback;
}

function formatMoney(amount, currency) {
  const n = Number.isFinite(amount) ? amount : 0;
  try {
    const isCRC = currency === "CRC";
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency,
      minimumFractionDigits: isCRC ? 0 : 2,
      maximumFractionDigits: isCRC ? 0 : 2,
    }).format(n);
  } catch {
    return String(n);
  }
}

function normalizeItems(productos = [], servicios = []) {
  const p = productos.map((it) => ({
    id: it.id,
    nombre: it.nombre ?? "",
    detalle: it.detalle ?? "",
    cantidad: toInt(it.cantidad, 1),
    precioUnitarioCRC: toNumber(it.precioUnitario),
  }));

  const s = servicios.map((it) => ({
    id: it.id,
    nombre: it.nombre ?? "",
    detalle: it.detalle ?? "",
    cantidad: toInt(it.cantidad, 1),
    precioUnitarioCRC: toNumber(it.precioUnitario),
  }));

  return [...p, ...s].filter((x) => x.nombre.trim() !== "");
}

function InfoLine({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-[#334155]">
      <div className="text-[#06B6D4]">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function HeaderCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
      <div className="bg-[#06B6D4] px-5 py-3">
        <div className="text-sm font-semibold tracking-wide text-white">
          {title}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function QuotePreview({
  receptor,
  productos,
  servicios,
  moneda = "CRC",
  tipoCambio = "",
  aplicarIVA = false,
  ivaRate = 0.13,
  nota = "",
  anexos = "",
}) {
  const [expandido, setExpandido] = React.useState(false);
  const maxChars = 1300;
  const isLong = anexos.length > maxChars;
  const textoMostrar = !expandido && isLong ? anexos.slice(0, maxChars) + "..." : anexos;
  const items = normalizeItems(productos, servicios);

  const tipoCambioFinal = getTipoCambio(tipoCambio, 520);
  const isUSD = moneda === "USD";

  const convert = (amountCRC) =>
    isUSD ? amountCRC / tipoCambioFinal : amountCRC;
  const currencyToShow = isUSD ? "USD" : "CRC";

  const subtotalCRC = items.reduce(
    (acc, it) => acc + it.precioUnitarioCRC * it.cantidad,
    0,
  );

  const subtotal = convert(subtotalCRC);
  const iva = aplicarIVA ? subtotal * ivaRate : 0;
  const total = subtotal + iva;

  const receptorTitle = receptor?.tipo === "empresa" ? "EMPRESA" : "CLIENTE";
  const receptorNombre = receptor?.nombre?.trim() || "Nombre del cliente";

  return (
    <div className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm">
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <HeaderCard title="EMPRESA">
            <div className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-[#0F172A]">
                  Soluciones Eléctricas del Norte
                </div>
                <div className="mt-3 space-y-2">
                  <InfoLine icon={<Phone size={18} />} text="61350349" />
                  <InfoLine
                    icon={<Mail size={18} />}
                    text="soldelnorte.ceo@gmail.com"
                  />
                  <InfoLine
                    icon={<Globe size={18} />}
                    text="https://solusioneselectricas.com"
                  />
                </div>
              </div>
            </div>
          </HeaderCard>

          <HeaderCard title={receptorTitle}>
            <div className="space-y-4">
              <div>
                <div className="text-lg font-semibold text-[#0F172A]">
                  {receptorNombre}
                </div>

                <div className="mt-3 space-y-2">
                  {receptor?.correo ? (
                    <InfoLine
                      icon={<Mail size={18} />}
                      text={receptor.correo}
                    />
                  ) : null}

                  {receptor?.numero ? (
                    <InfoLine
                      icon={<Phone size={18} />}
                      text={receptor.numero}
                    />
                  ) : null}

                  {receptor?.direccion ? (
                    <InfoLine
                      icon={<MapPin size={18} />}
                      text={receptor.direccion}
                    />
                  ) : null}

                  {receptor?.tipo === "empresa" && receptor?.asesorNombre ? (
                    <InfoLine
                      icon={<User size={18} />}
                      text={`Asesor: ${receptor.asesorNombre}`}
                    />
                  ) : null}

                  {receptor?.tipo === "empresa" && receptor?.asesorNumero ? (
                    <InfoLine
                      icon={<Phone size={18} />}
                      text={receptor.asesorNumero}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </HeaderCard>
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#E2E8F0]">
        <div className="grid grid-cols-12 bg-[#06B6D4] px-5 py-4 text-xs font-semibold tracking-wide text-white md:text-sm">
            <div className="col-span-8">DESCRIPCIÓN</div>
            <div className="hidden sm:block md:col-span-2 text-center">PRECIO</div>
            <div className="hidden sm:block md:col-span-2 text-center">CANT.</div>
            <div className="col-span-4 text-left sm:text-center">TOTAL</div>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {items.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">
                Agrega productos o servicios para ver el detalle aquí.
              </div>
            ) : (
              items.map((it, idx) => {
                const precioUnitario = convert(it.precioUnitarioCRC);
                const lineTotal = precioUnitario * it.cantidad;
                const alt = idx % 2 === 1;

                return (
                  <div
                    key={it.id ?? `row-${idx}`}
                    className={[
                      "grid grid-cols-12 px-5 py-5",
                      alt ? "bg-slate-50" : "bg-white",
                    ].join(" ")}
                  >
                    <div className="col-span-8">
                      <div className="text-sm font-semibold text-[#0F172A] text- md:text-base ">
                        {it.nombre}
                      </div>
                      {it.detalle ? (
                        <div className="mt-1  text-sm text-[#64748B] ">
                          {it.detalle}
                        </div>
                      ) : null}
                    </div>

                    <div className="hidden md:block md:col-span-2 text-right text-sm text-[#334155] md:text-base">
                      {formatMoney(precioUnitario, currencyToShow)}
                    </div>

                    <div className="hidden  sm:block col-span-2 text-center text-sm text-[#334155] md:text-base">
                      {it.cantidad}
                    </div>

                    <div className="col-span-4 text-left text-sm font-semibold text-[#0F172A] md:text-base">
                      {formatMoney(lineTotal, currencyToShow)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-0 flex flex-col-reverse md:grid md:grid-cols-12 ">
          <div className="md:col-span-6 mt-2 md:mt-6 pl-4 md:pl-1">
            <div className="text-sm font-semibold tracking-wide text-[#06B6D4] mb-2">
              NOTAS
            </div>
            <div className="text-sm leading-5 text-gray-500 whitespace-pre-line break-words">
              {nota || "Sin notas"}
            </div>
          </div>
          <div className="md:col-span-6 ">
            <div className=" bg-[#FFFFFF]">
              <div className="p-5 ">
                <div className="flex items-center justify-between  py-2">
                  <div className="text-md  text-gray-500">
                    Subtotal:
                  </div>
                  <div className="text-lg font-semibold text-[#0F172A]">
                    {formatMoney(subtotal, currencyToShow)}
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-[#E2E8F0] py-2 ">
                  <div className="text-md  text-gray-500">
                    IVA ({Math.round(ivaRate * 100)}%):
                  </div>
                  <div className="text-lg font-semibold text-[#0F172A]">
                    {formatMoney(iva, currencyToShow)}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center rounded-xl bg-[#06B6D4] px-4 py-2 text-sm font-semibold text-white">
                      TOTAL:
                    </div>
                    <div className="text-2xl font-semibold text-[#06B6D4]">
                      {formatMoney(total, currencyToShow)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {anexos && (
          <div className="mt-4">
            <div className="rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] p-5">
              <div className="text-sm font-semibold tracking-wide text-[#06B6D4] mb-2">ANEXOS:</div>
              <div className="text-[#334155] whitespace-pre-line break-words">{textoMostrar}</div>
              {isLong && (
                <button
                  className="mt-2 text-[#06B6D4] underline text-xs font-semibold"
                  onClick={() => setExpandido((e) => !e)}
                >
                  {expandido ? "Mostrar menos" : "Mostrar todo"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
