import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// POST /api/ai/title - AI 제목 생성
export async function POST(request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const defaultMessage =
      "당신을 일기 제목을 정해야 합니다. 사용자의 일기내용을 전달할 테니, 핵심적인 내용을 추려 일기 제목을 작성하고 1개 보내주시기 바랍니다. 다음은 일기의 내용입니다.";

    const result = await model.generateContent([defaultMessage, content]);

    const diaryTitleFromAI = result.response.text();

    return NextResponse.json({ title: diaryTitleFromAI });
  } catch (error) {
    console.error("Error getting diary title from Gemini:", error);
    return NextResponse.json({ error: "Failed to get title" }, { status: 500 });
  }
}
