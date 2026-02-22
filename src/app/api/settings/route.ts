import { connectDB } from "@/lib/db";
import Settings from "@/model/settings.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { ownerid, businessName, supportEmail, knowledgeBase } = body
        if (!ownerid || !businessName || !supportEmail || !knowledgeBase) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 })
        }
        await connectDB()
        const settings = await Settings.findOneAndUpdate({ ownerid }, { ownerid, businessname: businessName, supportEmail, knowledgebase: knowledgeBase }, { new: true, upsert: true })
        return NextResponse.json({ settings }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}



