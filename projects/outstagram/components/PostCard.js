// Enhanced PostCard Component with modern design and animations
"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import Image from 'next/image'
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX 
} from "lucide-react"
import LikeButton from './LikeButton'
import CommentSection from './CommentSection'
import CommentForm from './CommentForm'

export default function PostCard({ post }) {
  const { data: session } = useSession()
  const [showComments, setShowComments] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [imageError, setImageError] = useState(false)

  // 상대 시간 계산 (더 자세하게)
  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)}주 전`
    
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // 현재 사용자가 이 게시글에 좋아요를 눌렀는지 확인
  const isLikedByUser = session ? 
    post.likes.some(like => like.userId === session.user.id) : false

  // 캡션 길이 제한
  const MAX_CAPTION_LENGTH = 150
  const shouldTruncateCaption = post.caption && post.caption.length > MAX_CAPTION_LENGTH
  const displayCaption = shouldTruncateCaption && !showFullCaption 
    ? post.caption.slice(0, MAX_CAPTION_LENGTH) + '...' 
    : post.caption

  return (
    <article className="card animate-fadeIn hover-lift group">
      {/* Post Header */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={post.author.image || '/default-avatar.png'}
              alt={post.author.name || '사용자'}
              width={40}
              height={40}
              className="avatar w-10 h-10"
            />
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
              {post.author.name || '익명 사용자'}
            </h3>
            <p className="text-xs text-gray-500">
              {getRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>
        
        <button className="icon-btn opacity-0 group-hover:opacity-100 transition-all duration-200">
          <MoreHorizontal className="w-5 h-5 text-gray-500" />
        </button>
      </header>

      {/* Post Image */}
      <div className="relative bg-gray-100 aspect-square overflow-hidden">
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="skeleton w-full h-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                <Image className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">이미지를 불러올 수 없습니다</p>
            </div>
          </div>
        ) : (
          <Image
            src={post.imageUrl}
            alt={post.caption || '게시글 이미지'}
            fill
            className={`object-cover transition-all duration-500 ${
              isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Image overlay on hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
      </div>

      {/* Post Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <LikeButton
              postId={post.id}
              initialLikesCount={post.likes.length}
              isLikedByUser={isLikedByUser}
            />
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 group/comment"
            >
              <div className="icon-btn">
                <MessageCircle className="w-6 h-6 text-gray-600 group-hover/comment:text-blue-600 transition-colors" />
              </div>
            </button>
            <button className="icon-btn">
              <Send className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors" />
            </button>
          </div>
          
          <button className="icon-btn">
            <Bookmark className="w-6 h-6 text-gray-600 hover:text-yellow-600 transition-colors" />
          </button>
        </div>

        {/* Likes Count */}
        {post.likes.length > 0 && (
          <div className="mb-3">
            <p className="font-semibold text-gray-900 text-sm">
              좋아요 {post.likes.length.toLocaleString()}개
            </p>
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <div className="mb-3">
            <p className="text-gray-900 text-sm leading-relaxed">
              <span className="font-semibold mr-2">{post.author.name}</span>
              {displayCaption}
              {shouldTruncateCaption && (
                <button
                  onClick={() => setShowFullCaption(!showFullCaption)}
                  className="ml-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showFullCaption ? '접기' : '더 보기'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* Comments Preview */}
        {post.comments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-gray-500 hover:text-gray-700 text-sm mb-3 transition-colors"
          >
            댓글 {post.comments.length}개 모두 보기
          </button>
        )}

        {/* Comments Section */}
        {showComments ? (
          <div className="space-y-4 animate-fadeIn">
            <div className="border-t border-gray-100 pt-4">
              <CommentSection comments={post.comments} />
            </div>
            <CommentForm postId={post.id} />
          </div>
        ) : (
          // Quick comment preview (latest 2 comments)
          post.comments.length > 0 && (
            <div className="space-y-2 mb-3">
              {post.comments.slice(-2).map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Image
                    src={comment.user.image || '/default-avatar.png'}
                    alt={comment.user.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <p className="text-sm text-gray-900 flex-1">
                    <span className="font-semibold mr-1">{comment.user.name}</span>
                    {comment.content.length > 60 
                      ? comment.content.slice(0, 60) + '...' 
                      : comment.content
                    }
                  </p>
                </div>
              ))}
            </div>
          )
        )}

        {/* Quick Comment Form (when comments are hidden) */}
        {!showComments && (
          <CommentForm postId={post.id} compact />
        )}
      </div>
    </article>
  )
}