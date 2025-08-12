// 게시글 작성 페이지
// 로그인한 사용자만 접근 가능하며 새 게시글을 작성할 수 있습니다

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import CreatePostForm from "@/components/CreatePostForm"

export const metadata = {
  title: "새 게시글 작성 - MyGram",
  description: "새로운 순간을 공유해보세요",
}

export default async function CreatePage() {
  // 로그인 확인
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">
            새 게시글 만들기
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            소중한 순간을 친구들과 공유해보세요
          </p>
        </div>

        {/* 작성 폼 */}
        <div className="px-6 py-6">
          <CreatePostForm />
        </div>
      </div>

      {/* 작성 팁 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          💡 게시글 작성 팁
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 고화질 이미지를 사용하면 더 멋진 피드가 됩니다</li>
          <li>• 해시태그(#)를 사용해서 주제를 표시해보세요</li>
          <li>• 솔직하고 진심어린 캡션이 더 많은 공감을 얻습니다</li>
        </ul>
      </div>
    </div>
  )
}