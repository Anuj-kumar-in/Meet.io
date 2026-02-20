import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { HiSun, HiMoon, HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { to: "/", label: "Home" },
        { to: "/experts", label: "Experts" },
        { to: "/my-bookings", label: "My Bookings" },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className="sticky top-0 z-50 backdrop-blur-xl"
            style={{
                backgroundColor: isDark ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
                borderBottom: "1px solid var(--border-color)",
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-transform group-hover:scale-110"
                            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                        >
                            M
                        </div>
                        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
                            Meet.io
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    color: isActive(link.to) ? "var(--accent-text)" : "var(--text-secondary)",
                                    backgroundColor: isActive(link.to) ? "var(--accent)" : "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(link.to)) {
                                        e.target.style.backgroundColor = "var(--bg-secondary)";
                                        e.target.style.color = "var(--text-primary)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(link.to)) {
                                        e.target.style.backgroundColor = "transparent";
                                        e.target.style.color = "var(--text-secondary)";
                                    }
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg transition-all duration-200 cursor-pointer"
                            style={{ color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)" }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--accent)";
                                e.currentTarget.style.color = "var(--accent-text)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                e.currentTarget.style.color = "var(--text-secondary)";
                            }}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <HiSun size={18} /> : <HiMoon size={18} />}
                        </button>
                        {user ? (
                            <>
                                <span className="hidden md:block text-sm mr-3" style={{ color: "var(--text-secondary)" }}>
                                    {user.userName}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-3 py-1 rounded-lg text-sm font-medium"
                                    style={{ backgroundColor: "transparent", color: "var(--text-secondary)" }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-3 py-1 rounded-lg text-sm font-medium"
                                style={{ backgroundColor: "transparent", color: "var(--text-secondary)" }}
                            >
                                Login
                            </Link>
                        )}

                        <button
                            className="md:hidden p-2 rounded-lg cursor-pointer"
                            style={{ color: "var(--text-secondary)" }}
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="md:hidden pb-4 space-y-1">
                        {links.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setMenuOpen(false)}
                                className="block px-4 py-3 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    color: isActive(link.to) ? "var(--accent-text)" : "var(--text-secondary)",
                                    backgroundColor: isActive(link.to) ? "var(--accent)" : "transparent",
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
