import plugin from "tailwindcss/plugin";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tailwindCompatPlugin } from "./tailwind.compat.plugin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function sourceGlob(relativePattern) {
    return path.join(__dirname, relativePattern).replace(/\\/g, "/");
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        sourceGlob("index.html"),
        sourceGlob("src/**/*.jsx"),
        sourceGlob("src/**/*.js"),
    ],
    theme: {
        screens: {
            sm: "576px",
            md: "768px",
            lg: "992px",
            xl: "1200px",
            "2xl": "1536px",
        },
        container: {
            center: true,
            padding: "15px",
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#9b1f1f",
                    dark: "#7a1818",
                    light: "#fef2f2",
                },
            },
            fontFamily: {
                sans: ["DM Sans", "ui-sans-serif", "system-ui", "sans-serif"],
                serif: ["DM Serif Display", "Georgia", "serif"],
            },
            keyframes: {
                fadeInLeft: {
                    "0%": { opacity: "0", transform: "translate3d(-40px,0,0)" },
                    "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
                },
                fadeInDown: {
                    "0%": { opacity: "0", transform: "translate3d(0,-20px,0)" },
                    "100%": { opacity: "1", transform: "translate3d(0,0,0)" },
                },
            },
            animation: {
                "fade-in-left": "fadeInLeft 1s ease-in-out both",
                "fade-in-left-1500": "fadeInLeft 1.5s ease-in-out both",
                "fade-in-left-2000": "fadeInLeft 2s ease-in-out both",
                "fade-in-left-2500": "fadeInLeft 2.5s ease-in-out both",
                "fade-in-left-3000": "fadeInLeft 3s ease-in-out both",
                "fade-in-down": "fadeInDown 0.5s ease-in-out both",
            },
            boxShadow: {
                "header-bar": "0 1px 0 rgba(15, 23, 42, 0.06)",
                "header-scrolled": "0 10px 40px rgba(15, 23, 42, 0.08)",
            },
        },
    },
    corePlugins: {
        preflight: true,
    },
    plugins: [
        plugin(({ addBase }) => {
            addBase({
                body: {
                    margin: "0",
                    fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
                    fontSize: "0.9375rem",
                    lineHeight: "1.7",
                    letterSpacing: "0.005em",
                    color: "#475569",
                    overflowX: "hidden",
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                },
                "img, video": { maxWidth: "100%", height: "auto" },
                "a": { color: "inherit" },
            });
        }),
        tailwindCompatPlugin,
    ],
};
