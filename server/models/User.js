const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        phone: { type: String, trim: true, default: "" },
    },
    { timestamps: true }
);

// `unique: true` on the `email` field already creates the index.
// Removed explicit duplicate index to avoid Mongoose duplicate index warnings.

module.exports = mongoose.model("User", userSchema);
