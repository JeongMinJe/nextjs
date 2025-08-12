// 홈페이지 - 실제 게시글 피드를 보여줍니다
// 로그인한 사용자만 피드를 볼 수 있고, 미로그인 시 환영 메시지를 표시합니다

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"
import PostList from "@/components/PostList"
import Link from "next/link"

// 로딩 스켈레톤 컴포넌트
function PostListSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 animate-pulse">
          <div className="flex items-center p-4">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="ml-3 space-y-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // 미로그인 사용자에게 보여줄 화면
  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📸 MyGram에 오신 걸 환영합니다!
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            친구들과 순간을 공유하고 소통해보세요
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              로그인하기
            </Link>
          </div>
        </div>

        {/* 서비스 소개 */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📷</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">사진 공유</h3>
            <p className="text-gray-600">멋진 순간들을 사진으로 기록하고 공유하세요</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">❤️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">소통</h3>
            <p className="text-gray-600">좋아요와 댓글로 친구들과 소통해보세요</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">팔로우</h3>
            <p className="text-gray-600">관심 있는 사람들을 팔로우하고 소식을 받아보세요</p>
          </div>
        </div>
      </div>
    )
  }

  // 로그인한 사용자에게 보여줄 피드
  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </div>
  )
}