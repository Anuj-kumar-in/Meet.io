const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;

        try {
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
            console.log(`MongoDB connected: ${mongoose.connection.host}`);
            return;
        } catch {
            console.log("Local MongoDB not available, starting in-memory server...");
        }

        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log(`MongoDB Memory Server running at ${uri}`);

        process.on("SIGINT", async () => {
            await mongod.stop();
            process.exit(0);
        });
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
