/**
 * AdminContext — provides admin auth state and a refresh trigger
 * to all admin dashboard components.
 */
import PropTypes from "prop-types";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { isAdminLoggedIn, adminLogout, getAdminSession } from "../utils/adminStorage";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const [session, setSession]     = useState(() => getAdminSession());
    const [refreshKey, setRefreshKey] = useState(0);

    // Sync session state when localStorage changes (e.g. other tabs)
    useEffect(() => {
        setSession(getAdminSession());
    }, [refreshKey]);

    const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

    const logout = useCallback(() => {
        adminLogout();
        setSession(null);
    }, []);

    const value = useMemo(() => ({
        isAdmin:    isAdminLoggedIn() && session?.isAdmin === true,
        session,
        refreshKey,
        refresh,
        logout,
    }), [session, refreshKey, refresh, logout]);

    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

AdminProvider.propTypes = { children: PropTypes.node };

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
}
