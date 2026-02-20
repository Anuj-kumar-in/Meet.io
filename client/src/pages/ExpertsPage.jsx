import { useState, useEffect } from "react";
import axios from "axios";
import ExpertCard from "../components/ExpertCard.jsx";
import { HiSearch, HiFilter, HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function ExpertsPage() {
    const [experts, setExperts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });
    const [searchDebounce, setSearchDebounce] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setSearchDebounce(search), 300);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        axios
            .get("/api/experts/categories")
            .then((res) => setCategories(res.data))
            .catch(() => { });
    }, []);

    useEffect(() => {
        setPage(1);
    }, [searchDebounce, category]);

    useEffect(() => {
        const fetchExperts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = { page, limit: 8 };
                if (category !== "all") params.category = category;
                if (searchDebounce) params.search = searchDebounce;
                const res = await axios.get("/api/experts", { params });
                setExperts(res.data.experts);
                setPagination(res.data.pagination);
            } catch (err) {
                setError("Failed to load experts. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, [page, searchDebounce, category]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                    Browse Experts
                </h1>
                <p style={{ color: "var(--text-muted)" }}>
                    Find and book sessions with top professionals
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <HiSearch
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        size={18}
                        style={{ color: "var(--text-muted)" }}
                    />
                    <input
                        type="text"
                        placeholder="Search experts by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                            backgroundColor: "var(--bg-input)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
                    />
                </div>

                <div className="relative">
                    <HiFilter
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                        size={18}
                        style={{ color: "var(--text-muted)" }}
                    />
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="pl-11 pr-8 py-3 rounded-xl text-sm appearance-none cursor-pointer min-w-[180px]"
                        style={{
                            backgroundColor: "var(--bg-input)",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-primary)",
                        }}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl p-6 animate-pulse"
                            style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                        >
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl" style={{ backgroundColor: "var(--border-color)" }} />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: "var(--border-color)" }} />
                                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: "var(--border-color)" }} />
                                </div>
                            </div>
                            <div className="h-6 rounded w-1/3 mb-4" style={{ backgroundColor: "var(--border-color)" }} />
                            <div className="h-4 rounded w-full" style={{ backgroundColor: "var(--border-color)" }} />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        ⚠️
                    </div>
                    <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        Something went wrong
                    </p>
                    <p className="mb-6" style={{ color: "var(--text-muted)" }}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2.5 rounded-lg text-sm font-medium cursor-pointer"
                        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
                    >
                        Try Again
                    </button>
                </div>
            ) : experts.length === 0 ? (
                <div className="text-center py-20">
                    <div
                        className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        🔍
                    </div>
                    <p className="text-lg font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                        No experts found
                    </p>
                    <p style={{ color: "var(--text-muted)" }}>Try adjusting your search or filter criteria.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {experts.map((expert) => (
                            <ExpertCard key={expert._id} expert={expert} />
                        ))}
                    </div>

                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2.5 rounded-lg transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                            >
                                <HiChevronLeft size={18} />
                            </button>

                            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className="w-10 h-10 rounded-lg text-sm font-medium transition-all cursor-pointer"
                                    style={{
                                        backgroundColor: p === page ? "var(--accent)" : "transparent",
                                        color: p === page ? "var(--accent-text)" : "var(--text-secondary)",
                                        border: p === page ? "none" : "1px solid var(--border-color)",
                                    }}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                disabled={page === pagination.pages}
                                className="p-2.5 rounded-lg transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                                style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                            >
                                <HiChevronRight size={18} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
