import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./ui/select.css";
import "./ui/button.css";
import "./i18n/i18n.ts";
import App from "./App.tsx";
import { ConverterProvider } from "./context/ConverterContext/ConverterContext.tsx";
import { ThemeProvider } from "./context/ThemeContext/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConverterProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ConverterProvider>
  </StrictMode>,
);
