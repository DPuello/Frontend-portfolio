"use client";

import { FC } from "react";
import { useIsSSR } from "@react-aria/ssr";
import clsx from "clsx";

import { useThemeWithFallback } from "./theme-provider";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: {
    base?: string;
    wrapper?: string;
  };
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useThemeWithFallback();
  const isSSR = useIsSSR();

  const handleToggle = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const isLight = theme === "light" || isSSR;
  
  return (
    <button
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={clsx(
        "px-px transition-opacity hover:opacity-80 cursor-pointer",
        className,
        classNames?.base,
      )}
      onClick={handleToggle}
    >
      <div
        className={clsx(
          "w-auto h-auto",
          "bg-transparent",
          "rounded-lg",
          "flex items-center justify-center",
          "!text-default-500",
          "pt-px",
          "px-0",
          "mx-0",
          classNames?.wrapper,
        )}
      >
        {isLight ? (
          <SunFilledIcon size={22} />
        ) : (
          <MoonFilledIcon size={22} />
        )}
      </div>
    </button>
  );
};
