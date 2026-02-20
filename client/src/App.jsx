import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ExpertsPage from "./pages/ExpertsPage.jsx";
import ExpertDetailPage from "./pages/ExpertDetailPage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
                <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "var(--bg-card)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border-color)",
                        fontFamily: "var(--font-sans)",
                    },
                }}
            />
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/experts" element={<ExpertsPage />} />
                    <Route path="/experts/:id" element={<ExpertDetailPage />} />
                    <Route path="/book/:id" element={<BookingPage />} />
                    <Route path="/my-bookings" element={<MyBookingsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>
            <Footer />
            </div>
        </AuthProvider>
    );
}
