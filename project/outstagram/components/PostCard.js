// 개별 게시글을 카드 형태로 보여주는 컴포넌트
// Next.js Image를 사용해서 이미지를 최적화하고 게시글 정보를 표시합니다

import Image from 'next/image'

export default function PostCard({ post }) {
  // 상대 시간 계산 (예: "2시간 전")
  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return new Date(date).toLocaleDateString('ko-KR')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 프로필 헤더 */}
      <div className="flex items-center p-4">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
          <Image
            src={post.author.image || '/default-avatar.png'}
            alt={post.author.name || '사용자'}
            fill
            className="object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold text-gray-900">
            {post.author.name || '익명 사용자'}
          </p>
          <p className="text-xs text-gray-500">
            {getRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      {/* 게시글 이미지 */}
      <div className="relative aspect-square">
        <Image
          src={post.imageUrl}
          alt={post.caption || '게시글 이미지'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      {/* 액션 버튼들 */}
      <div className="p-4">
        <div className="flex items-center space-x-4 mb-3">
          <button className="text-gray-600 hover:text-red-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-blue-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <button className="text-gray-600 hover:text-green-500 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
        </div>

        {/* 좋아요 수 (임시) */}
        <p className="text-sm font-semibold text-gray-900 mb-1">
          좋아요 0개
        </p>

        {/* 캡션 */}
        {post.caption && (
          <p className="text-sm text-gray-900">
            <span className="font-semibold">{post.author.name}</span>{' '}
            {post.caption}
          </p>
        )}

        {/* 댓글 보기 (임시) */}
        <button className="text-sm text-gray-500 mt-2 hover:text-gray-700">
          댓글 0개 모두 보기
        </button>
      </div>
    </div>
  )
}