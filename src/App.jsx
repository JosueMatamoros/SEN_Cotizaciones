import { useState } from "react";
import FormSection from "./section/form";
import PreviewSection from "./section/preview";
import { generarProformaPDF } from "./pdf/generarProformaPDF";

export default function App() {
  const [tab, setTab] = useState("cliente");
  const [asesorOpen, setAsesorOpen] = useState(false);

  const [cliente, setCliente] = useState({
    nombre: "",
    numero: "",
    correo: "",
    direccion: "",
  });

  const [empresa, setEmpresa] = useState({
    nombreEmpresa: "",
    correo: "",
    direccion: "",
    numeroEmpresa: "",
    asesorNombre: "",
    asesorNumero: "",
  });

  const [productos, setProductos] = useState([
    { id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" },
  ]);

  const [servicios, setServicios] = useState([
    { id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" },
  ]);

  const [moneda, setMoneda] = useState("CRC");
  const [tipoCambio, setTipoCambio] = useState("");
  const [aplicarIVA, setAplicarIVA] = useState(false);
  const [nota, setNota] = useState("");

  return (
    <div className="w-full ">
      <button
        onClick={() =>
          generarProformaPDF({
            fechaTexto: new Date().toLocaleDateString("es-CR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            numeroProforma: "#SEN-00001",
            cliente,
            empresa,
            productos,
            servicios,
            moneda,
            tipoCambio,
            aplicarIVA,
            nota,
            nombreArchivo: "proforma.pdf",
          })
        }
        className="bg-sky-500 text-white px-4 py-2 rounded font-semibold mx-auto block"
      >
        Descargar
      </button>

      <div className="w-full flex flex-col-reverse lg:flex-row">
        <PreviewSection
          tab={tab}
          cliente={cliente}
          empresa={empresa}
          productos={productos}
          servicios={servicios}
          moneda={moneda}
          tipoCambio={tipoCambio}
          aplicarIVA={aplicarIVA}
          nota={nota}
        />

        <FormSection
          tab={tab}
          setTab={setTab}
          asesorOpen={asesorOpen}
          setAsesorOpen={setAsesorOpen}
          cliente={cliente}
          setCliente={setCliente}
          empresa={empresa}
          setEmpresa={setEmpresa}
          productos={productos}
          setProductos={setProductos}
          servicios={servicios}
          setServicios={setServicios}
          moneda={moneda}
          setMoneda={setMoneda}
          tipoCambio={tipoCambio}
          setTipoCambio={setTipoCambio}
          aplicarIVA={aplicarIVA}
          setAplicarIVA={setAplicarIVA}
          nota={nota}
          setNota={setNota}
        />
      </div>
    </div>
  );
}
