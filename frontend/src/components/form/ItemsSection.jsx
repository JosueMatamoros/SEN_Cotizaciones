import { Plus, Trash2 } from "../../utils/icons";
import Field from "./Field";
import Card from "./Card";
import CurrencyInput, { parseCurrencyToNumber } from "./CurrencyInput";
import IntegerInput, { parseIntSafe } from "./IntegerInput";

function createItem() {
  return {
    id: crypto.randomUUID(),
    nombre: "",
    cantidad: "1",
    precioUnitario: "",
  };
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

export default function ItemsSection({
    title,
    icon,
    addLabel,
    items,
    setItems,
    namePlaceholder,
    currency = "CRC",
    currencySymbol,
    error,
  }) {
    const addItem = () => {
      setItems((prev) => [createItem(), ...prev]);
    };

    const updateItem = (id, patch) => {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, ...patch } : it))
      );
    };

    const removeItem = (id) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
    };

    return (
      <div className="rounded-xl bg-white px-0 py-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-semibold text-lg text-slate-700">{title}</span>
          </div>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-white font-semibold shadow-md hover:bg-cyan-600 transition text-base"
          >
            <Plus size={18} className="shrink-0" />
            <span className="hidden sm:inline">{addLabel}</span>
            <span className="inline sm:hidden">Agregar</span>
          </button>
        </div>
        {items.length === 0 ? (
          <div className="rounded-xl bg-slate-50 px-6 py-6 text-center text-slate-500">
            Haz clic en "{addLabel}" para comenzar
          </div>
        ) : (
          <div className="space-y-4">

            {items.map((it) => {
              const cantidad = parseIntSafe(it.cantidad, 1);
              const precioUnitario = parseCurrencyToNumber(it.precioUnitario);
              const totalLinea = precioUnitario * cantidad;
              const hasError = error && !it.nombre.trim();
              return (
                <div
                  key={it.id}
                  className="flex w-full items-end gap-3"
                >
                  <div className="flex-[2.5]">
                    <Field
                      label="Descripción"
                      placeholder={namePlaceholder}
                      value={it.nombre}
                      onChange={(v) => updateItem(it.id, { nombre: v })}
                      error={hasError ? "El nombre es obligatorio" : undefined}
                    />
                  </div>
                  <div className="w-24">
                    <IntegerInput
                      label="Cantidad"
                      placeholder="1"
                      value={it.cantidad}
                      onChange={(v) => updateItem(it.id, { cantidad: v })}
                      min={1}
                    />
                  </div>
                  <div className="w-36 relative">
                    <CurrencyInput
                      label="Precio"
                      placeholder="0"
                      value={it.precioUnitario}
                      onChange={(v) => updateItem(it.id, { precioUnitario: v })}
                      currency={currency}
                      currencySymbol={currencySymbol}
                    />
                    <span className="absolute left-0 top-full mt-1 text-sm font-semibold text-emerald-600 whitespace-nowrap">
                      {formatMoney(totalLinea, currency)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-red-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 ml-2"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
}
