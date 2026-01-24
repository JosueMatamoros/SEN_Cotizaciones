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

  const receptor =
    tab === "cliente"
      ? {
          tipo: "cliente",
          nombre: cliente.nombre,
          numero: cliente.numero,
          correo: cliente.correo,
          direccion: cliente.direccion,
        }
      : {
          tipo: "empresa",
          nombre: empresa.nombreEmpresa,
          numero: empresa.numeroEmpresa,
          correo: empresa.correo,
          direccion: empresa.direccion,
          asesorNombre: empresa.asesorNombre,
          asesorNumero: empresa.asesorNumero,
        };

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
  const [anexos, setAnexos] = useState("");

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
            receptor,
            productos,
            servicios,
            moneda,
            tipoCambio,
            aplicarIVA,
            nota,
            anexos,
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
          receptor={receptor}
          productos={productos}
          servicios={servicios}
          moneda={moneda}
          tipoCambio={tipoCambio}
          aplicarIVA={aplicarIVA}
          nota={nota}
          anexos={anexos}
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
          anexos={anexos}
          setAnexos={setAnexos}
        />
      </div>
    </div>
  );
}
