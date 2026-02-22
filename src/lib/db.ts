import mongoose from "mongoose"

const mongo_Url = process.env.MONGODB_URL

if (!mongo_Url) {
    throw new Error("Please provide MONGODB_URL in the environment variables")
}

let cache = global.mongoose

if (!cache) {
    cache = global.mongoose = {
        promise: null,
        conn: null
    }
}

export const connectDB = async () => {
    if (cache.conn) {
        return cache.conn
    }
    if (!cache.promise) {
        cache.promise = mongoose.connect(mongo_Url).then((mongoose) => {
            console.log("Connected to MongoDB")
            return mongoose
        })
    }
    try {

        cache.conn = await cache.promise
        return cache.conn
    } catch (error) {
        console.log("Error connecting to MongoDB", error)
        throw error
    }
}