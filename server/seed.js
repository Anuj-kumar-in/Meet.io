require("dotenv").config();
const mongoose = require("mongoose");
const Expert = require("./models/Expert");
const connectDB = require("./config/db");

const generateSlots = () => {
    const slots = [];
    const times = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
        "16:00", "16:30", "17:00", "17:30",
    ];
    times.forEach((time) => {
        slots.push({ time, isBooked: false });
    });
    return slots;
};

const generateAvailability = () => {
    const availability = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
            availability.push({
                date: date.toISOString().split("T")[0],
                slots: generateSlots(),
            });
        }
    }
    return availability;
};

const experts = [
    {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah",
        category: "Technology",
        title: "Senior Software Architect",
        bio: "15+ years building scalable distributed systems at Fortune 500 companies. Specialized in cloud-native architecture and microservices design patterns.",
        experience: 15,
        rating: 4.9,
        totalReviews: 234,
        hourlyRate: 150,
        skills: ["System Design", "Cloud Architecture", "Microservices", "Kubernetes", "AWS"],
    },
    {
        name: "James Rodriguez",
        email: "james.rodriguez@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=James",
        category: "Business",
        title: "Business Strategy Consultant",
        bio: "Former McKinsey consultant with deep expertise in market entry strategies, business model innovation, and organizational transformation.",
        experience: 12,
        rating: 4.8,
        totalReviews: 189,
        hourlyRate: 200,
        skills: ["Market Analysis", "Strategic Planning", "M&A", "Business Development", "Go-to-Market"],
    },
    {
        name: "Emily Chen",
        email: "emily.chen@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily",
        category: "Design",
        title: "Principal UX Designer",
        bio: "Led design teams at Google and Airbnb. Expert in design systems, user research methodologies, and creating world-class digital experiences.",
        experience: 10,
        rating: 4.7,
        totalReviews: 156,
        hourlyRate: 130,
        skills: ["UX Research", "Design Systems", "Figma", "Prototyping", "Interaction Design"],
    },
    {
        name: "Michael Thompson",
        email: "michael.thompson@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael",
        category: "Finance",
        title: "Financial Planning Expert",
        bio: "Certified Financial Planner with expertise in corporate finance, investment strategies, and wealth management for high-net-worth individuals.",
        experience: 18,
        rating: 4.9,
        totalReviews: 312,
        hourlyRate: 175,
        skills: ["Financial Planning", "Investment Strategy", "Tax Planning", "Risk Management", "Portfolio Management"],
    },
    {
        name: "Lisa Wang",
        email: "lisa.wang@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Lisa",
        category: "Technology",
        title: "AI/ML Engineering Lead",
        bio: "PhD in Computer Science from Stanford. Building production ML systems for the past 8 years. Expert in NLP, computer vision, and MLOps.",
        experience: 8,
        rating: 4.8,
        totalReviews: 145,
        hourlyRate: 180,
        skills: ["Machine Learning", "Deep Learning", "NLP", "Python", "TensorFlow"],
    },
    {
        name: "David Park",
        email: "david.park@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=David",
        category: "Marketing",
        title: "Growth Marketing Strategist",
        bio: "Scaled multiple startups from 0 to 10M users. Expert in performance marketing, SEO, content strategy, and data-driven growth frameworks.",
        experience: 9,
        rating: 4.6,
        totalReviews: 198,
        hourlyRate: 120,
        skills: ["Growth Hacking", "SEO", "Content Marketing", "Analytics", "Paid Acquisition"],
    },
    {
        name: "Rachel Adams",
        email: "rachel.adams@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rachel",
        category: "Business",
        title: "Executive Leadership Coach",
        bio: "ICF-certified executive coach. Helped 200+ C-level executives unlock their leadership potential and navigate organizational challenges.",
        experience: 14,
        rating: 4.9,
        totalReviews: 267,
        hourlyRate: 250,
        skills: ["Executive Coaching", "Leadership Development", "Team Building", "Conflict Resolution", "Change Management"],
    },
    {
        name: "Alex Kim",
        email: "alex.kim@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Alex",
        category: "Technology",
        title: "Cybersecurity Architect",
        bio: "Former NSA security analyst. CISSP and OSCP certified. Specializing in zero-trust architecture, penetration testing, and incident response.",
        experience: 11,
        rating: 4.7,
        totalReviews: 134,
        hourlyRate: 160,
        skills: ["Cybersecurity", "Penetration Testing", "Zero Trust", "SIEM", "Cloud Security"],
    },
    {
        name: "Priya Sharma",
        email: "priya.sharma@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya",
        category: "Design",
        title: "Brand Identity Designer",
        bio: "Award-winning brand designer who has created visual identities for 100+ companies including three unicorn startups.",
        experience: 7,
        rating: 4.5,
        totalReviews: 112,
        hourlyRate: 110,
        skills: ["Brand Design", "Visual Identity", "Typography", "Illustration", "Creative Direction"],
    },
    {
        name: "Robert Wilson",
        email: "robert.wilson@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Robert",
        category: "Legal",
        title: "Corporate Legal Advisor",
        bio: "20 years of experience in corporate law, specializing in startup legal structuring, IP protection, and regulatory compliance.",
        experience: 20,
        rating: 4.8,
        totalReviews: 178,
        hourlyRate: 300,
        skills: ["Corporate Law", "IP Protection", "Contracts", "Compliance", "Startup Legal"],
    },
    {
        name: "Nina Patel",
        email: "nina.patel@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Nina",
        category: "Marketing",
        title: "Social Media Strategist",
        bio: "Built and managed social media strategies for top DTC brands. Generated 500M+ organic impressions across platforms.",
        experience: 6,
        rating: 4.4,
        totalReviews: 98,
        hourlyRate: 95,
        skills: ["Social Media", "Content Creation", "Influencer Marketing", "Community Building", "Brand Strategy"],
    },
    {
        name: "Thomas Baker",
        email: "thomas.baker@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Thomas",
        category: "Finance",
        title: "Venture Capital Advisor",
        bio: "General Partner at a $500M VC fund. Invested in 40+ startups across SaaS, fintech, and healthcare. Expert in fundraising and cap table strategy.",
        experience: 16,
        rating: 4.9,
        totalReviews: 203,
        hourlyRate: 350,
        skills: ["Venture Capital", "Fundraising", "Due Diligence", "Cap Table", "Startup Finance"],
    },
    {
        name: "Amanda Liu",
        email: "amanda.liu@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Amanda",
        category: "Technology",
        title: "DevOps Engineering Lead",
        bio: "Infrastructure and DevOps expert with experience at Netflix and Amazon. Specialized in CI/CD pipelines, IaC, and platform engineering.",
        experience: 9,
        rating: 4.6,
        totalReviews: 127,
        hourlyRate: 140,
        skills: ["DevOps", "CI/CD", "Terraform", "Docker", "Kubernetes"],
    },
    {
        name: "Daniel Foster",
        email: "daniel.foster@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Daniel",
        category: "Legal",
        title: "Employment Law Specialist",
        bio: "Focused on employment and labor law for tech companies. Expert in remote work policies, equity compensation, and workplace compliance.",
        experience: 13,
        rating: 4.7,
        totalReviews: 154,
        hourlyRate: 220,
        skills: ["Employment Law", "Labor Relations", "Equity Compensation", "HR Compliance", "Remote Work Policy"],
    },
    {
        name: "Sophie Martin",
        email: "sophie.martin@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sophie",
        category: "Design",
        title: "Product Design Director",
        bio: "Led product design at Spotify and Stripe. Passionate about creating intuitive, accessible, and beautiful digital products at scale.",
        experience: 11,
        rating: 4.8,
        totalReviews: 189,
        hourlyRate: 170,
        skills: ["Product Design", "Design Leadership", "Accessibility", "Mobile Design", "Design Ops"],
    },
    {
        name: "Kevin Brown",
        email: "kevin.brown@meetio.com",
        avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Kevin",
        category: "Business",
        title: "Product Management Expert",
        bio: "VP of Product at a Series D startup. 12 years building and shipping products that users love. Expert in product-led growth and OKRs.",
        experience: 12,
        rating: 4.7,
        totalReviews: 167,
        hourlyRate: 160,
        skills: ["Product Management", "Roadmap Planning", "User Stories", "Agile", "Product Analytics"],
    },
];

const seedDB = async () => {
    await connectDB();

    try {
        await Expert.deleteMany({});
        console.log("Cleared existing experts");

        const expertsWithAvailability = experts.map((expert) => ({
            ...expert,
            availability: generateAvailability(),
        }));

        await Expert.insertMany(expertsWithAvailability);
        console.log(`Seeded ${experts.length} experts`);

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedDB();
