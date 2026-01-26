import QuotePreview from "../components/preview/QuotePreview";

export default function PreviewSection({
  tab,
  receptor,
  productos,
  servicios,
  moneda,
  tipoCambio,
  aplicarIVA,
  nota,
  anexos,
}) {
  return (
    <section className="w-full p-4 ">
      <div className="mx-auto w-full">
        <QuotePreview
          tab={tab}
          receptor={receptor}
          productos={productos}
          servicios={servicios}
          moneda={moneda}
          tipoCambio={tipoCambio}
          aplicarIVA={aplicarIVA}
          nota={nota}
          anexos={anexos}
        />
      </div>
    </section>
  );
}
