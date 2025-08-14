// NextAuth SessionProvider를 위한 클라이언트 컴포넌트
// 전체 앱에서 useSession 훅을 사용할 수 있게 해줍니다

"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  )
}