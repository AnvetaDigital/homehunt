import mongoose from "mongoose";

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI as string;
    // console.log("MONGODB_URI:", process.env.MONGODB_URI);

    if(!uri){
      throw new Error("MONGODB_URI is not defined in .env");
    }
    
    await mongoose.connect(uri);
    console.log("MongoDB connected!");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

connectDB();
