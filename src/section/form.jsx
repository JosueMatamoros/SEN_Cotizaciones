import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Field from "../components/form/Field";
import Tabs from "../components/form/Tabs";
import Accordion from "../components/form/Accordion";
import Card from "../components/form/Card";
import { User, Box, Wrench, PencilLine, FileText } from "../utils/icons";
import ItemsSection from "../components/form/ItemsSection";
import CustomSelect from "../components/form/CustomSelect";
import Toggle from "../components/form/Toggle";

export default function FormSection() {
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

  // Detalles de cotización
  const [moneda, setMoneda] = useState("CRC");
  const [tipoCambio, setTipoCambio] = useState("");
  const [aplicarIVA, setAplicarIVA] = useState(false);

  return (
    <section className="w-full p-6">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <Card title="Datos" icon={<User size={20} />}>
          <Tabs value={tab} onChange={setTab} />

          <AnimatePresence mode="wait" initial={false}>
            {tab === "cliente" ? (
              <motion.div
                key="cliente"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                <Field
                  label="Nombre"
                  placeholder="Nombre del cliente"
                  value={cliente.nombre}
                  onChange={(v) => setCliente((s) => ({ ...s, nombre: v }))}
                />
                <Field
                  label="Número"
                  placeholder="+506 8888-8888"
                  value={cliente.numero}
                  onChange={(v) => setCliente((s) => ({ ...s, numero: v }))}
                  type="tel"
                />
                <Field
                  label="Correo"
                  placeholder="correo@ejemplo.com"
                  value={cliente.correo}
                  onChange={(v) => setCliente((s) => ({ ...s, correo: v }))}
                  type="email"
                />
                <Field
                  label="Dirección exacta"
                  placeholder="Provincia, cantón, distrito, señas exactas"
                  value={cliente.direccion}
                  onChange={(v) => setCliente((s) => ({ ...s, direccion: v }))}
                />
              </motion.div>
            ) : (
              <motion.div
                key="empresa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                <Field
                  label="Nombre empresa"
                  placeholder="Razón social"
                  value={empresa.nombreEmpresa}
                  onChange={(v) =>
                    setEmpresa((s) => ({ ...s, nombreEmpresa: v }))
                  }
                />
                <Field
                  label="Número empresa"
                  placeholder="+506 8888-8888"
                  value={empresa.numeroEmpresa}
                  onChange={(v) =>
                    setEmpresa((s) => ({ ...s, numeroEmpresa: v }))
                  }
                  type="tel"
                />
                <Field
                  label="Correo"
                  placeholder="empresa@ejemplo.com"
                  value={empresa.correo}
                  onChange={(v) => setEmpresa((s) => ({ ...s, correo: v }))}
                  type="email"
                />
                <Field
                  label="Dirección exacta"
                  placeholder="Provincia, cantón, distrito, señas exactas"
                  value={empresa.direccion}
                  onChange={(v) => setEmpresa((s) => ({ ...s, direccion: v }))}
                />

                <div className="md:col-span-2">
                  <Accordion
                    title="Asesor"
                    open={asesorOpen}
                    onToggle={() => setAsesorOpen((v) => !v)}
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field
                        label="Nombre del asesor"
                        placeholder="Nombre del asesor"
                        value={empresa.asesorNombre}
                        onChange={(v) =>
                          setEmpresa((s) => ({ ...s, asesorNombre: v }))
                        }
                      />
                      <Field
                        label="Número del asesor"
                        placeholder="+506 8888-8888"
                        value={empresa.asesorNumero}
                        onChange={(v) =>
                          setEmpresa((s) => ({ ...s, asesorNumero: v }))
                        }
                        type="tel"
                        pattern="^\+506\s\d{4}-\d{4}$"
                        title="Formato: +506 8888-8888"
                      />
                    </div>
                  </Accordion>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <ItemsSection
          title="Productos"
          icon={<Box size={22} strokeWidth={2.2} className="drop-shadow-sm" />}
          addLabel="Agregar Producto"
          items={productos}
          setItems={setProductos}
          namePlaceholder="Nombre del producto"
          currency="CRC"
        />

        <ItemsSection
          title="Servicios"
          icon={<Wrench size={22} strokeWidth={2.2} className="drop-shadow-sm" />}
          addLabel="Agregar Servicio"
          items={servicios}
          setItems={setServicios}
          namePlaceholder="Nombre del servicio"
          currency="CRC"
        />

        <Card title="Detalles de cotización" className="mt-8" icon={<FileText size={20} />}>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-around">
            <div className="w-full md:w-1/3">
              <label className="block mb-2 text-sm font-medium text-slate-700">Moneda</label>
              <CustomSelect value={moneda} onChange={setMoneda} />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-2 text-sm font-medium text-slate-700">Tipo de cambio</label>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">₡</span>
                <input
                  type="text"
                  value={tipoCambio}
                  onChange={(e) => setTipoCambio(e.target.value.replace(/\D/g, ""))}
                  disabled={moneda !== "USD"}
                  placeholder="520"
                  className="w-full rounded-md border border-slate-200 bg-white pl-8 pr-4 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-100"
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 flex flex-col items-center md:items-start">
              <label className="block mb-2 text-sm font-medium text-slate-700">Aplicar IVA</label>
              <Toggle checked={aplicarIVA} onChange={setAplicarIVA} />
            </div>
          </div>
        </Card>
        <Card title="Notas" className="mt-8" icon={<PencilLine size={20} />}>
          <textarea
            className="w-full min-h-30 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700  focus:ring-4 focus:ring-cyan-100"
            placeholder="Escribe aquí tus notas..."
          />
        </Card>
      </div>
    </section>
  );
}
