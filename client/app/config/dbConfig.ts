import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI",MONGO_URI)

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

/** * Global is used here to maintain a cached connection across hot-reloads in development.
 * This prevents connections from growing exponentially during API calls.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Add our cache to the Node.js global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
      console.log("Database connected successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Database connection failed");
    throw e;
  }

  return cached.conn;
}

export default connectDB;