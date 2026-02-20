const Expert = require("../models/Expert");

const getExperts = async (req, res) => {
    try {
        const { page = 1, limit = 8, category, search } = req.query;
        const filter = {};

        if (category && category !== "all") {
            filter.category = category;
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Expert.countDocuments(filter);
        const experts = await Expert.find(filter)
            .select("-availability")
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ rating: -1 });

        res.json({
            experts,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch experts", error: error.message });
    }
};

const getExpertById = async (req, res) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({ message: "Expert not found" });
        }
        res.json(expert);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch expert", error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Expert.distinct("category");
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error: error.message });
    }
};

module.exports = { getExperts, getExpertById, getCategories };
