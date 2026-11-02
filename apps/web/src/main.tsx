import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/gelasio/400.css";
import "@fontsource/gelasio/600.css";
import "@fontsource/shadows-into-light-two/400.css";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The app root element was not found.");
}

const root = createRoot(rootElement);
const missingSettings = [
  !import.meta.env.VITE_SUPABASE_URL && "VITE_SUPABASE_URL",
  !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY && "VITE_SUPABASE_PUBLISHABLE_KEY",
].filter((setting): setting is string => Boolean(setting));

if (missingSettings.length > 0) {
  root.render(
    <main style={{ maxWidth: 640, margin: "15vh auto", padding: 24, fontFamily: "Arial, sans-serif", color: "#262238" }}>
      <h1>Website configuration is incomplete</h1>
      <p>The web app needs these settings to start: {missingSettings.join(", ")}.</p>
      <p>
        Add them to <code>apps/web/.env.local</code> using the values from
        your Supabase project, then restart the web development server.
        See <code>.env.example</code> for the required variable names.
      </p>
    </main>,
  );
} else {
  void import("./App")
    .then(({ default: App }) => {
      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      );
    })
    .catch((error: unknown) => {
      console.error("The web app failed to load.", error);
      root.render(
        <main style={{ maxWidth: 640, margin: "15vh auto", padding: 24, fontFamily: "Arial, sans-serif", color: "#262238" }}>
          <h1>The website could not load</h1>
          <p>Check the browser console and development server output for the startup error.</p>
        </main>,
      );
    });
}
