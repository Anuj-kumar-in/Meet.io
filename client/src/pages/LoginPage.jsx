import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [isSignup, setIsSignup] = useState(false);

    const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

    const validate = () => {
        if (!form.email.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Invalid email";
        if (!form.name.trim()) return "Name is required";
        if (!form.password || form.password.length < 6) return "Password must be at least 6 characters";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const err = validate();
        if (err) return toast.error(err);

        try {
            if (isSignup) {
                const res = await axios.post("/api/auth/signup", {
                    name: form.name,
                    email: form.email,
                    password: form.password,
                });
                login({ token: res.data.token, user: res.data.user });
                toast.success("Signed up and logged in");
                navigate("/my-bookings");
            } else {
                const res = await axios.post("/api/auth/login", {
                    email: form.email,
                    password: form.password,
                });
                login({ token: res.data.token, user: res.data.user });
                toast.success("Logged in");
                navigate("/my-bookings");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Authentication failed";
            toast.error(msg);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold mb-4">{isSignup ? "Sign up" : "Sign in"}</h1>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>{isSignup ? "Create an account to manage your bookings." : "Sign in to view your bookings."}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="text-sm font-medium block mb-1">Full name</label>
                    <input value={form.name} onChange={handleChange("name")} className="w-full px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium block mb-1">Email</label>
                    <input value={form.email} onChange={handleChange("email")} type="email" className="w-full px-3 py-2 rounded" />
                </div>
                <div>
                    <label className="text-sm font-medium block mb-1">Password</label>
                    <input value={form.password} onChange={handleChange("password")} type="password" className="w-full px-3 py-2 rounded" />
                </div>
                <div>
                    <button type="submit" className="w-full py-2 rounded" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>{isSignup ? "Create account" : "Sign in"}</button>
                </div>
            </form>
            <div className="text-sm mt-4">
                {isSignup ? (
                    <span>Already have an account? <button className="font-medium underline" onClick={() => setIsSignup(false)}>Sign in</button></span>
                ) : (
                    <span>Don't have an account? <button className="font-medium underline" onClick={() => setIsSignup(true)}>Sign up</button></span>
                )}
            </div>
        </div>
    );
}
