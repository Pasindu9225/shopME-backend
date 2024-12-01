import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongodbUrl = process.env.MONGODB_URL;

    await mongoose.connect(mongodbUrl);

    console.log("Database connected....");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};
