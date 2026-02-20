const connectDB = require("../config/db");
const Booking = require("../models/Booking");

(async () => {
    try {
        await connectDB();
        const bookings = await Booking.find().limit(50).populate("expert", "name email");
        console.log(`Found ${bookings.length} bookings`);
        bookings.forEach((b) => {
            console.log(`- ${b._id} | ${b.userEmail} | ${b.date} ${b.timeSlot} | ${b.expert ? b.expert.name : 'no-expert'}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
