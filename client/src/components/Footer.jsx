import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer style={{ borderTop: "1px solid var(--border-color)", backgroundColor: "var(--bg-secondary)" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
                                style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                            >
                                M
                            </div>
                            <span className="text-lg font-bold tracking-tight">Meet.io</span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--text-muted)" }}>
                            Connect with world-class experts for personalized sessions. Real-time booking, instant confirmation.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                            Navigation
                        </h4>
                        <div className="space-y-3">
                            {[
                                { to: "/", label: "Home" },
                                { to: "/experts", label: "Browse Experts" },
                                { to: "/my-bookings", label: "My Bookings" },
                            ].map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className="block text-sm transition-colors duration-200"
                                    style={{ color: "var(--text-secondary)" }}
                                    onMouseEnter={(e) => (e.target.style.color = "var(--text-primary)")}
                                    onMouseLeave={(e) => (e.target.style.color = "var(--text-secondary)")}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                            Platform
                        </h4>
                        <div className="space-y-3">
                            {["Real-time Availability", "Instant Booking", "Expert Verified", "Secure Sessions"].map((item) => (
                                <p key={item} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                >
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        © {new Date().getFullYear()} Meet.io. All rights reserved.
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        Built for seamless expert connections.
                    </p>
                </div>
            </div>
        </footer>
    );
}
