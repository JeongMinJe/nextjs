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
  let user = await db.user.findUnique({ where: { id: account.id } });
  if (!user) {
    user = await db.user.create({ data: account });
  }
  return user;
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
              if (!credentials?.userId) return null;

              const account = DEMO_ACCOUNTS.find(
                (account) => account.id === credentials.userId
              );
              if (!account) return null;

              const user = await findOrCreateDemoUser(account);
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
              };
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
