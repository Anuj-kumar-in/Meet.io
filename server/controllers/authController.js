const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ message: "Email already registered" });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new User({ name, email: email.toLowerCase(), password: hash, phone });
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "devsecret", {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });

        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: "Signup failed", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "devsecret", {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
        res.status(500).json({ message: "Login failed", error: error.message });
    }
};

module.exports = { signup, login };
