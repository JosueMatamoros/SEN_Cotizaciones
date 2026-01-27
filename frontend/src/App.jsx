import { useState, useEffect } from "react";
import { useReceptor, useItems } from "./hooks/useFormLogic";
import FormSection from "./section/form";
import PreviewSection from "./section/preview";
import { generarProformaPDF } from "./pdf/generarProformaPDF";
import { NavbarSimple } from "./components/shared/Header";
import { ConfirmDialog } from "./components/shared/ConfirmDialog";
import { useLocalStorage, useClearFormData, getFromLocalStorage } from "./hooks/useLocalStorage";
// import { createProforma } from "./services/api";

export default function App() {
  // Inicializar estados con datos del localStorage
  const [tab, setTab] = useState(() => getFromLocalStorage("proforma_tab", "cliente"));
  const [asesorOpen, setAsesorOpen] = useState(false);

  const [cliente, setCliente] = useState(() => getFromLocalStorage("proforma_cliente", {
    nombre: "",
    numero: "",
    correo: "",
    direccion: "",
  }));

  const [empresa, setEmpresa] = useState(() => getFromLocalStorage("proforma_empresa", {
    nombreEmpresa: "",
    correo: "",
    direccion: "",
    numeroEmpresa: "",
    asesorNombre: "",
    asesorNumero: "",
  }));

  const receptor = useReceptor(tab, cliente, empresa);

  const {
    productos,
    setProductos,
    servicios,
    setServicios,
  } = useItems(
    getFromLocalStorage("proforma_productos", [{ id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" }]),
    getFromLocalStorage("proforma_servicios", [{ id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" }])
  );

  const [moneda, setMoneda] = useState(() => getFromLocalStorage("proforma_moneda", "CRC"));
  const [tipoCambio, setTipoCambio] = useState(() => getFromLocalStorage("proforma_tipoCambio", ""));
  const [aplicarIVA, setAplicarIVA] = useState(() => getFromLocalStorage("proforma_aplicarIVA", false));
  const [nota, setNota] = useState(() => getFromLocalStorage("proforma_nota", ""));
  const [anexos, setAnexos] = useState(() => getFromLocalStorage("proforma_anexos", ""));

  const [numeroProforma, setNumeroProforma] = useState("00001");
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });
  const [errores, setErrores] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Implementar localStorage para cada estado (solo guardar cambios)
  useLocalStorage("proforma_tab", tab, setTab);
  useLocalStorage("proforma_cliente", cliente, setCliente);
  useLocalStorage("proforma_empresa", empresa, setEmpresa);
  useLocalStorage("proforma_productos", productos, setProductos);
  useLocalStorage("proforma_servicios", servicios, setServicios);
  useLocalStorage("proforma_moneda", moneda, setMoneda);
  useLocalStorage("proforma_tipoCambio", tipoCambio, setTipoCambio);
  useLocalStorage("proforma_aplicarIVA", aplicarIVA, setAplicarIVA);
  useLocalStorage("proforma_nota", nota, setNota);
  useLocalStorage("proforma_anexos", anexos, setAnexos);

  const clearFormData = useClearFormData();

  // Función para limpiar errores de items cuando hay cambios
  const clearItemsError = () => {
    if (errores.items) {
      setErrores((prev) => {
        const { items, ...rest } = prev;
        return rest;
      });
    }
  };

  // Wrapper para setProductos que limpia errores
  const setProductosWithClear = (updateFn) => {
    setProductos(updateFn);
    clearItemsError();
  };

  // Wrapper para setServicios que limpia errores
  const setServiciosWithClear = (updateFn) => {
    setServicios(updateFn);
    clearItemsError();
  };

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


  const handleLimpiarClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLimpiar = () => {
    setConfirmOpen(false);
    handleLimpiarFormulario();
  };

  const handleLimpiarFormulario = () => {
    // Limpiar localStorage
    clearFormData();

    // Resetear estados a valores iniciales
    setTab("cliente");
    setCliente({
      nombre: "",
      numero: "",
      correo: "",
      direccion: "",
    });
    setEmpresa({
      nombreEmpresa: "",
      correo: "",
      direccion: "",
      numeroEmpresa: "",
      asesorNombre: "",
      asesorNumero: "",
    });
    setProductos([{ id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" }]);
    setServicios([{ id: crypto.randomUUID(), nombre: "", cantidad: "1", precioUnitario: "0" }]);
    setMoneda("CRC");
    setTipoCambio("");
    setAplicarIVA(false);
    setNota("");
    setAnexos("");
    setErrores({});

  };

  const handleDescargar = async () => {
    if (guardando) return;

    // Reiniciar errores
    setErrores({});

    // Validar nombre del receptor
    const nombreReceptor = tab === "cliente"
      ? String(cliente.nombre || "").trim()
      : String(empresa.nombreEmpresa || "").trim();

    const nuevosErrores = {};

    if (!nombreReceptor) {
      nuevosErrores.nombreReceptor = "El nombre es obligatorio";
    }

    const items = buildItems();

    if (items.length === 0) {
      nuevosErrores.items = "Debes agregar al menos un producto o servicio con nombre";
    }

    // Si hay errores, mostrarlos y no continuar
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setToast({
        open: true,
        message: "Por favor completa los campos obligatorios",
        type: "error"
      });
      setTimeout(() => {
        setToast((t) => ({ ...t, open: false }));
      }, 3000);
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
      setToast({ open: true, message: "El documento ha sido creado y está listo para descargar.", type: "success" });
      generarProformaPDF({
        fechaTexto: new Date().toLocaleDateString("es-CR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        numeroProforma: `#SEN-${numeroProforma}`,
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
      setToast({
        open: true,
        message: `Por favor, verifica que todos los campos requeridos estén completos.`,
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
      <NavbarSimple
        onDescargar={handleDescargar}
        onLimpiar={handleLimpiarClick}
        guardando={guardando}
      />
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmLimpiar}
      />

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
              setProductos={setProductosWithClear}
              servicios={servicios}
              setServicios={setServiciosWithClear}
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
              errores={errores}
              numeroProforma={numeroProforma}
              setNumeroProforma={setNumeroProforma}
            />
          </div>

          {toast.open ? (
            <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right">
              <div
                className={["rounded-xl px-4 py-4 shadow-xl border text-sm font-medium min-w-[320px] max-w-md",toast.type === "success" ? "bg-cyan-50 border-cyan-200" : "bg-red-50 border-red-200",].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={["shrink-0 w-6 h-6 rounded-full flex items-center justify-center",toast.type === "success" ? "bg-cyan-100" : "bg-red-100",].join(" ")}
                  >
                    {toast.type === "success" ? (
                      <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className={["font-semibold mb-1",toast.type === "success" ? "text-cyan-900" : "text-red-900"].join(" ")}>{toast.type === "success" ? "PDF generado correctamente" : "Error en el campo"}</p>
                    <p className={["text-sm",toast.type === "success" ? "text-cyan-700" : "text-red-700"].join(" ")}>{toast.message}</p>
                  </div>

                  <button
                    onClick={() => setToast((t) => ({ ...t, open: false }))}
                    className={["shrink-0 text-lg leading-none hover:opacity-70 transition-opacity",toast.type === "success" ? "text-cyan-400" : "text-red-400"].join(" ")}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      );
    }
