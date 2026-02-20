require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const expertRoutes = require("./routes/expertRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST", "PATCH"],
    },
});

app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/experts", expertRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join_expert_room", (expertId) => {
        socket.join(`expert_${expertId}`);
    });

    socket.on("leave_expert_room", (expertId) => {
        socket.leave(`expert_${expertId}`);
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

const autoSeed = async () => {
    const Expert = require("./models/Expert");
    const count = await Expert.countDocuments();
    if (count === 0) {
        console.log("No experts found, auto-seeding...");

        const generateSlots = () => {
            const times = [
                "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
                "16:00", "16:30", "17:00", "17:30",
            ];
            return times.map((time) => ({ time, isBooked: false }));
        };

        const generateAvailability = () => {
            const availability = [];
            const today = new Date();
            for (let i = 1; i <= 14; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                    availability.push({ date: date.toISOString().split("T")[0], slots: generateSlots() });
                }
            }
            return availability;
        };

        const experts = [
            { name: "Sarah Mitchell", email: "sarah.mitchell@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah", category: "Technology", title: "Senior Software Architect", bio: "15+ years building scalable distributed systems at Fortune 500 companies.", experience: 15, rating: 4.9, totalReviews: 234, hourlyRate: 150, skills: ["System Design", "Cloud Architecture", "Microservices", "Kubernetes", "AWS"] },
            { name: "James Rodriguez", email: "james.rodriguez@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James", category: "Business", title: "Business Strategy Consultant", bio: "Former McKinsey consultant with deep expertise in market entry strategies.", experience: 12, rating: 4.8, totalReviews: 189, hourlyRate: 200, skills: ["Market Analysis", "Strategic Planning", "M&A", "Business Development"] },
            { name: "Emily Chen", email: "emily.chen@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily", category: "Design", title: "Principal UX Designer", bio: "Led design teams at Google and Airbnb.", experience: 10, rating: 4.7, totalReviews: 156, hourlyRate: 130, skills: ["UX Research", "Design Systems", "Figma", "Prototyping"] },
            { name: "Michael Thompson", email: "michael.thompson@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael", category: "Finance", title: "Financial Planning Expert", bio: "Certified Financial Planner with expertise in corporate finance.", experience: 18, rating: 4.9, totalReviews: 312, hourlyRate: 175, skills: ["Financial Planning", "Investment Strategy", "Tax Planning", "Risk Management"] },
            { name: "Lisa Wang", email: "lisa.wang@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lisa", category: "Technology", title: "AI/ML Engineering Lead", bio: "PhD from Stanford. Building production ML systems for 8 years.", experience: 8, rating: 4.8, totalReviews: 145, hourlyRate: 180, skills: ["Machine Learning", "Deep Learning", "NLP", "Python"] },
            { name: "David Park", email: "david.park@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David", category: "Marketing", title: "Growth Marketing Strategist", bio: "Scaled multiple startups from 0 to 10M users.", experience: 9, rating: 4.6, totalReviews: 198, hourlyRate: 120, skills: ["Growth Hacking", "SEO", "Content Marketing", "Analytics"] },
            { name: "Rachel Adams", email: "rachel.adams@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rachel", category: "Business", title: "Executive Leadership Coach", bio: "ICF-certified executive coach. Helped 200+ C-level executives.", experience: 14, rating: 4.9, totalReviews: 267, hourlyRate: 250, skills: ["Executive Coaching", "Leadership Development", "Team Building"] },
            { name: "Alex Kim", email: "alex.kim@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex", category: "Technology", title: "Cybersecurity Architect", bio: "Former NSA security analyst. CISSP and OSCP certified.", experience: 11, rating: 4.7, totalReviews: 134, hourlyRate: 160, skills: ["Cybersecurity", "Penetration Testing", "Zero Trust", "Cloud Security"] },
            { name: "Priya Sharma", email: "priya.sharma@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya", category: "Design", title: "Brand Identity Designer", bio: "Award-winning brand designer for 100+ companies.", experience: 7, rating: 4.5, totalReviews: 112, hourlyRate: 110, skills: ["Brand Design", "Visual Identity", "Typography", "Illustration"] },
            { name: "Robert Wilson", email: "robert.wilson@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Robert", category: "Legal", title: "Corporate Legal Advisor", bio: "20 years in corporate law, specializing in startup legal structuring.", experience: 20, rating: 4.8, totalReviews: 178, hourlyRate: 300, skills: ["Corporate Law", "IP Protection", "Contracts", "Compliance"] },
            { name: "Nina Patel", email: "nina.patel@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nina", category: "Marketing", title: "Social Media Strategist", bio: "Built social strategies for top DTC brands. 500M+ organic impressions.", experience: 6, rating: 4.4, totalReviews: 98, hourlyRate: 95, skills: ["Social Media", "Content Creation", "Influencer Marketing"] },
            { name: "Thomas Baker", email: "thomas.baker@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Thomas", category: "Finance", title: "Venture Capital Advisor", bio: "General Partner at a $500M VC fund. Invested in 40+ startups.", experience: 16, rating: 4.9, totalReviews: 203, hourlyRate: 350, skills: ["Venture Capital", "Fundraising", "Due Diligence", "Startup Finance"] },
            { name: "Amanda Liu", email: "amanda.liu@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amanda", category: "Technology", title: "DevOps Engineering Lead", bio: "Infrastructure expert at Netflix and Amazon.", experience: 9, rating: 4.6, totalReviews: 127, hourlyRate: 140, skills: ["DevOps", "CI/CD", "Terraform", "Docker", "Kubernetes"] },
            { name: "Daniel Foster", email: "daniel.foster@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Daniel", category: "Legal", title: "Employment Law Specialist", bio: "Employment and labor law for tech companies.", experience: 13, rating: 4.7, totalReviews: 154, hourlyRate: 220, skills: ["Employment Law", "Labor Relations", "Equity Compensation"] },
            { name: "Sophie Martin", email: "sophie.martin@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sophie", category: "Design", title: "Product Design Director", bio: "Led product design at Spotify and Stripe.", experience: 11, rating: 4.8, totalReviews: 189, hourlyRate: 170, skills: ["Product Design", "Design Leadership", "Accessibility", "Mobile Design"] },
            { name: "Kevin Brown", email: "kevin.brown@meetio.com", avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kevin", category: "Business", title: "Product Management Expert", bio: "VP of Product at a Series D startup. 12 years shipping products.", experience: 12, rating: 4.7, totalReviews: 167, hourlyRate: 160, skills: ["Product Management", "Roadmap Planning", "User Stories", "Agile"] },
        ];

        const data = experts.map((e) => ({ ...e, availability: generateAvailability() }));
        await Expert.insertMany(data);
        console.log(`Seeded ${data.length} experts`);
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
    await autoSeed();
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
