import { Camera, Heart, Home, User } from "lucide-react";

export default function HomePage() {
  // ← Home → HomePage로 변경
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center space-x-4 mb-6">
          <Camera className="w-8 h-8 text-blue-600" />
          <Heart className="w-8 h-8 text-red-500" />
          <Home className="w-8 h-8 text-green-600" />
          <User className="w-8 h-8 text-purple-600" />
        </div>

        <h1 className="text-4xl font-bold text-blue-600 mb-4">📸 MyGram</h1>
        <p className="text-gray-600 text-lg">인스타그램 클론 코딩 프로젝트</p>
        <p className="text-sm text-green-600 mt-4">
          ✅ 1단계 완료! 아이콘도 정상 작동합니다.
        </p>
      </div>
    </div>
  );
}
