const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        expert: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Expert",
            required: true,
        },
        userName: { type: String, required: true, trim: true },
        userEmail: { type: String, required: true, trim: true },
        userPhone: { type: String, required: true, trim: true },
        date: { type: String, required: true },
        timeSlot: { type: String, required: true },
        notes: { type: String, default: "", trim: true },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

bookingSchema.index(
    { expert: 1, date: 1, timeSlot: 1 },
    { unique: true, partialFilterExpression: { status: { $ne: "cancelled" } } }
);
bookingSchema.index({ userEmail: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
