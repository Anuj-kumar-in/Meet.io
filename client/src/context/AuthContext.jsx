import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("meetio-user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("meetio-user", JSON.stringify(user));
            if (user.token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
            }
        } else {
            localStorage.removeItem("meetio-user");
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [user]);

    // Configure axios base URL from Vite env so /api calls go to backend in dev/prod
    useEffect(() => {
        try {
            const apiBase = import.meta.env.VITE_API_URL || "";
            if (apiBase) axios.defaults.baseURL = apiBase;
        } catch (e) {
            // import.meta may not be available in some tooling, ignore
        }
    }, []);

    const login = (payload) => {
        // payload should contain { token, user }
        const next = { ...payload.user, token: payload.token };
        setUser(next);
    };

    const logout = () => setUser(null);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
