// app/api/groq/route.ts
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "",
});

interface ChatRequest {
  message: string;
}

export async function POST(req: Request) {
  try {
    const { message }: ChatRequest = await req.json();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message.trim() || "Just tell my client that they failed to send message in VNese",
        },
      ],
      // model: "llama-3.1-8b-instant",
      model: "gemma2-9b-it",
    });
    const content = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}