import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const configPath = path
    .join(__dirname, "tailwind.config.js")
    .replace(/\\/g, "/");

/**
 * Tailwind must be invoked: `tailwindcss()`, not passed as a bare reference.
 * Otherwise PostCSS may not run the JIT pipeline and almost no utilities emit.
 */
export default {
    plugins: [tailwindcss({ config: configPath }), autoprefixer()],
};
