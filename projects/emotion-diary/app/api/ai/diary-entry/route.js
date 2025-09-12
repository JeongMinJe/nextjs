import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/ai/diary-entry - AI 일기 생성
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
      당신은 텍스트를 분석하고 제목과 요약을 생성하는 AI입니다. 아래에 제공된 대화 기록을 바탕으로 다음 두 가지 작업을 순서대로 수행해주세요.

      1. 대화 내용 전체를 2~3장으로 요약하세요.
      2. 그 요약된 내용을 바탕으로 가장 적절한 제목을 하나 만드세요.

      결과는 반드시 아래와 같은 JSON 형식으로만 응답해주세요. 다른 설명은 붙이지 마세요.
      {
        "summary": "여기에 요약 내용",
        "title": "여기에 제목"
      }

      ---
      **대화 기록:**
      ${formattedChatHistory}
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json\n?|```/g, "");

    const responseObject = JSON.parse(responseText);

    return NextResponse.json(responseObject);
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Failed to process chat" },
      { status: 500 }
    );
  }
}
