import { Link } from "react-router-dom";
import { HiStar, HiBriefcase, HiClock } from "react-icons/hi";

export default function ExpertCard({ expert }) {
    return (
        <Link
            to={`/experts/${expert._id}`}
            className="group block rounded-2xl overflow-hidden transition-all duration-300"
            style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                e.currentTarget.style.borderColor = "var(--border-color)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                    <div
                        className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: "var(--bg-secondary)" }}
                    >
                        {expert.avatar ? (
                            <img src={expert.avatar} alt={expert.name} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl font-bold" style={{ color: "var(--text-muted)" }}>
                                {expert.name.charAt(0)}
                            </span>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate" style={{ color: "var(--text-primary)" }}>
                            {expert.name}
                        </h3>
                        <p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>
                            {expert.title}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                        style={{ backgroundColor: "var(--badge-bg)", color: "var(--badge-text)" }}
                    >
                        {expert.category}
                    </span>
                </div>

                <div className="flex items-center gap-4 text-sm" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1">
                        <HiStar className="text-yellow-500" size={14} />
                        <span className="font-medium" style={{ color: "var(--text-primary)" }}>{expert.rating}</span>
                        <span>({expert.totalReviews})</span>
                    </span>
                    <span className="flex items-center gap-1">
                        <HiBriefcase size={14} />
                        {expert.experience}y
                    </span>
                    <span className="flex items-center gap-1">
                        <HiClock size={14} />
                        ${expert.hourlyRate}/hr
                    </span>
                </div>

                {expert.skills && expert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                        {expert.skills.slice(0, 3).map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-muted)" }}
                            >
                                {skill}
                            </span>
                        ))}
                        {expert.skills.length > 3 && (
                            <span className="px-2 py-0.5 rounded text-xs" style={{ color: "var(--text-muted)" }}>
                                +{expert.skills.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div
                className="px-6 py-3 text-center text-sm font-medium transition-all duration-200"
                style={{
                    borderTop: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                }}
            >
                <span className="group-hover:tracking-wider transition-all duration-200">View Profile →</span>
            </div>
        </Link>
    );
}
