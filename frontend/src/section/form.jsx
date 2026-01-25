import { AnimatePresence, motion } from "framer-motion";
import Field from "../components/form/Field";
import Tabs from "../components/form/Tabs";
import Accordion from "../components/form/Accordion";
import Card from "../components/form/Card";
import AnexosTextarea from "../components/form/AnexosTextarea";
import { User, Box, Wrench, PencilLine, FileText } from "../utils/icons";
import ItemsSection from "../components/form/ItemsSection";
import CustomSelect from "../components/form/CustomSelect";
import Toggle from "../components/form/Toggle";

export default function FormSection({
  tab,
  setTab,
  asesorOpen,
  setAsesorOpen,
  cliente,
  setCliente,
  empresa,
  setEmpresa,
  productos,
  setProductos,
  servicios,
  setServicios,
  moneda,
  setMoneda,
  tipoCambio,
  setTipoCambio,
  aplicarIVA,
  setAplicarIVA,
  nota,
  setNota,
  anexos,
  setAnexos,
  errores = {},
}) {
  return (
    <section className="w-full p-4">
      <div className="mx-auto w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        {/* Datos */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <User size={20} className="text-cyan-500" />
            <span className="font-semibold text-lg text-slate-700">Datos</span>
          </div>
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
                <Field label="Nombre" placeholder="Nombre del cliente" value={cliente.nombre} onChange={(v) => setCliente((s) => ({ ...s, nombre: v }))} error={errores.nombreReceptor} />
                <Field label="Número" placeholder="+506 8888-8888" value={cliente.numero} onChange={(v) => setCliente((s) => ({ ...s, numero: v }))} type="tel" />
                <Field label="Correo" placeholder="correo@ejemplo.com" value={cliente.correo} onChange={(v) => setCliente((s) => ({ ...s, correo: v }))} type="email" />
                <Field label="Dirección exacta" placeholder="Provincia, cantón, distrito, señas exactas" value={cliente.direccion} onChange={(v) => setCliente((s) => ({ ...s, direccion: v }))} />
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
                <Field label="Nombre empresa" placeholder="Razón social" value={empresa.nombreEmpresa} onChange={(v) => setEmpresa((s) => ({ ...s, nombreEmpresa: v }))} error={errores.nombreReceptor} />
                <Field label="Número empresa" placeholder="+506 8888-8888" value={empresa.numeroEmpresa} onChange={(v) => setEmpresa((s) => ({ ...s, numeroEmpresa: v }))} type="tel" />
                <Field label="Correo" placeholder="empresa@ejemplo.com" value={empresa.correo} onChange={(v) => setEmpresa((s) => ({ ...s, correo: v }))} type="email" />
                <Field label="Dirección exacta" placeholder="Provincia, cantón, distrito, señas exactas" value={empresa.direccion} onChange={(v) => setEmpresa((s) => ({ ...s, direccion: v }))} />
                <div className="md:col-span-2">
                  <Accordion title="Asesor" open={asesorOpen} onToggle={() => setAsesorOpen((v) => !v)}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <Field label="Nombre del asesor" placeholder="Nombre del asesor" value={empresa.asesorNombre} onChange={(v) => setEmpresa((s) => ({ ...s, asesorNombre: v }))} />
                      <Field label="Número del asesor" placeholder="+506 8888-8888" value={empresa.asesorNumero} onChange={(v) => setEmpresa((s) => ({ ...s, asesorNumero: v }))} type="tel" />
                    </div>
                  </Accordion>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Productos */}
        <div className="mb-10">
          <ItemsSection
            title="Productos"
            icon={<Box size={22} strokeWidth={2.2} className="text-cyan-500 drop-shadow-sm" />}
            addLabel="Agregar Producto"
            items={productos}
            setItems={setProductos}
            namePlaceholder="Nombre del producto"
            currency="CRC"
            error={errores.items}
          />
        </div>

        {/* Servicios */}
        <div className="mb-10">
          <ItemsSection
            title="Servicios"
            icon={<Wrench size={22} strokeWidth={2.2} className="text-cyan-500 drop-shadow-sm" />}
            addLabel="Agregar Servicio"
            items={servicios}
            setItems={setServicios}
            namePlaceholder="Nombre del servicio"
            currency="CRC"
            error={errores.items}
          />
        </div>

        {/* Notas Adicionales */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <PencilLine size={20} className="text-cyan-500" />
            <span className="font-semibold text-lg text-slate-700">Notas Adicionales</span>
          </div>
          <textarea className="w-full min-h-30 rounded-md bg-white px-4 py-2 text-sm text-slate-700 focus:ring-4 focus:ring-cyan-100 border border-slate-200" placeholder="Escribe aquí tus notas..." value={nota} onChange={e => setNota(e.target.value)} />
        </div>

        {/* Detalles de cotización */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-cyan-500" />
            <span className="font-semibold text-lg text-slate-700">Detalles de cotización</span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-around ">
            <div className="w-full md:w-1/3">
              <label className="block mb-2 text-sm font-medium text-slate-700">Moneda</label>
              <CustomSelect value={moneda} onChange={setMoneda} />
            </div>
            <div className="w-full md:w-1/3">
              <label className="block mb-2 text-sm font-medium text-slate-700">Tipo de cambio</label>
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">₡</span>
                <input type="text" value={tipoCambio} onChange={(e) => setTipoCambio(e.target.value.replace(/\D/g, ""))} disabled={moneda !== "USD"} placeholder="520" className="w-full rounded-md border border-slate-200 bg-white pl-8 pr-4 py-2 text-sm text-slate-700 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:bg-slate-100" />
              </div>
            </div>
            <div className="md:w-1/3 w-full flex flex-col items-start">
              <label className="mb-2 text-sm font-medium text-slate-700">Aplicar IVA</label>
              <Toggle checked={aplicarIVA} onChange={setAplicarIVA} />
            </div>
          </div>
        </div>

        {/* Anexos */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-cyan-500" />
            <span className="font-semibold text-lg text-slate-700">Anexos</span>
          </div>
          <AnexosTextarea value={anexos} onChange={e => setAnexos(e.target.value)} />
        </div>
      </div>
    </section>
  );
}
