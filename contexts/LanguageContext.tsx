"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { locales, defaultLocale, Locale } from "@/config/i18n";

// Tipo para nuestros mensajes de traducción
export type Messages = Record<string, any>;

// Interfaz para el contexto
interface LanguageContextType {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
}

// Valores por defecto
const defaultValues: LanguageContextType = {
  locale: defaultLocale,
  messages: {},
  setLocale: () => {},
};

// Crear el contexto
const LanguageContext = createContext<LanguageContextType>(defaultValues);

// Hook personalizado para usar el contexto
export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Messages>({});
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el idioma guardado en localStorage al iniciar
  useEffect(() => {
    const savedLocale = localStorage.getItem("language") || defaultLocale;
    if (locales.includes(savedLocale as any)) {
      loadMessages(savedLocale as Locale);
    } else {
      loadMessages(defaultLocale);
    }
  }, []);

  // Función para cargar los mensajes de un idioma
  const loadMessages = async (localeToLoad: Locale) => {
    setIsLoading(true);
    try {
      const messages = (await import(`../messages/${localeToLoad}.json`)).default;
      setMessages(messages);
      setLocaleState(localeToLoad);
      localStorage.setItem("language", localeToLoad);
    } catch (error) {
      console.error(`Error loading messages for ${localeToLoad}`, error);
      // Fallback al idioma por defecto
      if (localeToLoad !== defaultLocale) {
        loadMessages(defaultLocale);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cambiar el idioma
  const setLocale = (newLocale: Locale) => {
    if (locales.includes(newLocale)) {
      loadMessages(newLocale);
    }
  };

  // Mostrar un loading mientras se cargan los mensajes
  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Cargando...</div>;
  }

  return (
    <LanguageContext.Provider value={{ locale, messages, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Función de traducción sencilla
export function t(messages: Messages, key: string, fallback: string = ""): string {
  const keys = key.split(".");
  let result = messages;
  
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof result === "string" ? result : fallback || key;
} 