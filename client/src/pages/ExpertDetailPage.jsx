import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../hooks/useSocket.js";
import { HiStar, HiBriefcase, HiClock, HiCalendar, HiArrowLeft, HiCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

export default function ExpertDetailPage() {
    const { id } = useParams();
    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchExpert = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/experts/${id}`);
                setExpert(res.data);
                if (res.data.availability && res.data.availability.length > 0) {
                    setSelectedDate(res.data.availability[0].date);
                }
            } catch {
                setError("Failed to load expert details.");
            } finally {
                setLoading(false);
            }
        };
        fetchExpert();
    }, [id]);

    const handleSlotBooked = useCallback((data) => {
        setExpert((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            updated.availability = updated.availability.map((a) => {
                if (a.date === data.date) {
                    return {
                        ...a,
                        slots: a.slots.map((s) =>
                            s.time === data.timeSlot ? { ...s, isBooked: true } : s
                        ),
                    };
                }
                return a;
            });
            return updated;
        });
        toast("A slot was just booked by another user.", { icon: "🔔" });
    }, []);

    const handleSlotFreed = useCallback((data) => {
        setExpert((prev) => {
            if (!prev) return prev;
            const updated = { ...prev };
            updated.availability = updated.availability.map((a) => {
                if (a.date === data.date) {
                    return {
                        ...a,
                        slots: a.slots.map((s) =>
                            s.time === data.timeSlot ? { ...s, isBooked: false } : s
                        ),
                    };
                }
                return a;
            });
            return updated;
        });
    }, []);

    useSocket(id, handleSlotBooked, handleSlotFreed);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    const selectedSlots = expert?.availability?.find((a) => a.date === selectedDate)?.slots || [];

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
                <div className="h-6 w-32 rounded mb-8" style={{ backgroundColor: "var(--border-color)" }} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl p-8" style={{ backgroundColor: "var(--bg-secondary)" }}>
                            <div className="w-24 h-24 rounded-2xl mx-auto mb-4" style={{ backgroundColor: "var(--border-color)" }} />
                            <div className="h-6 rounded w-3/4 mx-auto mb-2" style={{ backgroundColor: "var(--border-color)" }} />
                            <div className="h-4 rounded w-1/2 mx-auto" style={{ backgroundColor: "var(--border-color)" }} />
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="h-64 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)" }} />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !expert) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <p className="text-lg mb-4" style={{ color: "var(--text-muted)" }}>{error || "Expert not found"}</p>
                <Link to="/experts" className="text-sm font-medium underline" style={{ color: "var(--text-primary)" }}>
                    ← Back to Experts
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                to="/experts"
                className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
                <HiArrowLeft size={16} />
                Back to Experts
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div
                        className="rounded-2xl p-8 sticky top-24"
                        style={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        <div className="text-center mb-6">
                            <div
                                className="w-24 h-24 rounded-2xl mx-auto mb-4 overflow-hidden flex items-center justify-center"
                                style={{ backgroundColor: "var(--bg-secondary)" }}
                            >
                                {expert.avatar ? (
                                    <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-3xl font-bold" style={{ color: "var(--text-muted)" }}>
                                        {expert.name.charAt(0)}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                                {expert.name}
                            </h1>
                            <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
                                {expert.title}
                            </p>
                            <span
                                className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
                                style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                            >
                                {expert.category}
                            </span>
                        </div>

                        <div
                            className="grid grid-cols-3 gap-4 py-6 mb-6"
                            style={{ borderTop: "1px solid var(--border-color)", borderBottom: "1px solid var(--border-color)" }}
                        >
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <HiStar className="text-yellow-500" size={16} />
                                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>{expert.rating}</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{expert.totalReviews} reviews</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <HiBriefcase size={16} style={{ color: "var(--text-muted)" }} />
                                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>{expert.experience}</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Years exp.</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <HiClock size={16} style={{ color: "var(--text-muted)" }} />
                                    <span className="font-bold" style={{ color: "var(--text-primary)" }}>${expert.hourlyRate}</span>
                                </div>
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Per hour</p>
                            </div>
                        </div>

                        {expert.bio && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                    About
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {expert.bio}
                                </p>
                            </div>
                        )}

                        {expert.skills && expert.skills.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {expert.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-3 py-1 rounded-lg text-xs font-medium"
                                            style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div
                        className="rounded-2xl p-8"
                        style={{
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border-color)",
                            boxShadow: "var(--shadow-sm)",
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                                    Available Time Slots
                                </h2>
                                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                    Slots update in real-time
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ backgroundColor: "var(--success)" }}
                                />
                                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Live</span>
                            </div>
                        </div>

                        {expert.availability && expert.availability.length > 0 ? (
                            <>
                                <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
                                    {expert.availability.map((a) => {
                                        const availableCount = a.slots.filter((s) => !s.isBooked).length;
                                        return (
                                            <button
                                                key={a.date}
                                                onClick={() => setSelectedDate(a.date)}
                                                className="flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-200 cursor-pointer min-w-[100px]"
                                                style={{
                                                    backgroundColor: selectedDate === a.date ? "var(--accent)" : "var(--bg-secondary)",
                                                    color: selectedDate === a.date ? "var(--accent-text)" : "var(--text-primary)",
                                                    border: selectedDate === a.date ? "none" : "1px solid var(--border-color)",
                                                }}
                                            >
                                                <div className="text-xs font-medium mb-0.5 opacity-80">
                                                    {formatDate(a.date).split(",")[0]}
                                                </div>
                                                <div className="text-sm font-bold">
                                                    {formatDate(a.date).split(" ").slice(0, 2).join(" ")}
                                                </div>
                                                <div className="text-xs mt-1 opacity-70">
                                                    {availableCount} slots
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {selectedSlots.map((slot) => (
                                        <div key={slot.time}>
                                            {slot.isBooked ? (
                                                <div
                                                    className="py-3 px-4 rounded-xl text-center text-sm font-medium line-through opacity-50"
                                                    style={{
                                                        backgroundColor: "var(--bg-secondary)",
                                                        color: "var(--text-muted)",
                                                        border: "1px solid var(--border-color)",
                                                    }}
                                                >
                                                    {slot.time}
                                                    <div className="text-xs mt-0.5 no-underline">Booked</div>
                                                </div>
                                            ) : (
                                                <Link
                                                    to={`/book/${id}?date=${selectedDate}&slot=${slot.time}`}
                                                    className="block py-3 px-4 rounded-xl text-center text-sm font-medium transition-all duration-200"
                                                    style={{
                                                        border: "1px solid var(--border-color)",
                                                        color: "var(--text-primary)",
                                                        backgroundColor: "var(--bg-card)",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "var(--accent)";
                                                        e.currentTarget.style.color = "var(--accent-text)";
                                                        e.currentTarget.style.borderColor = "var(--accent)";
                                                        e.currentTarget.style.transform = "translateY(-2px)";
                                                        e.currentTarget.style.boxShadow = "var(--shadow-md)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "var(--bg-card)";
                                                        e.currentTarget.style.color = "var(--text-primary)";
                                                        e.currentTarget.style.borderColor = "var(--border-color)";
                                                        e.currentTarget.style.transform = "translateY(0)";
                                                        e.currentTarget.style.boxShadow = "none";
                                                    }}
                                                >
                                                    {slot.time}
                                                    <div className="text-xs mt-0.5 flex items-center justify-center gap-1">
                                                        <HiCheckCircle size={12} />
                                                        Available
                                                    </div>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-6 mt-6 pt-6" style={{ borderTop: "1px solid var(--border-color)" }}>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                                        <span className="w-3 h-3 rounded" style={{ border: "1px solid var(--border-color)" }} />
                                        Available
                                    </div>
                                    <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                                        <span className="w-3 h-3 rounded" style={{ backgroundColor: "var(--bg-secondary)" }} />
                                        Booked
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <HiCalendar size={40} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                                <p style={{ color: "var(--text-muted)" }}>No available time slots at this moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
