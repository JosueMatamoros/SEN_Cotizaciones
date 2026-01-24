const baseInput =
  "w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100";

const symbolByCurrency = {
  CRC: "₡",
  USD: "$",
};

function onlyDigitsAndDot(value) {
  const cleaned = String(value ?? "").replace(/[^\d.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length <= 1) return cleaned;
  const intPart = parts[0];
  const decPart = parts.slice(1).join("");
  return intPart + "." + decPart;
}

function formatThousands(value) {
  const s = String(value ?? "");
  if (s === "") return "";
  const normalized = onlyDigitsAndDot(s);
  if (normalized === "") return "";

  const parts = normalized.split(".");
  let intRaw = parts[0] ?? "";
  const decRaw = parts[1] ?? "";
  intRaw = intRaw.replace(/^0+/, "") || "0";
  const intFormatted = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decRaw !== "" ? intFormatted + "." + decRaw : intFormatted;
}

export function parseCurrencyToNumber(value) {
  if (value === "" || value === null || value === undefined) return 0;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function CurrencyInput({
  label,
  placeholder,
  value,
  onChange,
  currency = "CRC",
  currencySymbol,
}) {
  const symbol = currencySymbol ?? symbolByCurrency[currency] ?? "$";
  const displayValue = formatThousands(value);

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 whitespace-nowrap">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-semibold text-slate-500">
          {symbol}
        </div>

        <input
          type="text"
          inputMode="decimal"
          className={[baseInput, "pl-9"].join(" ")}
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            let raw = e.target.value;
            let normalized = onlyDigitsAndDot(raw);

            if (normalized.includes(".")) {
              const parts = normalized.split(".");
              parts[0] = parts[0].replace(/^0+/, "") || "0";
              normalized = parts.join(".");
            } else {
              normalized = normalized.replace(/^0+/, "") || "";
            }

            onChange(normalized);
          }}
        />
      </div>
    </div>
  );
}
