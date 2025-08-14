// Enhanced HomePage with better welcome screen and loading states
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Suspense } from "react"
import PostList from "@/components/PostList"
import Link from "next/link"
import { Camera, Heart, Users, Sparkles, ArrowRight, Github } from "lucide-react"

// Enhanced loading skeleton
function PostListSkeleton() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {[1, 2, 3].map((index) => (
        <article key={index} className="card">
          {/* Header skeleton */}
          <div className="flex items-center p-4">
            <div className="skeleton w-10 h-10 rounded-full"></div>
            <div className="ml-3 space-y-2">
              <div className="skeleton h-4 w-24 rounded"></div>
              <div className="skeleton h-3 w-16 rounded"></div>
            </div>
          </div>
          
          {/* Image skeleton */}
          <div className="aspect-square skeleton"></div>
          
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="flex items-center space-x-4">
              <div className="skeleton w-6 h-6 rounded"></div>
              <div className="skeleton w-6 h-6 rounded"></div>
              <div className="skeleton w-6 h-6 rounded"></div>
            </div>
            <div className="skeleton h-4 w-20 rounded"></div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

// Feature card component
function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div className="group card p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// Stats component
function StatsSection() {
  const stats = [
    { label: "활성 사용자", value: "1K+", icon: Users },
    { label: "공유된 순간", value: "10K+", icon: Camera },
    { label: "좋아요", value: "50K+", icon: Heart },
    { label: "새로운 연결", value: "매일", icon: Sparkles },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {stats.map((stat, index) => (
        <div key={index} className="text-center p-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mb-2">
            <stat.icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-gray-900">{stat.value}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // 미로그인 사용자에게 보여줄 랜딩 페이지
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
            {/* Main Hero */}
            <div className="mb-12 animate-fadeIn">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 animate-bounceIn">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="gradient-text">MyGram</span>에 
                <br />
                오신 걸 환영합니다!
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                친구들과 소중한 순간을 공유하고, 새로운 사람들과 연결되며, 
                일상의 아름다운 이야기들을 함께 만들어가세요.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link
                  href="/login"
                  className="group flex items-center space-x-2 btn-primary px-8 py-4 text-lg shadow-lg hover:shadow-xl"
                >
                  <Github className="w-5 h-5" />
                  <span>GitHub로 시작하기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-sm text-gray-500">
                  무료로 시작하세요 • 몇 초만에 가입 완료
                </p>
              </div>
            </div>

            {/* Stats */}
            <StatsSection />
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                왜 MyGram을 선택해야 할까요?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                간단하고 직관적인 인터페이스로 누구나 쉽게 사용할 수 있으며, 
                강력한 기능들로 더 풍부한 소셜 경험을 제공합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Camera}
                title="사진 공유"
                description="고화질 이미지로 멋진 순간들을 기록하고 친구들과 공유하세요. 드래그 앤 드롭으로 간편하게 업로드할 수 있습니다."
                color="bg-gradient-to-r from-pink-500 to-rose-500"
              />
              <FeatureCard
                icon={Heart}
                title="실시간 소통"
                description="좋아요와 댓글로 친구들과 실시간으로 소통하고, 서로의 일상에 관심을 표현해보세요."
                color="bg-gradient-to-r from-red-500 to-pink-500"
              />
              <FeatureCard
                icon={Users}
                title="커뮤니티"
                description="관심사가 비슷한 사람들을 팔로우하고, 새로운 친구들과 연결되어 더 넓은 세상을 경험하세요."
                color="bg-gradient-to-r from-blue-500 to-purple-500"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              몇 초만에 가입하고 친구들과 함께 특별한 순간들을 공유해보세요.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <Github className="w-5 h-5" />
              <span>무료로 가입하기</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8">
          <div className="max-w-4xl mx-auto text-center px-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Camera className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">MyGram</span>
            </div>
            <p className="text-gray-400 text-sm">
              Next.js와 Prisma로 만든 현대적인 소셜 플랫폼
            </p>
          </div>
        </footer>
      </div>
    )
  }

  // 로그인한 사용자에게 보여줄 피드
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-8">
        {/* Welcome back message */}
        <div className="card p-6 mb-8 animate-fadeIn">
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
              <p className="text-gray-600">오늘은 어떤 특별한 순간을 공유해볼까요?</p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <Link href="/create" className="btn-primary flex-1 text-center">
              새 게시글 작성하기
            </Link>
          </div>
        </div>

        {/* Posts Feed */}
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </div>
  )
}