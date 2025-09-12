// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import admin from "firebase-admin";
import serviceAccountData from "./emotion-diary-firebase-adminsdk.json" with { type: "json" };

let serviceAccount;

try {
  // process.env.NODE_ENV가 'production'일 경우, 즉 Vercel에서 배포될 때
  if (process.env.NODE_ENV === "production") {
    // Vercel 대시보드에 환경 변수로 저장된 JSON 문자열을 파싱
    if (!process.env.FIREBASE_ADMIN_CONFIG) {
      throw new Error("FIREBASE_ADMIN_CONFIG 환경 변수가 설정되지 않았습니다.");
    }
    serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CONFIG);
  } else {
    // 로컬 개발 환경일 경우
    serviceAccount = serviceAccountData;
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  
  console.log("Firebase Admin SDK가 성공적으로 초기화되었습니다.");
} catch (error) {
  console.error("Firebase Admin SDK 초기화 실패:", error.message);
  process.exit(1);
}

// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = admin.firestore();
