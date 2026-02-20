const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
    time: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
});

const availabilitySchema = new mongoose.Schema({
    date: { type: String, required: true },
    slots: [timeSlotSchema],
});

const expertSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true },
        avatar: { type: String, default: "" },
        category: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        bio: { type: String, default: "" },
        experience: { type: Number, required: true, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalReviews: { type: Number, default: 0 },
        hourlyRate: { type: Number, required: true, min: 0 },
        skills: [{ type: String, trim: true }],
        availability: [availabilitySchema],
    },
    { timestamps: true }
);

expertSchema.index({ name: "text", category: "text" });
expertSchema.index({ category: 1 });

module.exports = mongoose.model("Expert", expertSchema);
