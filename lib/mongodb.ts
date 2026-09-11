import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri: string | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
  uri: null,
};

global.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cached.conn && cached.uri === uri && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.promise && cached.uri === uri) {
    return cached.promise;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  cached.conn = null;
  cached.promise = mongoose
    .connect(uri)
    .then((connection) => {
      cached.conn = connection;
      return connection;
    })
    .catch((error) => {
      cached.conn = null;
      cached.promise = null;
      cached.uri = null;
      throw error;
    });
  cached.uri = uri;

  return cached.promise;
}