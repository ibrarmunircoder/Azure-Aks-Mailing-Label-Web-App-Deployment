import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { colors } from "utils";
import { checkboxClasses } from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import "react-datepicker/dist/react-datepicker.css";

const theme = createTheme({
  components: {
    MuiCheckbox: {
      styleOverrides: {
        colorPrimary: {
          color: colors.lightMediumGray,
          [`&.${checkboxClasses.checked}`]: {
            color: colors.lochinvar,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: ["KeplerStdRegular", "sans-serif"].join(","),
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
