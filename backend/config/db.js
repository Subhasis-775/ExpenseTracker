import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL not found in environment variables");
        }

        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");
    } catch (error) {
        console.error(`Error in connecting MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
