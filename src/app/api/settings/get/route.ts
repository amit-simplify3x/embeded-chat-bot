import { connectDB } from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const ownerid = req.nextUrl.searchParams.get("ownerid")
        if (!ownerid) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 })
        }
        await connectDB()
        const settings = await Settings.findOne({ ownerid })
        return NextResponse.json({ settings }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 })
    }
}