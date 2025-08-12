// 전체 앱에 적용되는 최상위 레이아웃 파일 (업데이트)
// NextAuth SessionProvider와 로그인 상태에 따른 헤더를 추가합니다

import { Inter } from 'next/font/google'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import SessionProvider from "@/components/SessionProvider"
import Header from "@/components/Header"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '나만의 인스타그램',
  description: 'Next.js로 만든 SNS 플랫폼',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-2xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}