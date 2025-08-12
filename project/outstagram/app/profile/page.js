// 프로필 페이지 컴포넌트
// 로그인한 사용자의 정보를 보여주고 수정할 수 있습니다

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import ProfileForm from "@/components/ProfileForm"

export default async function ProfilePage() {
  // 서버에서 세션 확인
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // 데이터베이스에서 사용자 정보 조회
  const user = await db.user.findUnique({
    where: { id: session.user.id }
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 프로필 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={user?.image || "/default-avatar.png"}
              alt={user?.name || "사용자"}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name || "이름 없음"}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.bio && (
                <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* 프로필 수정 폼 */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            프로필 수정
          </h2>
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  )
}