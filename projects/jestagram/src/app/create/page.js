import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Camera, Image, Sparkles } from "lucide-react";

export default async function CreatePage() {
  // 로그인 확인
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            새로운 순간을 공유하세요
          </h1>
          <p className="text-gray-600">
            멋진 사진과 함께 특별한 이야기를 들려주세요
          </p>
        </div>

        {/* 메인 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  새 게시글 만들기
                </h2>
                <p className="text-sm text-gray-600">
                  {session.user.name}님의 새로운 이야기
                </p>
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="p-6">
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                곧 구현될 예정입니다!
              </h3>
              <p className="text-gray-500 mb-6">
                이미지 업로드와 게시글 작성 기능이 추가될 예정입니다
              </p>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">5단계에서 만날 수 있어요!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
