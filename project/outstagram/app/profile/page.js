// Enhanced Profile Page with better design
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import ProfileForm from "@/components/ProfileForm"
import { 
  User, 
  Calendar, 
  Mail, 
  Edit3, 
  Grid3X3, 
  Heart, 
  MessageCircle,
  Settings 
} from "lucide-react"

export default async function ProfilePage() {
  // 서버에서 세션 확인
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/login")
  }

  // 데이터베이스에서 사용자 정보와 게시글 조회
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      posts: {
        include: {
          likes: true,
          comments: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      _count: {
        select: {
          posts: true,
          likes: true,
          comments: true,
        }
      }
    }
  })

  // 통계 계산
  const totalLikes = user.posts.reduce((sum, post) => sum + post.likes.length, 0)
  const joinDate = new Date(user.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8">
        {/* Profile Header */}
        <div className="card mb-8 animate-fadeIn">
          <div className="relative">
            {/* Cover background */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl"></div>
            
            {/* Profile info */}
            <div className="relative px-6 pb-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6">
                <div className="relative -mt-16 mb-4 sm:mb-0">
                  <img
                    src={user?.image || "/default-avatar.png"}
                    alt={user?.name || "사용자"}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"></div>
                </div>

                {/* User info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {user?.name || "이름 없음"}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{joinDate}에 가입</span>
                        </div>
                      </div>
                      {user?.bio && (
                        <p className="text-gray-700 max-w-2xl leading-relaxed">
                          {user.bio}
                        </p>
                      )}
                    </div>
                    
                    {/* Action button */}
                    <button className="btn-secondary flex items-center space-x-2 mt-4 sm:mt-0">
                      <Edit3 className="w-4 h-4" />
                      <span>프로필 편집</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user._count.posts.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">게시글</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {totalLikes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">받은 좋아요</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {user._count.comments.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">작성한 댓글</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Edit Form */}
          <div className="lg:col-span-1">
            <div className="card animate-slideInFromRight">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    프로필 설정
                  </h2>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  프로필 정보를 수정할 수 있습니다
                </p>
              </div>
              <div className="p-6">
                <ProfileForm user={user} />
              </div>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="lg:col-span-2">
            <div className="card animate-slideInFromRight" style={{animationDelay: '0.1s'}}>
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
                </div>
              </div>

              <div className="p-6">
                {user.posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Grid3X3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      아직 게시글이 없습니다
                    </h3>
                    <p className="text-gray-600 mb-4">
                      첫 번째 게시글을 올려서 프로필을 꾸며보세요!
                    </p>
                    <a href="/create" className="btn-primary">
                      첫 게시글 작성하기
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {user.posts.map((post, index) => (
                      <div 
                        key={post.id} 
                        className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover-lift animate-scaleIn"
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.caption || '게시글 이미지'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="flex items-center space-x-4 text-white">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-5 h-5 fill-current" />
                              <span className="font-medium">{post.likes.length}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-5 h-5 fill-current" />
                              <span className="font-medium">{post.comments.length}</span>
                            </div>
                          </div>
                        </div>

                        {/* Caption preview on hover */}
                        {post.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-white text-sm line-clamp-2">
                              {post.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}