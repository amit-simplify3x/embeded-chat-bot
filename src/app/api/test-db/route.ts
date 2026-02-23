import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ status: "Connected to MongoDB" });
    } catch (error) {
        console.error("Database connection failed:", error);
        return NextResponse.json({ status: "Failed to connect", error: error instanceof Error ? error.message : "Database Error" }, { status: 500 });
    }
}
