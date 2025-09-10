// lib/auth.js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { DEMO_ACCOUNTS } from "../../prisma/seed/demo-accounts";

// 환경 변수로 데모 모드 확인
const isDemo = process.env.DEMO_MODE === "true" || process.env.VERCEL;

// 데모 사용자 찾기 또는 생성
async function findOrCreateDemoUser(account) {
  try {
    let user = await db.user.findUnique({ where: { id: account.id } });
    if (!user) {
      console.log("🔍 사용자 생성 중:", account.id);
      user = await db.user.create({ data: account });
      console.log("✅ 사용자 생성 완료:", user.id);
    } else {
      console.log("🔍 기존 사용자 발견:", user.id);
    }
    return user;
  } catch (error) {
    console.error("❌ 사용자 생성/조회 오류:", error);
    throw error;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    // 데모 모드일 때만 Credentials Provider 활성화
    ...(isDemo
      ? [
          Credentials({
            id: "demo",
            name: "Demo",
            credentials: {
              userId: { label: "User ID", type: "text" },
            },
            async authorize(credentials) {
              console.log("🔍 authorize 호출됨:", credentials);

              if (!credentials?.userId) {
                console.log("❌ userId 없음");
                return null;
              }

              const account = DEMO_ACCOUNTS.find(
                (account) => account.id === credentials.userId
              );
              if (!account) {
                console.log("❌ 계정을 찾을 수 없음:", credentials.userId);
                return null;
              }

              console.log("🔍 계정 발견:", account.name);

              try {
                const user = await findOrCreateDemoUser(account);
                console.log("✅ 사용자 반환:", user.id);
                return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  image: user.image,
                };
              } catch (error) {
                console.error("❌ authorize 오류:", error);
                return null;
              }
            },
          }),
        ]
      : []),

    // GitHub Provider (로컬에서만 활성화)
    ...(isDemo
      ? []
      : [
          GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]),
  ],

  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },

  pages: {
    // 데모 모드일 때만 데모 로그인 페이지 사용
    signIn: isDemo ? "/demo-login" : "/login",
  },
});
