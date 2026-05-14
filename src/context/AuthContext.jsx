import PropTypes from "prop-types";
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useEffect,
} from "react";
import {
    getUser,
    loginUser,
    logoutUser as clearEmailSession,
} from "../utils/emailAuth.js";

const AuthContext = createContext(null);

function sessionForReact() {
    const u = getUser();
    if (!u) return null;
    return {
        email: u.email,
        loggedInAt: u.loggedInAt,
    };
}

export function AuthProvider({ children }) {
    const [session, setSessionState] = useState(() => sessionForReact());
    const [bootstrapped, setBootstrapped] = useState(false);

    useEffect(() => {
        setSessionState(sessionForReact());
        setBootstrapped(true);
    }, []);

    const logout = useCallback(() => {
        clearEmailSession();
        setSessionState(null);
        const base = process.env.PUBLIC_URL || "";
        if (typeof window !== "undefined") {
            window.location.assign(`${base}/login`);
        }
    }, []);

    const login = useCallback((email) => {
        const res = loginUser(email);
        if (!res.ok) return res;
        setSessionState(sessionForReact());
        return { ok: true };
    }, []);

    /** Same as login — any valid email creates a client-side session. */
    const signup = useCallback(
        (payload) => {
            const email =
                typeof payload === "string" ? payload : payload?.email ?? "";
            return login(email);
        },
        [login]
    );

    const value = useMemo(
        () => ({
            bootstrapped,
            user: session,
            isAuthenticated: Boolean(session?.email),
            login,
            signup,
            logout,
        }),
        [bootstrapped, session, login, signup, logout]
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
