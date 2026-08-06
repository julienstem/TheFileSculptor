import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./ui/select.css";
import "./ui/button.css";
import App from "./App.tsx";
import { ConverterProvider } from "./context/ConverterContext/ConverterContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConverterProvider>
      <App />
    </ConverterProvider>
  </StrictMode>,
);
