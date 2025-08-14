// Enhanced LikeButton Component with animations
"use client"

import { useState, useTransition } from "react"
import { useSession } from "next-auth/react"
import { Heart } from "lucide-react"
import { toggleLike } from "@/actions/likes"

export default function LikeButton({ postId, initialLikesCount, isLikedByUser }) {
  const { data: session } = useSession()
  const [isPending, startTransition] = useTransition()
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLiked, setIsLiked] = useState(isLikedByUser)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLike = () => {
    if (!session) {
      alert("로그인이 필요합니다")
      return
    }

    // 애니메이션 트리거
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 600)

    // 낙관적 UI 업데이트 (서버 응답 전에 미리 변경)
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1)

    startTransition(async () => {
      try {
        const result = await toggleLike(postId)
        
        if (result.error) {
          // 실패 시 원래 상태로 롤백
          setIsLiked(isLiked)
          setLikesCount(initialLikesCount)
          alert("좋아요 처리에 실패했습니다: " + result.error)
        }
      } catch (error) {
        // 에러 시 롤백
        setIsLiked(isLiked)
        setLikesCount(initialLikesCount)
        console.error("좋아요 오류:", error)
        alert("좋아요 처리 중 오류가 발생했습니다")
      }
    })
  }

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={handleLike}
        disabled={isPending}
        className={`
          relative p-2 rounded-full transition-all duration-200 transform
          ${isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50 active:scale-95"}
          ${isAnimating ? "animate-bounceIn" : ""}
        `}
      >
        {/* Heart icon with animation */}
        <div className="relative">
          <Heart 
            className={`
              w-6 h-6 transition-all duration-300 transform
              ${isLiked 
                ? "fill-red-500 text-red-500 scale-110" 
                : "text-gray-600 hover:text-red-500 scale-100"
              }
              ${isAnimating ? "animate-pulse" : ""}
            `}
          />
          
          {/* Floating hearts animation */}
          {isAnimating && isLiked && (
            <>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-bounce">
                <Heart className="w-3 h-3 fill-red-400 text-red-400 opacity-80" />
              </div>
              <div className="absolute -top-1 -right-1 transform animate-ping">
                <Heart className="w-2 h-2 fill-pink-400 text-pink-400 opacity-60" />
              </div>
              <div className="absolute -top-1 -left-1 transform animate-ping delay-100">
                <Heart className="w-2 h-2 fill-red-300 text-red-300 opacity-60" />
              </div>
            </>
          )}
        </div>

        {/* Ripple effect */}
        {isAnimating && (
          <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-ping"></div>
        )}
      </button>
      
      {/* Likes count with animation */}
      {likesCount > 0 && (
        <span className={`
          text-sm font-semibold text-gray-900 transition-all duration-300
          ${isAnimating ? "animate-scaleIn text-red-500" : ""}
        `}>
          {likesCount.toLocaleString()}
        </span>
      )}
    </div>
  )
}