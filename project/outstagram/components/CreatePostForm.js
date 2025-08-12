// 게시글 작성 폼 컴포넌트
// 이미지 업로드와 캡션 입력을 관리합니다

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "./ImageUpload"
import { createPost } from "@/actions/posts"

export default function CreatePostForm() {
  const [imageUrl, setImageUrl] = useState("")
  const [caption, setCaption] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!imageUrl) {
      alert("이미지를 먼저 업로드해주세요.")
      return
    }

    if (!caption.trim()) {
      alert("캡션을 입력해주세요.")
      return
    }

    startTransition(async () => {
      try {
        const result = await createPost({
          imageUrl,
          caption: caption.trim()
        })

        if (result.success) {
          alert("게시글이 성공적으로 업로드되었습니다!")
          router.push("/")
        } else {
          alert("게시글 업로드에 실패했습니다: " + result.error)
        }
      } catch (error) {
        console.error("게시글 생성 오류:", error)
        alert("게시글 업로드 중 오류가 발생했습니다.")
      }
    })
  }

  const isSubmitDisabled = isPending || !imageUrl || !caption.trim()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이미지 업로드 섹션 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          사진 선택
        </label>
        <ImageUpload
          onUploadComplete={setImageUrl}
          disabled={isPending}
        />
      </div>

      {/* 캡션 입력 섹션 */}
      <div>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          캡션
        </label>
        <textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isPending}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          placeholder="이 순간에 대해 이야기해보세요..."
          maxLength={2200}
        />
        <div className="mt-1 text-right text-xs text-gray-500">
          {caption.length}/2200
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:bg-gray-400"
        >
          {isPending ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              게시 중...
            </span>
          ) : (
            "게시하기"
          )}
        </button>
      </div>
    </form>
  )
}