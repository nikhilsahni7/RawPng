/* eslint-disable no-var */
import mongoose from "mongoose";

// Define interface for mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend global type
declare global {
  var mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
}

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nikhilsahni321:rajni.surender@cluster1.dhdvprj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1&dbName=pinglydb";
console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached: MongooseCache = (global.mongoose as MongooseCache) || {
  conn: null,
  promise: null,
};

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (process.env.NEXT_PHASE === "build") {
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("DB connected");
  } catch (error) {
    console.error("Failed to connect to DB:", error);
    throw error;
  }
}
