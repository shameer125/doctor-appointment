import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Match CRA homepage / Vite base: subdirectory deploy sets both base and PUBLIC_URL prefix.
// PostCSS is loaded automatically from `postcss.config.js` in the project root (do not pin a
// relative path here — it can break on Windows / different CWDs).
export default defineConfig({
    plugins: [react()],
    base: "/",
    define: {
        "process.env.PUBLIC_URL": JSON.stringify(""),
    },
});
