import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { HiArrowLeft, HiCheck, HiCalendar, HiClock, HiUser, HiMail, HiPhone } from "react-icons/hi";

export default function BookingPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const date = searchParams.get("date") || "";
    const slot = searchParams.get("slot") || "";

    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [bookedBooking, setBookedBooking] = useState(null);

    const [form, setForm] = useState({
        userName: "",
        userEmail: "",
        userPhone: "",
        notes: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        axios
            .get(`/api/experts/${id}`)
            .then((res) => setExpert(res.data))
            .catch(() => toast.error("Failed to load expert"))
            .finally(() => setLoading(false));
    }, [id]);

    const validate = () => {
        const errs = {};
        if (!form.userName.trim()) errs.userName = "Name is required";
        if (!form.userEmail.trim()) errs.userEmail = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) errs.userEmail = "Invalid email format";
        if (!form.userPhone.trim()) errs.userPhone = "Phone is required";
        else if (!/^[0-9+\-() ]{7,15}$/.test(form.userPhone)) errs.userPhone = "Invalid phone number";
        if (!date) errs.date = "Date is required";
        if (!slot) errs.slot = "Time slot is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        try {
            const res = await axios.post("/api/bookings", {
                expertId: id,
                userName: form.userName,
                userEmail: form.userEmail,
                userPhone: form.userPhone,
                date,
                timeSlot: slot,
                notes: form.notes,
            });
            setSuccess(true);
            setBookedBooking(res.data.booking);
            toast.success("Session booked successfully!");
        } catch (err) {
            const msg = err.response?.data?.message || "Failed to create booking";
            toast.error(msg);
            if (err.response?.status === 409) {
                setTimeout(() => navigate(`/experts/${id}`), 2000);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr + "T00:00:00");
        return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
                <div className="h-6 w-32 rounded mb-8" style={{ backgroundColor: "var(--border-color)" }} />
                <div className="h-96 rounded-2xl" style={{ backgroundColor: "var(--bg-secondary)" }} />
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div
                    className="rounded-2xl p-12 text-center"
                    style={{
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        boxShadow: "var(--shadow-md)",
                    }}
                >
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                    >
                        <HiCheck size={40} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                        Session Booked!
                    </h2>
                    <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                        Your session with {expert?.name} has been confirmed.
                    </p>

                    {bookedBooking && (
                        <div
                            className="rounded-xl p-6 mb-8 text-left"
                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                        >
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Expert</p>
                                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{expert?.name}</p>
                                </div>
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Category</p>
                                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{expert?.category}</p>
                                </div>
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Date</p>
                                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{formatDate(date)}</p>
                                </div>
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Time</p>
                                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>{slot}</p>
                                </div>
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Status</p>
                                    <span
                                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                                        style={{ backgroundColor: "rgba(245,158,11,0.15)", color: "var(--status-pending)" }}
                                    >
                                        Pending
                                    </span>
                                </div>
                                <div>
                                    <p style={{ color: "var(--text-muted)" }}>Rate</p>
                                    <p className="font-medium" style={{ color: "var(--text-primary)" }}>${expert?.hourlyRate}/hr</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/my-bookings"
                            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                        >
                            View My Bookings
                        </Link>
                        <Link
                            to="/experts"
                            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                            style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                        >
                            Browse More Experts
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link
                to={`/experts/${id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
                <HiArrowLeft size={16} />
                Back to Expert
            </Link>

            <div
                className="rounded-2xl overflow-hidden"
                style={{
                    backgroundColor: "var(--bg-card)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-md)",
                }}
            >
                <div className="p-6 flex items-center gap-4" style={{ borderBottom: "1px solid var(--border-color)" }}>
                    <div
                        className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        {expert?.avatar ? (
                            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold" style={{ color: "var(--text-muted)" }}>
                                {expert?.name?.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>
                            Book Session with {expert?.name}
                        </h2>
                        <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                            <span className="flex items-center gap-1">
                                <HiCalendar size={14} />
                                {formatDate(date)}
                            </span>
                            <span className="flex items-center gap-1">
                                <HiClock size={14} />
                                {slot}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                            <HiUser size={16} style={{ color: "var(--text-muted)" }} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={form.userName}
                            onChange={handleChange("userName")}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 rounded-xl text-sm"
                            style={{
                                backgroundColor: "var(--bg-input)",
                                border: `1px solid ${errors.userName ? "var(--error)" : "var(--border-color)"}`,
                                color: "var(--text-primary)",
                            }}
                        />
                        {errors.userName && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.userName}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                            <HiMail size={16} style={{ color: "var(--text-muted)" }} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={form.userEmail}
                            onChange={handleChange("userEmail")}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl text-sm"
                            style={{
                                backgroundColor: "var(--bg-input)",
                                border: `1px solid ${errors.userEmail ? "var(--error)" : "var(--border-color)"}`,
                                color: "var(--text-primary)",
                            }}
                        />
                        {errors.userEmail && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.userEmail}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                            <HiPhone size={16} style={{ color: "var(--text-muted)" }} />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={form.userPhone}
                            onChange={handleChange("userPhone")}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 rounded-xl text-sm"
                            style={{
                                backgroundColor: "var(--bg-input)",
                                border: `1px solid ${errors.userPhone ? "var(--error)" : "var(--border-color)"}`,
                                color: "var(--text-primary)",
                            }}
                        />
                        {errors.userPhone && <p className="text-xs mt-1" style={{ color: "var(--error)" }}>{errors.userPhone}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-primary)" }}>
                            Notes (Optional)
                        </label>
                        <textarea
                            value={form.notes}
                            onChange={handleChange("notes")}
                            placeholder="Any specific topics you'd like to discuss..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl text-sm resize-none"
                            style={{
                                backgroundColor: "var(--bg-input)",
                                border: "1px solid var(--border-color)",
                                color: "var(--text-primary)",
                            }}
                        />
                    </div>

                    <div
                        className="rounded-xl p-4 flex items-center justify-between"
                        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                    >
                        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Session Rate</span>
                        <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                            ${expert?.hourlyRate}/hr
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                        onMouseEnter={(e) => {
                            if (!submitting) {
                                e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "var(--accent)";
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {submitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Booking...
                            </span>
                        ) : (
                            "Confirm Booking"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
