"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export const useTranslation = (namespace?: string) => {
  const { locale, messages, setLocale } = useLanguage();

  /**
   * Función que traduce una clave
   * @param key Clave de traducción (puede incluir puntos para acceder a objetos anidados)
   * @param fallback Texto por defecto si no se encuentra la traducción
   * @param returnObject Si es true, devuelve el objeto completo en lugar de convertirlo a string
   * @returns Texto traducido o el objeto/array completo si returnObject es true
   */
  const t = (key: string, fallback: any = "", returnObject: boolean = false): any => {
    const keys = key.split(".");
    let result = messages[namespace || "default"];
    
    for (const k of keys) {
      if (result && typeof result === "object" && k in result) {
        result = result[k];
      } else {
        return fallback || key;
      }
    }
    
    if (returnObject) {
      return result !== undefined ? result : fallback;
    }
    
    return typeof result === "string" ? result : fallback || key;
  };

  return {
    t,
    locale,
    changeLanguage: setLocale
  };
}; 