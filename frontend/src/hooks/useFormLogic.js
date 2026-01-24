import { useState } from "react";

export function useReceptor(tab, cliente, empresa) {
  return tab === "cliente"
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
}

export function useItems(productosInit, serviciosInit) {
  const [productos, setProductos] = useState(productosInit);
  const [servicios, setServicios] = useState(serviciosInit);

  return {
    productos,
    setProductos,
    servicios,
    setServicios,
  };
}
