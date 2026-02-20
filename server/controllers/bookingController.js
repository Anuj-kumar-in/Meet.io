const Booking = require("../models/Booking");
const Expert = require("../models/Expert");
const mongoose = require("mongoose");

const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { expertId, userPhone, date, timeSlot, notes } = req.body;

        // If user authenticated, prefer user info from token
        const userName = req.user ? req.user.name : req.body.userName;
        const userEmail = req.user ? req.user.email : (req.body.userEmail || "");

        const expert = await Expert.findById(expertId).session(session);
        if (!expert) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Expert not found" });
        }

        const dateAvailability = expert.availability.find((a) => a.date === date);
        if (!dateAvailability) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Selected date is not available" });
        }

        const slot = dateAvailability.slots.find((s) => s.time === timeSlot);
        if (!slot) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Selected time slot does not exist" });
        }

        if (slot.isBooked) {
            await session.abortTransaction();
            return res.status(409).json({ message: "This time slot is already booked" });
        }

        slot.isBooked = true;
        await expert.save({ session });

        const booking = new Booking({
            expert: expertId,
            userName,
            userEmail: userEmail.toLowerCase(),
            userPhone: userPhone || (req.user ? req.user.phone : ""),
            date,
            timeSlot,
            notes,
        });

        await booking.save({ session });
        await session.commitTransaction();

        const populatedBooking = await Booking.findById(booking._id).populate(
            "expert",
            "name category avatar title"
        );

        const io = req.app.get("io");
        if (io) {
            io.to(`expert_${expertId}`).emit("slot_booked", {
                expertId,
                date,
                timeSlot,
                booking: populatedBooking,
            });
        }

        res.status(201).json({ message: "Booking created successfully", booking: populatedBooking });
    } catch (error) {
        await session.abortTransaction();
        if (error.code === 11000) {
            return res.status(409).json({ message: "This time slot is already booked" });
        }
        res.status(500).json({ message: "Failed to create booking", error: error.message });
    } finally {
        session.endSession();
    }
};

const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate("expert", "name category avatar title");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (status === "cancelled") {
            const expert = await Expert.findById(booking.expert._id);
            if (expert) {
                const dateAvail = expert.availability.find((a) => a.date === booking.date);
                if (dateAvail) {
                    const slot = dateAvail.slots.find((s) => s.time === booking.timeSlot);
                    if (slot) {
                        slot.isBooked = false;
                        await expert.save();

                        const io = req.app.get("io");
                        if (io) {
                            io.to(`expert_${booking.expert._id}`).emit("slot_freed", {
                                expertId: booking.expert._id.toString(),
                                date: booking.date,
                                timeSlot: booking.timeSlot,
                            });
                        }
                    }
                }
            }
        }

        res.json({ message: "Booking status updated", booking });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking", error: error.message });
    }
};

const getBookingsByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        // If authenticated, ensure requested email matches token email
        if (req.user) {
            if (email && email.toLowerCase() !== req.user.email) {
                return res.status(403).json({ message: "Forbidden: cannot request other user's bookings" });
            }
        }

        if (!email && !req.user) {
            return res.status(400).json({ message: "Email is required" });
        }

        const searchEmail = (email || (req.user && req.user.email) || "").toLowerCase();

        const bookings = await Booking.find({ userEmail: searchEmail })
            .populate("expert", "name category avatar title hourlyRate")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
};

module.exports = { createBooking, updateBookingStatus, getBookingsByEmail };
