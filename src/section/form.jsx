import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Field from "../components/form/Field";
import Tabs from "../components/form/Tabs";
import Accordion from "../components/form/Accordion";
import Card from "../components/form/Card";
import ItemsSection from "../components/form/ItemsSection";

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

  return (
    <section className="w-full  p-6">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <Card title="Datos">
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
                  pattern="^\+506\s\d{4}-\d{4}$"
                  title="Formato: +506 8888-8888"
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
                <Field
                  label="Número empresa"
                  placeholder="+506 8888-8888"
                  value={empresa.numeroEmpresa}
                  onChange={(v) =>
                    setEmpresa((s) => ({ ...s, numeroEmpresa: v }))
                  }
                  type="tel"
                  pattern="^\+506\s\d{4}-\d{4}$"
                  title="Formato: +506 8888-8888"
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
          addLabel="Agregar Producto"
          items={productos}
          setItems={setProductos}
          namePlaceholder="Nombre del producto"
          currency="CRC"
        />

        <ItemsSection
          title="Servicios"
          addLabel="Agregar Servicio"
          items={servicios}
          setItems={setServicios}
          namePlaceholder="Nombre del servicio"
          currency="CRC"
        />
      </div>
    </section>
  );
}
