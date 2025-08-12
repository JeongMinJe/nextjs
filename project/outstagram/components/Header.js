// 헤더 컴포넌트 (업데이트) - 게시글 작성 링크 추가
// 로그인 상태에 따른 네비게이션과 작성 버튼을 제공합니다

"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            📸 MyGram
          </Link>

          <nav className="flex items-center space-x-6">
            {status === "loading" ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <>
                <Link 
                  href="/" 
                  className={`text-gray-600 hover:text-gray-900 transition-colors ${
                    pathname === "/" ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  홈
                </Link>
                
                <Link 
                  href="/create" 
                  className={`text-gray-600 hover:text-gray-900 transition-colors ${
                    pathname === "/create" ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  작성
                </Link>
                
                <Link 
                  href="/profile" 
                  className={`text-gray-600 hover:text-gray-900 transition-colors ${
                    pathname === "/profile" ? "text-gray-900 font-medium" : ""
                  }`}
                >
                  프로필
                </Link>

                <div className="flex items-center space-x-3">
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <button
                    onClick={() => signOut()}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                로그인
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}