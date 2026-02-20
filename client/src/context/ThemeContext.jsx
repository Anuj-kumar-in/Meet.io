import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("meetio-theme");
        return saved ? saved === "dark" : false;
    });

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem("meetio-theme", isDark ? "dark" : "light");
        try {
            const link = document.querySelector('link[rel="icon"]');
            if (link) {
                link.href = isDark ? "/dark.png" : "/light.png";
            }
        } catch (e) {
            // ignore in non-browser environments
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
