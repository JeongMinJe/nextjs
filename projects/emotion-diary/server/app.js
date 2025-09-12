import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import admin from "firebase-admin";
import { db } from "./firebase.js"; // Firestore DB 인스턴스 import
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 환경 변수 로드 (로컬 개발 시에만)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 4000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

app.get("/api/diaries", async (req, res) => {
  try {
    const { email } = req.query;

    const userRef = db.collection("users");
    const userQuery = await userRef.where("email", "==", email).limit(1).get();

    // 사용자 못 찾을 경우에 대한 결과도 추가해야 할 듯...

    // 사용자 찾은 경우부터 고고
    const userDocId = userQuery.docs[0].id;

    const diariesRef = db.collection("diaries");
    const diariesQuery = await diariesRef
      .where("user_doc_id", "==", userDocId)
      .orderBy("created_at", "desc")
      .get();

    const processedDiaries = diariesQuery.docs.map((doc) => {
      const data = doc.data();
      return {
        diary_doc_id: doc.id,
        user_doc_id: userDocId,
        title: data.title,
        content: data.content,
        created_at: data.created_at.toDate().toLocaleString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    });

    setTimeout(() => {
      res.status(200).json(processedDiaries);
    }, 3000);
  } catch (error) {
    console.error("Error  diary:", error);
    res.status(500).json({ error: "Failed to get diaries" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const { email } = req.query;

    const userRef = db.collection("users");
    const userQuery = await userRef.where("email", "==", email).limit(1).get();

    const extractedUserData = userQuery.docs[0].data();

    res.status(200).json(extractedUserData);
  } catch (error) {
    res.status(500).json({ error: "failed to get user information." });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    /** 
     * 이렇게 messages 받을 거임.
     * [
      { role: 'user', content: '안녕?' },
      { role: 'assistant', content: '응, 반가워.' },
      { role: 'user', content: '오늘 날씨 어때?' }
        ]
     */
    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);

    const response = result.response;
    const text = response.text();

    res.json({ reply: { role: "assistant", content: text } });
  } catch (error) {
    console.error("Error while communication with Gemini:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

app.post("/api/ai/title", async (req, res) => {
  try {
    const { content } = req.body;

    const defaultMessage =
      "당신을 일기 제목을 정해야 합니다. 사용자의 일기내용을 전달할 테니, 핵심적인 내용을 추려 일기 제목을 작성하고 1개 보내주시기 바랍니다. 다음은 일기의 내용입니다.";

    const result = await model.generateContent([defaultMessage, content]);

    const diaryTitleFromAI = result.response.text();

    res.status(200).json({ title: diaryTitleFromAI });
  } catch (error) {
    console.error("Error getting diary title from Gemini:", error);
    res.status(500).json({ error: "Failed to get title" });
  }
});

app.post("/api/ai/summary", async (req, res) => {
  try {
    const { chatHistory } = req.body;

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

    res.status(200).json({ summary: diarySummaryFromAI });
  } catch (error) {
    console.error("Error getting diary summary from Gemini:", error);
    res.status(500).json({ error: "Failed to get summary" });
  }
});

app.post("/api/ai/diary-entry", async (req, res) => {
  try {
    const { chatHistory } = req.body;

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

    res.status(200).json(responseObject);
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
});

app.post("/api/diaries", async (req, res) => {
  try {
    const diaryTobeSaved = {
      ...req.body,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("diaries").add(diaryTobeSaved);

    res
      .status(201)
      .json({ message: "Diary saved successfully", id: docRef.id });
  } catch (error) {
    console.error("Error saving diary:", error);
    res.status(500).json({ error: "Failed to save diary" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
