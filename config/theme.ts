// Define a shared color palette that can be used across the application
export const colors = {
  light: {
    background: "#FFFFFF",
    foreground: "#11181C",
    primary: {
      50: "#FFF9E6",
      100: "#FFF2CC",
      200: "#FFE699",
      300: "#FFD966",
      400: "#FFCD33",
      500: "#FFC000", // Main yellow
      600: "#CC9A00",
      700: "#997300",
      800: "#664D00",
      900: "#332600",
      DEFAULT: "#FFC000",
      foreground: "#11181C",
    },
    secondary: {
      50: "#E6F3FF",
      100: "#CCE7FF",
      200: "#99CFFF",
      300: "#66B7FF",
      400: "#339FFF",
      500: "#0087FF", // Main blue
      600: "#006CCC",
      700: "#005199",
      800: "#003666",
      900: "#001B33",
      DEFAULT: "#0087FF",
      foreground: "#11181C",
    },
    shadow: "#0087FF",
    glow: "#fff",
    focus: "#FFC000",
  },
  dark: {
    background: "#0A0F14",
    foreground: "#ECEDEE",
    primary: {
      50: "#E6F3FF",
      100: "#CCE7FF",
      200: "#99CFFF",
      300: "#66B7FF",
      400: "#339FFF",
      500: "#0087FF", // Main blue
      600: "#006CCC",
      700: "#005199",
      800: "#003666",
      900: "#001B33",
      DEFAULT: "#0087FF",
      foreground: "#ECEDEE",
    },
    secondary: {
      50: "#FFF9E6",
      100: "#FFF2CC",
      200: "#FFE699",
      300: "#FFD966",
      400: "#FFCD33",
      500: "#FFC000", // Main yellow
      600: "#CC9A00",
      700: "#997300",
      800: "#664D00",
      900: "#332600",
      DEFAULT: "#FFC000",
      foreground: "#11181C",
    },
    shadow: "#000",
    glow: "#fff3",
    focus: "#0087FF",
  },
};

// Export individual color values for easy access in components
export const lightColors = colors.light;
export const darkColors = colors.dark;
