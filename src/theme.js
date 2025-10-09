// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Inter, sans-serif",

    h1: { fontFamily: "Poppins, sans-serif", fontSize: "4vw" },   // scales with screen width
    h2: { fontFamily: "Poppins, sans-serif", fontSize: "3.5vw" },
    h3: { fontFamily: "Poppins, sans-serif", fontSize: "3vw" },
    h4: { fontFamily: "Poppins, sans-serif", fontSize: "2.5vw" },
    h5: { fontFamily: "Poppins, sans-serif", fontSize: "2vw" },
    h6: { fontFamily: "Poppins, sans-serif", fontSize: "1.8vw" },

    body1: { fontFamily: "Inter, sans-serif", fontSize: "1.6vw" },
    body2: { fontFamily: "Inter, sans-serif", fontSize: "1.4vw" },

    subtitle1: { fontFamily: "Inter, sans-serif", fontSize: "1.3vw" },
    subtitle2: { fontFamily: "Inter, sans-serif", fontSize: "1.2vw" },

    caption: { fontFamily: "Inter, sans-serif", fontSize: "1vw" },
    overline: { fontFamily: "Inter, sans-serif", fontSize: "0.9vw" },

    button: {
      fontFamily: '"Nunito Sans", sans-serif',
      fontSize: "1.4vw",
      textTransform: "none",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          fontSize: "1.4vw", // same as typography.button
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "1.3vw",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          fontSize: "1.5vw",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontSize: "1.4vw",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          fontSize: "1.3vw",
        },
      },
    },
  },
});

export default theme;
