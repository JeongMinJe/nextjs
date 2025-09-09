// lib/auth.js
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { DEMO_ACCOUNTS } from "@/lib/demo-accounts";

// 환경 변수로 데모 모드 확인 (함수 내부에서 확인)
function getIsDemoMode() {
  const isDemo = process.env.DEMO_MODE === "true";
  console.log("🔍 DEMO_MODE 환경변수:", process.env.DEMO_MODE);
  console.log("🔍 isDemoMode:", isDemo);
  return isDemo;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),

  providers: [
    // 데모 모드일 때만 Credentials Provider 활성화
    ...(getIsDemoMode()
      ? [
          Credentials({
            id: "demo",
            name: "Demo",
            credentials: {
              userId: { label: "User ID", type: "text" },
            },
            async authorize(credentials) {
              if (credentials?.userId) {
                const account = DEMO_ACCOUNTS.find(
                  (account) => account.id === credentials.userId
                );
                if (account) {
                  return {
                    id: account.id,
                    name: account.name,
                    email: account.email,
                    image: account.image,
                  };
                }
              }
              return null;
            },
          }),
        ]
      : []),

    // GitHub Provider (로컬에서만 활성화)
    ...(getIsDemoMode()
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
    signIn: getIsDemoMode() ? "/demo-login" : "/login",
  },
});
