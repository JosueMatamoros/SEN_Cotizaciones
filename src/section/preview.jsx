import QuotePreview from "../components/preview/QuotePreview";
export default function PreviewSection({
  tab,
  cliente,
  empresa,
  productos,
  servicios,
  moneda,
  tipoCambio,
  aplicarIVA,
  nota,
}) {
  return (
    <section className="w-full p-6 ">

      <div className="mx-auto w-full">
        <QuotePreview
          empresa={empresa}
          cliente={cliente}
          productos={productos}
          servicios={servicios}
          moneda={moneda}
          tipoCambio={tipoCambio}
          aplicarIVA={aplicarIVA}
          nota={nota}
        />
      </div>
    </section>
  );
}
