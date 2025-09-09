// app/profile/page.js (팔로우 기능 추가 버전)
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getUserFollowStatus } from "@/actions/follow";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import {
  User,
  Calendar,
  Mail,
  Edit3,
  Grid3X3,
  Settings,
  Users,
  UserCheck,
  MapPin,
  Heart,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // 사용자 정보 및 게시글 조회
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        orderBy: { createdAt: "desc" },
        take: 12, // 최신 12개만 표시
        include: {
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          posts: true,
          likes: true,
          comments: true,
        },
      },
    },
  });

  // 팔로우 상태 정보 가져오기
  const followStatus = await getUserFollowStatus(session.user.id);

  const joinDate = new Date(user.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        {/* 프로필 헤더 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="relative">
            {/* 커버 배경 */}
            <div className="h-40 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

            {/* 프로필 정보 */}
            <div className="relative px-6 pb-6">
              {/* 프로필 이미지 */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                <div className="relative -mt-20 mb-4 sm:mb-0">
                  <img
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || "사용자"}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {user?.name || "이름 없음"}
                      </h1>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{joinDate}에 가입</span>
                        </div>
                        {user?.bio && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>소개글 있음</span>
                          </div>
                        )}
                      </div>

                      {user?.bio && (
                        <p className="text-gray-700 max-w-2xl leading-relaxed">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* 프로필 편집 버튼 */}
                    <button className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors">
                      <Edit3 className="w-4 h-4" />
                      <span>프로필 편집</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 통계 */}
              <div className="grid grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user._count.posts}
                  </div>
                  <div className="text-sm text-gray-600">게시글</div>
                </div>

                <Link
                  href={`/profile/${user.id}/followers`}
                  className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {followStatus.followersCount}
                  </div>
                  <div className="text-sm text-gray-600">팔로워</div>
                </Link>

                <Link
                  href={`/profile/${user.id}/following`}
                  className="text-center hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="text-2xl font-bold text-gray-900">
                    {followStatus.followingCount}
                  </div>
                  <div className="text-sm text-gray-600">팔로잉</div>
                </Link>

                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user._count.likes}
                  </div>
                  <div className="text-sm text-gray-600">받은 좋아요</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 게시글 그리드 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Grid3X3 className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  내 게시글
                </h2>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {user.posts.length}
                </span>
              </div>

              {user.posts.length > 0 && (
                <Link
                  href={`/profile/${user.id}/posts`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  모두 보기
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {user.posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Grid3X3 className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  아직 게시글이 없습니다
                </h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                  첫 번째 게시글을 올려서 프로필을 꾸며보세요!
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span>첫 게시글 작성하기</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="relative aspect-square group cursor-pointer"
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.caption || "게시글 이미지"}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center space-x-6 text-white">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-6 h-6" />
                          <span className="font-semibold text-lg">
                            {post._count.likes}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-6 h-6" />
                          <span className="font-semibold text-lg">
                            {post._count.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
