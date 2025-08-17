import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Camera, Heart, Users, Sparkles } from "lucide-react";

export default async function HomePage() {
  // 서버에서 현재 로그인 상태 확인
  const session = await getServerSession(authOptions);

  // 로그인하지 않은 사용자에게 보여줄 페이지
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          {/* 메인 헤로 */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-pulse">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyGram
              </span>
              에 오신 걸 환영합니다!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              친구들과 소중한 순간을 공유하고, 새로운 사람들과 연결되며, 일상의
              아름다운 이야기들을 함께 만들어가세요.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <span>GitHub로 시작하기</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>

          {/* 기능 소개 */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mb-4">
                <Camera className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">사진 공유</h3>
              <p className="text-gray-600">
                멋진 순간들을 기록하고 친구들과 공유하세요
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">실시간 소통</h3>
              <p className="text-gray-600">
                좋아요와 댓글로 친구들과 소통하세요
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">새로운 연결</h3>
              <p className="text-gray-600">
                관심사가 비슷한 사람들과 연결되세요
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            무료로 시작하세요 • 몇 초만에 가입 완료
          </p>
        </div>
      </div>
    );
  }

  // 로그인한 사용자에게 보여줄 페이지
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* 환영 메시지 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                안녕하세요, {session.user.name}님! 👋
              </h1>
              <p className="text-gray-600">MyGram에 오신 것을 환영합니다!</p>
            </div>
          </div>

          {/* 로그아웃 버튼 (임시) */}
          <div className="mt-4 flex space-x-3">
            <Link
              href="/api/auth/signout"
              className="text-red-600 hover:text-red-700 text-sm transition-colors"
            >
              로그아웃
            </Link>
          </div>
        </div>

        <div className="text-center py-12">
          <p className="text-gray-500">
            곧 게시글 작성 기능이 추가될 예정입니다! 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
