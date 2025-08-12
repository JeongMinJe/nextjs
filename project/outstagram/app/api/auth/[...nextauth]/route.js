// NextAuth API 라우트 핸들러
// /api/auth/* 경로로 오는 모든 인증 요청을 처리합니다

import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }