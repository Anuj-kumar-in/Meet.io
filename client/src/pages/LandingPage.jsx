import { Link } from "react-router-dom";
import { HiArrowRight, HiLightningBolt, HiShieldCheck, HiClock, HiUsers } from "react-icons/hi";

export default function LandingPage() {
    const features = [
        {
            icon: <HiUsers size={24} />,
            title: "Vetted Experts",
            desc: "Every expert is rigorously verified with proven track records in their respective fields.",
        },
        {
            icon: <HiClock size={24} />,
            title: "Real-Time Availability",
            desc: "See live slot availability. No double-bookings, no conflicts — slots update instantly.",
        },
        {
            icon: <HiLightningBolt size={24} />,
            title: "Instant Booking",
            desc: "Book your session in seconds. Immediate confirmation with zero friction.",
        },
        {
            icon: <HiShieldCheck size={24} />,
            title: "Secure & Reliable",
            desc: "Enterprise-grade security for your data. Every session is protected and private.",
        },
    ];

    const stats = [
        { value: "500+", label: "Expert Sessions" },
        { value: "98%", label: "Satisfaction Rate" },
        { value: "50+", label: "Categories" },
        { value: "24/7", label: "Availability" },
    ];

    return (
        <div>
            <section className="relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--text-primary) 1px, transparent 0)`,
                        backgroundSize: "32px 32px",
                    }}
                />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40 relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8 tracking-wider uppercase"
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--text-muted)",
                                border: "1px solid var(--border-color)",
                            }}
                        >
                            <span
                                className="w-2 h-2 rounded-full animate-pulse"
                                style={{ backgroundColor: "var(--success)" }}
                            />
                            Live Booking Platform
                        </div>

                        <h1
                            className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Book Sessions
                            <br />
                            with{" "}
                            <span className="relative">
                                Industry Experts
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 300 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1 9C50 3 150 1 299 9"
                                        stroke="var(--accent)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        opacity="0.3"
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p
                            className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Connect with verified professionals across technology, business, design, and more.
                            Real-time availability. Instant confirmation. Zero friction.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/experts"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 group"
                                style={{
                                    backgroundColor: "var(--accent)",
                                    color: "var(--accent-text)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "var(--accent)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                Browse Experts
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/my-bookings"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200"
                                style={{
                                    border: "2px solid var(--border-color)",
                                    color: "var(--text-primary)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--accent)";
                                    e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                My Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl sm:text-4xl font-black mb-1" style={{ color: "var(--text-primary)" }}>
                                    {stat.value}
                                </div>
                                <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                            Why Meet.io?
                        </h2>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--text-muted)" }}>
                            A platform designed for seamless expert engagement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-2xl transition-all duration-300 group cursor-default"
                                style={{
                                    border: "1px solid var(--border-color)",
                                    backgroundColor: "var(--bg-card)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "var(--accent)";
                                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                    e.currentTarget.style.boxShadow = "none";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                                    style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className="font-semibold text-base mb-2" style={{ color: "var(--text-primary)" }}>
                                    {feature.title}
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div
                        className="rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, var(--accent-text) 1px, transparent 0)`,
                                backgroundSize: "24px 24px",
                            }}
                        />
                        <div className="relative">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                                Ready to connect with an expert?
                            </h2>
                            <p className="text-lg mb-8 opacity-80 max-w-lg mx-auto">
                                Browse our curated network of industry professionals and book your session today.
                            </p>
                            <Link
                                to="/experts"
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-200 group"
                                style={{
                                    backgroundColor: "var(--accent-text)",
                                    color: "var(--accent)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                Get Started
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
