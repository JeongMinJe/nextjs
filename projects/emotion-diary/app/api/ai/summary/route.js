import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/ai/summary - AI 요약 생성
export async function POST(request) {
  try {
    const { chatHistory } = await request.json();

    if (!chatHistory || chatHistory.length === 0) {
      return NextResponse.json(
        { error: "Chat history is required" },
        { status: 400 }
      );
    }

    const formattedChatHistory = chatHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const prompt = `
  당신은 대화 내용을 분석하여 핵심을 요약하는 AI입니다. 아래에 'user'와 'assistant' 간의 대화 기록이 제공됩니다. 이 대화의 전체적인 분위기와 사용자가 표현한 핵심 감정을 중심으로, 대화 내용을 두세 문장의 짧은 일기 형식으로 요약해주세요.
  ---
  **대화 기록:**
  ${formattedChatHistory}
`;

    const result = await model.generateContent(prompt);
    const diarySummaryFromAI = result.response.text();

    return NextResponse.json({ summary: diarySummaryFromAI });
  } catch (error) {
    console.error("Error getting diary summary from Gemini:", error);
    return NextResponse.json(
      { error: "Failed to get summary" },
      { status: 500 }
    );
  }
}
