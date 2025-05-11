"use client";

import React from "react";
import { 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { locales } from "@/config/i18n";

export const LanguageSwitch = () => {
  const t = useTranslations("navbar");
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  // Handle language change
  const handleChange = (newLocale: string) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // If the new path starts with /, keep it, otherwise add /
    const newPath = pathWithoutLocale.startsWith('/') 
      ? `/${newLocale}${pathWithoutLocale}` 
      : `/${newLocale}/${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  // Language display names
  const languageNames: Record<string, string> = {
    en: "English",
    es: "Español"
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="light" 
          className="text-sm min-w-0 px-1"
        >
          {languageNames[locale]}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label={t("language")}
        onAction={(key) => handleChange(key as string)}
        selectedKeys={[locale]}
      >
        {locales.map((l) => (
          <DropdownItem key={l}>
            {languageNames[l]}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}; 