import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/css/icofont.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import App from "./App.jsx";
import { AuthProvider }  from "./context/AuthContext.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <AdminProvider>
                <App />
            </AdminProvider>
        </AuthProvider>
    </React.StrictMode>
);
