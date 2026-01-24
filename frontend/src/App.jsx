import { useState } from "react";
import FormSection from "./section/form";
import PreviewSection from "./section/preview";
import { generarProformaPDF } from "./pdf/generarProformaPDF";
import { NavbarSimple } from "./components/shared/Header";
import { createProforma } from "./services/api";

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

  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const toInt = (v, fallback) => {
    const n = Number.parseInt(String(v ?? ""), 10);
    return Number.isFinite(n) ? n : fallback;
  };

  const buildItems = () => {
    const prod = productos
      .filter((p) => String(p.nombre || "").trim().length > 0)
      .map((p) => ({
        type: "PRODUCT",
        description: String(p.nombre).trim(),
        unit_price: Math.max(0, toInt(p.precioUnitario, 0)),
        quantity: Math.max(1, toInt(p.cantidad, 1)),
      }));

    const serv = servicios
      .filter((s) => String(s.nombre || "").trim().length > 0)
      .map((s) => ({
        type: "SERVICE",
        description: String(s.nombre).trim(),
        unit_price: Math.max(0, toInt(s.precioUnitario, 0)),
        quantity: Math.max(1, toInt(s.cantidad, 1)),
      }));

    return [...prod, ...serv];
  };

  const handleDescargar = async () => {
    if (guardando) return;

    const items = buildItems();

    if (items.length === 0) {
      setToast({ open: true, message: "Agrega al menos un producto o servicio", type: "error" });
      setTimeout(() => {
        setToast((t) => ({ ...t, open: false }));
      }, 2500);
      return;
    }

    const payload = {
      party_type: receptor.tipo === "cliente" ? "CLIENT" : "COMPANY",
      party_name: String(receptor.nombre || "").trim(),
      party_phone: receptor.numero ? String(receptor.numero) : null,
      party_email: receptor.correo ? String(receptor.correo) : null,
      party_location: receptor.direccion ? String(receptor.direccion) : null,
      advisor_name:
        receptor.tipo === "empresa" && receptor.asesorNombre
          ? String(receptor.asesorNombre)
          : null,
      advisor_phone:
        receptor.tipo === "empresa" && receptor.asesorNumero
          ? String(receptor.asesorNumero)
          : null,
      notes: nota ? String(nota) : null,
      annex: anexos ? String(anexos) : null,
      items,
    };

    setGuardando(true);

    try {
      const res = await createProforma(payload);
      console.log("Proforma guardada", res);

      setToast({ open: true, message: "Proforma guardada correctamente", type: "success" });

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
      });
    } catch (e) {
      console.log("Error guardando proforma", e?.message || e);
      setToast({
        open: true,
        message: `Error guardando proforma: ${e?.message || "desconocido"}`,
        type: "error",
      });
    } finally {
      setGuardando(false);
      setTimeout(() => {
        setToast((t) => ({ ...t, open: false }));
      }, 2500);
    }
  };

  return (
    <div className="w-full ">
      <NavbarSimple />

      <button
        onClick={handleDescargar}
        disabled={guardando}
        className={[
          "bg-sky-500 text-white px-4 py-2 rounded font-semibold mx-auto block",
          "transition-transform duration-150 ease-out",
          "hover:bg-sky-600 hover:scale-[1.02] active:scale-[0.98]",
          guardando ? "opacity-70 cursor-not-allowed" : "",
        ].join(" ")}
      >
        {guardando ? "Guardando..." : "Descargar"}
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

      {toast.open ? (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={[
              "rounded-lg px-4 py-3 shadow-lg border text-sm font-medium bg-white",
              toast.type === "success" ? "border-green-200" : "border-red-200",
            ].join(" ")}
          >
            <div className="flex items-center gap-3">
              <div
                className={[
                  "h-2 w-2 rounded-full",
                  toast.type === "success" ? "bg-green-500" : "bg-red-500",
                ].join(" ")}
              />
              <p className="text-slate-800">{toast.message}</p>
              <button
                onClick={() => setToast((t) => ({ ...t, open: false }))}
                className="ml-2 text-slate-500 hover:text-slate-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
