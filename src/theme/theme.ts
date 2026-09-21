import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#1f6feb" },
        background: { default: "#f6f8fa" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#4493f8" },
        background: { default: "#0d1117", paper: "#161b22" },
      },
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: { fontSize: "2rem", fontWeight: 600 },
    h2: { fontSize: "1.5rem", fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // Theme toggle cross-fade (see ThemeToggle)
        "::view-transition-old(root), ::view-transition-new(root)": {
          animationDuration: "400ms",
          animationTimingFunction: "ease-in-out",
        },
      },
    },
    MuiCard: {
      styleOverrides: { root: { transition: "border-color 150ms" } },
    },
    MuiTab: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 500, minHeight: 48 } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none" } },
    },
  },
});
