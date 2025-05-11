"use client";

import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

import { useLanguage } from "@/contexts/LanguageContext";
import { locales, Locale } from "@/config/i18n";

export const LanguageSwitcher = () => {
  const { locale, setLocale, messages } = useLanguage();

  // Nombres de idiomas para mostrar
  const languageNames: Record<Locale, string> = {
    en: "English",
    es: "Español",
  };

  // Función para traducir textos de la interfaz
  const t = (key: string, fallback: string = "") => {
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
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="text-sm min-w-0 px-1" variant="light">
          {languageNames[locale]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("navbar.language", "Language")}
        selectedKeys={[locale]}
        onAction={(key) => setLocale(key as Locale)}
      >
        {locales.map((l) => (
          <DropdownItem key={l}>{languageNames[l]}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
