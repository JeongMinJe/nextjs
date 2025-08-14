// Enhanced CommentSection Component with better interactions
"use client"

import { useTransition, useState } from "react"
import { useSession } from "next-auth/react"
import { deleteComment } from "@/actions/comments"
import { MoreHorizontal, Trash2, Heart, Reply } from "lucide-react"

export default function CommentSection({ comments }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [showDropdown, setShowDropdown] = useState(null)
  const [expandedComments, setExpandedComments] = useState(new Set())

  const getRelativeTime = (date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000)
    
    if (diffInSeconds < 60) return '방금 전'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`
    
    return new Date(date).toLocaleDateString('ko-KR')
  }

  const handleDeleteComment = (commentId) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return
    }

    startTransition(async () => {
      try {
        const result = await deleteComment(commentId)
        
        if (result.error) {
          alert("댓글 삭제에 실패했습니다: " + result.error)
        }
      } catch (error) {
        console.error("댓글 삭제 오류:", error)
        alert("댓글 삭제 중 오류가 발생했습니다")
      }
    })
  }

  const toggleCommentExpansion = (commentId) => {
    const newExpanded = new Set(expandedComments)
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId)
    } else {
      newExpanded.add(commentId)
    }
    setExpandedComments(newExpanded)
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium mb-1">아직 댓글이 없습니다</p>
        <p className="text-sm text-gray-400">첫 번째 댓글을 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => {
        const isExpanded = expandedComments.has(comment.id)
        const shouldTruncate = comment.content.length > 150
        const displayContent = shouldTruncate && !isExpanded 
          ? comment.content.slice(0, 150) + '...'
          : comment.content

        return (
          <div key={comment.id} className="group animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex space-x-3">
              <img
                src={comment.user.image || '/default-avatar.png'}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full flex-shrink-0 avatar"
              />
              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 rounded-2xl px-4 py-3 hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                          {comment.user.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {getRelativeTime(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed break-words">
                        {displayContent}
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleCommentExpansion(comment.id)}
                            className="ml-1 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                          >
                            {isExpanded ? '접기' : '더 보기'}
                          </button>
                        )}
                      </p>
                    </div>
                    
                    {/* Comment actions */}
                    {session?.user.id === comment.userId && (
                      <div className="relative ml-2">
                        <button
                          onClick={() => setShowDropdown(showDropdown === comment.id ? null : comment.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all duration-200"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        {/* Dropdown menu */}
                        {showDropdown === comment.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px] animate-scaleIn">
                            <button
                              onClick={() => {
                                handleDeleteComment(comment.id)
                                setShowDropdown(null)
                              }}
                              disabled={isPending}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>삭제</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Comment actions (like, reply) */}
                <div className="flex items-center space-x-4 mt-2 ml-4">
                  <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                    <Heart className="w-3 h-3" />
                    <span>좋아요</span>
                  </button>
                  <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-500 transition-colors">
                    <Reply className="w-3 h-3" />
                    <span>답글</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      
      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  )
}