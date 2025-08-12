// 게시글 목록을 보여주는 서버 컴포넌트
// 데이터베이스에서 게시글들을 가져와서 PostCard로 렌더링합니다

import { db } from '@/lib/db'
import PostCard from './PostCard'

export default async function PostList() {
  try {
    // 게시글과 작성자 정보를 함께 조회 (최신순)
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (posts.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            아직 게시글이 없습니다
          </h3>
          <p className="text-gray-600">
            첫 번째 게시글을 올려서 피드를 시작해보세요!
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    )
  } catch (error) {
    console.error('게시글 조회 오류:', error)
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-center">
          게시글을 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    )
  }
}