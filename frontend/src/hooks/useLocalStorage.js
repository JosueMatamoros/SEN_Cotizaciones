import { useEffect, useRef } from "react";

/**
 * Función helper para cargar datos del localStorage
 * @param {string} key - Clave para localStorage
 * @param {*} defaultValue - Valor por defecto si no existe en localStorage
 */
export function getFromLocalStorage(key, defaultValue) {
  try {
    const savedData = localStorage.getItem(key);
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error(`Error al cargar ${key} desde localStorage:`, error);
  }
  return defaultValue;
}

/**
 * Hook personalizado para sincronizar estado con localStorage
 * @param {string} key - Clave para localStorage
 * @param {*} value - Valor actual del estado
 * @param {function} setValue - Función para actualizar el estado
 */
export function useLocalStorage(key, value, setValue) {
  const isFirstRender = useRef(true);

  // Cargar datos del localStorage solo en el primer render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      try {
        const savedData = localStorage.getItem(key);
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setValue(parsed);
        }
      } catch (error) {
        console.error(`Error al cargar ${key} desde localStorage:`, error);
      }
    }
  }, []); // Array vacío para ejecutar solo al montar

  // Guardar en localStorage cada vez que cambie el valor (después del primer render)
  useEffect(() => {
    if (!isFirstRender.current) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error al guardar ${key} en localStorage:`, error);
      }
    }
  }, [key, value]);
}

/**
 * Hook para limpiar todos los datos del formulario
 */
export function useClearFormData() {
  const clearAll = () => {
    const keys = [
      "proforma_cliente",
      "proforma_empresa",
      "proforma_productos",
      "proforma_servicios",
      "proforma_moneda",
      "proforma_tipoCambio",
      "proforma_aplicarIVA",
      "proforma_nota",
      "proforma_anexos",
      "proforma_tab"
    ];

    keys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error al limpiar ${key}:`, error);
      }
    });
  };

  return clearAll;
}
