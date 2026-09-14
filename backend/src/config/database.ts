import mongoose from "mongoose";

const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in .env file");
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected successfully");
};

export default connectDatabase;