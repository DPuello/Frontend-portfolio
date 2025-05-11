"use client";

import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  GitlabIcon,
  LinkedinIcon,
} from "@/components/icons";
import { personalData } from "@/config/personal-data";
import { useTranslation } from "@/hooks/useTranslation";

export const Navbar = () => {
  const { t } = useTranslation("navbar");
  
  return (
    <NextUINavbar maxWidth="xl" position="sticky" className="bg-secondary-100/80 dark:bg-secondary-900/80 shadow-md z-50">
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-secondary">Juan Daniel</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <p className="font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary to-secondary">Juan Daniel</p>
        </NavbarBrand>
        <NavbarItem className="hidden lg:flex">
          <Link
            className="text-foreground"
            href="/"
            size="lg"
          >
            {t("home")}
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            className="text-foreground"
            href="#about"
            size="lg"
          >
            {t("about")}
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            className="text-foreground"
            href="#projects"
            size="lg"
          >
            {t("projects")}
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            className="text-foreground"
            href="#hobbies"
            size="lg"
          >
            {t("hobbies")}
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:flex">
          <Link
            className="text-foreground"
            href="#contact"
            size="lg"
          >
            {t("contact")}
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex" justify="end">
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={personalData.contact.gitlab}>
            <GitlabIcon className="text-default-500" />
          </Link>
          <Link isExternal href={personalData.contact.linkedin}>
            <LinkedinIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
          <LanguageSwitcher />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="/"
            size="lg"
            title={t("home")}
          >
            {t("home")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="#about"
            size="lg"
            title={t("about")}
          >
            {t("about")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="#projects"
            size="lg"
            title={t("projects")}
          >
            {t("projects")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="#hobbies"
            size="lg"
            title={t("hobbies")}
          >
            {t("hobbies")}
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            className="w-full"
            color="foreground"
            href="#contact"
            size="lg"
            title={t("contact")}
          >
            {t("contact")}
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </NextUINavbar>
  );
};
