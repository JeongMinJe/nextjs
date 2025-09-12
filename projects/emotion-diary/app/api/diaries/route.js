import { NextResponse } from "next/server";
import { db } from "../../lib/firebase-admin";
import admin from "firebase-admin";

// GET /api/diaries - 일기 목록 조회
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const userRef = db.collection("users");
    const userQuery = await userRef.where("email", "==", email).limit(1).get();

    if (userQuery.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

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

    // 3초 지연 (기존 서버와 동일하게)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json(processedDiaries);
  } catch (error) {
    console.error("Error getting diaries:", error);
    return NextResponse.json(
      { error: "Failed to get diaries" },
      { status: 500 }
    );
  }
}

// POST /api/diaries - 일기 저장
export async function POST(request) {
  try {
    const body = await request.json();

    const diaryToBeSaved = {
      ...body,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("diaries").add(diaryToBeSaved);

    return NextResponse.json(
      { message: "Diary saved successfully", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving diary:", error);
    return NextResponse.json(
      { error: "Failed to save diary" },
      { status: 500 }
    );
  }
}
