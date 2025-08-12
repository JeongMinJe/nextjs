// 이미지 업로드 컴포넌트 (import 수정)
// 드래그 앤 드롭이나 클릭으로 이미지를 선택하고 업로드합니다

"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
// import { useUploadThing } from "@/lib/uploadthing"  // 경로 수정
// 기존
// import { useUploadThing } from "@/lib/uploadthing"

// 변경
import { useUploadThing } from "@/lib/uploadthing-client"
import Image from "next/image"

export default function ImageUpload({ onUploadComplete, disabled }) {
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("업로드 완료:", res)
      setIsUploading(false)
      if (res?.[0]) {
        onUploadComplete(res[0].url)
      }
    },
    onUploadError: (error) => {
      console.error("업로드 오류:", error)
      setIsUploading(false)
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.")
    },
    onUploadBegin: (name) => {
      console.log("업로드 시작:", name)
      setIsUploading(true)
    },
  })

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    
    // 파일 크기 확인 (4MB)
    if (file.size > 4 * 1024 * 1024) {
      alert("파일 크기는 4MB 이하여야 합니다.")
      return
    }

    // 미리보기 생성
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)

    // 업로드 시작
    await startUpload([file])
  }, [startUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    disabled: disabled || isUploading
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-gray-50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <div className="relative w-full aspect-square max-w-xs mx-auto">
              <Image
                src={preview}
                alt="업로드할 이미지 미리보기"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            {!isUploading && (
              <p className="text-sm text-gray-600">
                다른 이미지를 선택하려면 클릭하거나 드래그하세요
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-gray-400">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                이미지를 업로드하세요
              </p>
              <p className="text-sm text-gray-600 mt-1">
                클릭하거나 드래그해서 파일을 선택하세요
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, WEBP (최대 4MB)
              </p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-blue-600">업로드 중...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}