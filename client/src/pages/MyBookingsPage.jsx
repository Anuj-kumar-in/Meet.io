import { useState, useEffect } from "react";
import axios from "axios";
import { HiMail, HiSearch, HiCalendar, HiClock } from "react-icons/hi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const statusStyles = {
    pending: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Pending" },
    confirmed: { bg: "rgba(22,163,74,0.1)", color: "#16a34a", label: "Confirmed" },
    completed: { bg: "rgba(99,102,241,0.1)", color: "#6366f1", label: "Completed" },
    cancelled: { bg: "rgba(220,38,38,0.1)", color: "#dc2626", label: "Cancelled" },
};

export default function MyBookingsPage() {
    const [email, setEmail] = useState("");
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const fetchBookings = async (e, emailArg) => {
        e?.preventDefault();
        const targetEmail = (emailArg || email || "").trim();
        if (!targetEmail) {
            toast.error("Please enter your email");
            return;
        }

        setLoading(true);
        setSearched(true);
        try {
            const res = await axios.get(`/api/bookings?email=${encodeURIComponent(targetEmail)}`);
            setBookings(res.data);
            if (res.data.length === 0) {
                toast("No bookings found for this email", { icon: "📭" });
            }
        } catch {
            toast.error("Failed to fetch bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            const userEmail = user.email || user.userEmail || "";
            setEmail(userEmail);
            // automatically fetch bookings for signed-in user
            if (userEmail) fetchBookings(null, userEmail);
        }
    }, [user]);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    My Bookings
                </h1>
                <p style={{ color: "var(--text-muted)" }}>View and manage your session bookings</p>
            </div>

            {/* Search input removed — bookings are filtered automatically by the signed-in user's email. */}

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-6 animate-pulse"
                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: "var(--border-color)" }} />
                                <div className="flex-1 space-y-2">
                                    <div className="h-5 rounded w-1/3" style={{ backgroundColor: "var(--border-color)" }} />
                                    <div className="h-4 rounded w-1/4" style={{ backgroundColor: "var(--border-color)" }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : searched && bookings.length === 0 ? (
                <div className="text-center py-20">
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        📭
                    </div>
                    <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        No bookings found
                    </p>
                    <p style={{ color: "var(--text-muted)" }}>No sessions found for this email address.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const status = statusStyles[booking.status] || statusStyles.pending;
                        return (
                            <div
                                key={booking._id}
                                className="rounded-2xl p-6 transition-all duration-200"
                                style={{
                                    backgroundColor: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    boxShadow: "var(--shadow-sm)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                                    e.currentTarget.style.borderColor = "var(--border-hover)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                                    e.currentTarget.style.borderColor = "var(--border-color)";
                                }}
                            >
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: "var(--bg-secondary)" }}
                                        >
                                            {booking.expert?.avatar ? (
                                                <img src={booking.expert.avatar} alt={booking.expert.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>
                                                    {booking.expert?.name?.charAt(0) || "?"}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-base mb-0.5" style={{ color: "var(--text-primary)" }}>
                                                {booking.expert?.name || "Unknown Expert"}
                                            </h3>
                                            <p className="text-sm mb-2" style={{ color: "var(--text-muted)" }}>
                                                {booking.expert?.title || booking.expert?.category || ""}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                                                <span className="flex items-center gap-1">
                                                    <HiCalendar size={14} />
                                                    {formatDate(booking.date)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <HiClock size={14} />
                                                    {booking.timeSlot}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <span
                                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
                                        style={{ backgroundColor: status.bg, color: status.color }}
                                    >
                                        {status.label}
                                    </span>
                                </div>

                                {booking.notes && (
                                    <div
                                        className="mt-4 pt-4 text-sm"
                                        style={{ borderTop: "1px solid var(--border-color)", color: "var(--text-secondary)" }}
                                    >
                                        <span className="font-medium" style={{ color: "var(--text-muted)" }}>Notes: </span>
                                        {booking.notes}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
