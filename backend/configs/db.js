import mongoose from "mongoose";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () =>
            console.log("MongoDB connected successfully")
        )
        await mongoose.connect(`${process.env.MONGODB_URI}/movie`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

export default connectDB;