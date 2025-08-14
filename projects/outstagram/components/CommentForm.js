// Enhanced CommentForm Component with better UX
"use client"

import { useRef, useTransition, useState } from "react"
import { useSession } from "next-auth/react"
import { Send, Smile } from "lucide-react"
import { createComment } from "@/actions/comments"

export default function CommentForm({ postId, compact = false }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [comment, setComment] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  if (!session) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 mb-3">
          댓글을 작성하려면 로그인해주세요
        </p>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
          로그인하기
        </button>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const content = comment.trim()
    if (!content) {
      inputRef.current?.focus()
      return
    }

    if (content.length > 1000) {
      alert("댓글은 1000자 이하여야 합니다")
      return
    }

    startTransition(async () => {
      try {
        const result = await createComment({ postId, content })
        
        if (result.success) {
          setComment("")
          setIsFocused(false)
          // 성공 피드백
          const button = e.target.querySelector('button[type="submit"]')
          if (button) {
            button.classList.add('animate-bounceIn')
            setTimeout(() => button.classList.remove('animate-bounceIn'), 600)
          }
        } else {
          alert("댓글 작성에 실패했습니다: " + result.error)
        }
      } catch (error) {
        console.error("댓글 작성 오류:", error)
        alert("댓글 작성 중 오류가 발생했습니다")
      }
    })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-center space-x-3">
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              placeholder="댓글 추가..."
              className="w-full bg-transparent text-sm placeholder-gray-500 border-none outline-none resize-none"
              maxLength={1000}
            />
          </div>
          {comment.trim() && (
            <button
              type="submit"
              disabled={isPending || !comment.trim()}
              className={`
                text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all duration-200
                ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              `}
            >
              {isPending ? "게시 중..." : "게시"}
            </button>
          )}
        </div>
      </form>
    )
  }

  return (
    <div className={`
      transition-all duration-300 
      ${isFocused ? 'bg-gray-50 rounded-lg p-4' : 'border-t border-gray-100 pt-4'}
    `}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-3">
          <img
            src={session.user.image}
            alt={session.user.name}
            className="w-8 h-8 rounded-full flex-shrink-0"
          />
          <div className="flex-1">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={isPending}
                placeholder="댓글을 입력하세요..."
                className={`
                  w-full px-3 py-2 text-sm border rounded-lg resize-none transition-all duration-200
                  ${isFocused 
                    ? 'border-blue-500 ring-2 ring-blue-100 bg-white' 
                    : 'border-gray-200 bg-gray-50'
                  }
                  ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                rows={isFocused ? 3 : 1}
                maxLength={1000}
              />
              
              {/* Character count */}
              {isFocused && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {comment.length}/1000
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            {isFocused && (
              <div className="flex items-center justify-between mt-3 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="icon-btn text-gray-500 hover:text-yellow-500"
                    title="이모지 추가"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500">
                    Enter로 게시, Shift+Enter로 줄바꿈
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComment("")
                      setIsFocused(false)
                      inputRef.current?.blur()
                    }}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !comment.trim()}
                    className={`
                      flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${comment.trim() && !isPending
                        ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 active:scale-95'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>게시 중...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>댓글 게시</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}