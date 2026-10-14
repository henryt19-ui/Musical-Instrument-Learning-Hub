import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource/gelasio/400.css";
import "@fontsource/gelasio/600.css";
import "@fontsource/shadows-into-light-two/400.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
