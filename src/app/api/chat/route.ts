import { connectDB } from "@/lib/db"
import Settings from "@/model/settings.model"
import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function POST(req: NextRequest) {
    await connectDB()
    try {
        const { message, ownerid } = await req.json()
        if (!ownerid || !message) {
            return Response.json({ error: "Owner ID and message are required" }, { status: 400 })
        }
        const settings = await Settings.findOne({ ownerid })
        if (!settings) {
            return Response.json({ error: "chat bot is not found" }, { status: 404 })
        }
        const KNOWLEDGE = `
        Business Name: ${settings.businessname}
        Support Email: ${settings.supportEmail}
        Knowledge Base: ${settings.knowledgebase}
        `

        const prompt = `
You are a professional customer support assistant for this business.

Use ONLY the information provided below to answer the customer's question.
You may rephrase, summarize, or interpret the information if needed.
Do NOT invent new policies, prices, or promises.

If the customer's question is completely unrelated to the information,
or cannot be reasonably answered from it, reply exactly with:
        "Please contact support."

        ----------------------
            BUSINESS INFORMATION
        ----------------------
            ${KNOWLEDGE}

        ----------------------
            CUSTOMER QUESTION
        ----------------------
            ${message}
        ---------------------
        ANSWER
        ---------------------
  `

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return NextResponse.json({ message: responseText }, { headers: corsHeaders })
    } catch (error) {
        console.error("Chat API Error:", error)
        return NextResponse.json({
            error: "Internal Server Error",
            details: error instanceof Error ? error.message : "No error message available"
        }, { status: 500, headers: corsHeaders })
    }
}

export async function GET() {
    return NextResponse.json({ error: "Method Not Allowed. Please use POST." }, { status: 405, headers: corsHeaders })
}

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}