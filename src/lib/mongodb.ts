import mongoose, { Mongoose } from 'mongoose';
import { env } from 'process';

declare global {
    var mongoose: {
conn: Mongoose | null,
promise: Promise<Mongoose> | null;
    };
};

let cached = global.mongoose;

if (!cached){
    cached = global.mongoose = { conn: null, promise: null};
};

async function dbConnect(): Promise<Mongoose>{
    if (cached.conn){
        console.log('using cached mongodb connection');
        return cached.conn;
    }

    if (!cached.promise){
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI){
            throw new Error('please define the MONGODB_URI environment variable inside .env.local');
        }

        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try{
        cached.conn = await cached.promise;
        console.log("new MongoDB connection established");
        return cached.conn;
    } catch (e){
        cached.promise = null;
        console.error("MongoDB connection error", e);
        throw e;
    }
}

export default dbConnect;
