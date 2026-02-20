const express = require("express");
const { body } = require("express-validator");
const { createBooking, updateBookingStatus, getBookingsByEmail } = require("../controllers/bookingController");
const validate = require("../middleware/validate");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
    "/",
    auth,
    [
        body("expertId").notEmpty().withMessage("Expert ID is required"),
        body("userPhone")
            .optional()
            .matches(/^[0-9+\-() ]{7,15}$/)
            .withMessage("Valid phone number is required"),
        body("date").notEmpty().withMessage("Date is required"),
        body("timeSlot").notEmpty().withMessage("Time slot is required"),
    ],
    validate,
    createBooking
);

router.patch(
    "/:id/status",
    auth,
    [body("status").notEmpty().withMessage("Status is required")],
    validate,
    updateBookingStatus
);

// Allow public access to GET bookings by email for legacy convenience.
// The controller still restricts access when an authenticated user is present.
router.get("/", getBookingsByEmail);

module.exports = router;
