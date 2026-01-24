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
    <Card
      title={title}
      icon={icon}
      action={
        <button
          type="button"
          onClick={addItem}
          className="inline-flex h-10 items-center rounded-lg bg-cyan-400 px-3 lg:px-5 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-cyan-300 gap-2 "
        >
          <Plus size={20} className="shrink-0" />
          <span className="hidden sm:inline ">{addLabel}</span>
        </button>
      }
    >
      <div className="space-y-6">
        {items.map((it) => {
          const cantidad = parseIntSafe(it.cantidad, 1);
          const precioUnitario = parseCurrencyToNumber(it.precioUnitario);
          const totalLinea = precioUnitario * cantidad;

          return (
            <div
              key={it.id}
              className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start"
            >
              <div className="md:col-span-6">
                <Field
                  label="Nombre"
                  placeholder={namePlaceholder}
                  value={it.nombre}
                  onChange={(v) => updateItem(it.id, { nombre: v })}
                />
              </div>

              <div className="md:col-span-2">
                <IntegerInput
                  label="Cantidad"
                  placeholder="1"
                  value={it.cantidad}
                  onChange={(v) => updateItem(it.id, { cantidad: v })}
                  min={1}
                />
              </div>

              <div className="md:col-span-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <CurrencyInput
                      label="Precio unitario"
                      placeholder="0"
                      value={it.precioUnitario}
                      onChange={(v) => updateItem(it.id, { precioUnitario: v })}
                      currency={currency}
                      currencySymbol={currencySymbol}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-red-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-2 text-sm font-semibold text-emerald-600">
                  {formatMoney(totalLinea, currency)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
