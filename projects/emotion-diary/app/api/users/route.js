import { NextResponse } from "next/server";
import { db } from "../../lib/firebase-admin";

// GET /api/users - 사용자 정보 조회
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

    const extractedUserData = userQuery.docs[0].data();

    return NextResponse.json(extractedUserData);
  } catch (error) {
    console.error("Error getting user data:", error);
    return NextResponse.json(
      { error: "Failed to get user information" },
      { status: 500 }
    );
  }
}
