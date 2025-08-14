// Enhanced ImageUpload Component with better UX
"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useUploadThing } from "@/lib/uploadthing-client"
import Image from "next/image"
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  RefreshCw 
} from "lucide-react"

export default function ImageUpload({ onUploadComplete, disabled }) {
  const [preview, setPreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [error, setError] = useState(null)

  const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      console.log("업로드 완료:", res)
      setIsUploading(false)
      setUploadProgress(100)
      setUploadSuccess(true)
      if (res?.[0]) {
        onUploadComplete(res[0].url)
        setTimeout(() => setUploadSuccess(false), 2000)
      }
    },
    onUploadError: (error) => {
      console.error("업로드 오류:", error)
      setIsUploading(false)
      setUploadProgress(0)
      setError("이미지 업로드에 실패했습니다. 다시 시도해주세요.")
      setTimeout(() => setError(null), 5000)
    },
    onUploadBegin: (name) => {
      console.log("업로드 시작:", name)
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)
    },
    onUploadProgress: (progress) => {
      setUploadProgress(progress)
    }
  })

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors.some(error => error.code === 'file-too-large')) {
        setError("파일 크기는 4MB 이하여야 합니다.")
      } else if (rejection.errors.some(error => error.code === 'file-invalid-type')) {
        setError("PNG, JPG, WEBP 형식만 지원됩니다.")
      } else {
        setError("파일을 업로드할 수 없습니다.")
      }
      setTimeout(() => setError(null), 5000)
      return
    }

    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]

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
    maxSize: 4 * 1024 * 1024, // 4MB
    disabled: disabled || isUploading
  })

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setUploadProgress(0)
    setUploadSuccess(false)
    setError(null)
    onUploadComplete("")
  }

  const retryUpload = () => {
    setError(null)
    setUploadProgress(0)
    // Re-trigger file selection
    document.querySelector('input[type="file"]')?.click()
  }

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!preview ? (
        <div
          {...getRootProps()}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 scale-105' 
              : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {/* Icon */}
            <div className={`
              inline-flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300
              ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'}
              ${error ? 'bg-red-100' : ''}
            `}>
              {error ? (
                <AlertCircle className="w-8 h-8 text-red-500" />
              ) : (
                <Upload className={`
                  w-8 h-8 transition-all duration-300
                  ${isDragActive ? 'text-blue-600 animate-bounce' : 'text-gray-500'}
                `} />
              )}
            </div>

            {/* Text */}
            <div>
              {error ? (
                <div className="space-y-2">
                  <p className="text-lg font-medium text-red-700">
                    업로드 실패
                  </p>
                  <p className="text-sm text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={retryUpload}
                    className="inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>다시 시도</span>
                  </button>
                </div>
              ) : isDragActive ? (
                <div>
                  <p className="text-lg font-medium text-blue-700">
                    이미지를 여기에 놓으세요
                  </p>
                  <p className="text-sm text-blue-600">
                    파일을 놓으면 업로드가 시작됩니다
                  </p>
                </div>
              ) : (
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
              )}
            </div>

            {/* Upload button */}
            {!error && !isDragActive && (
              <button
                type="button"
                className="btn-primary px-6 py-3 mx-auto"
                disabled={disabled || isUploading}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                파일 선택하기
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Image Preview */
        <div className="space-y-4 animate-scaleIn">
          <div className="relative bg-gray-100 rounded-xl overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={preview}
                alt="업로드할 이미지 미리보기"
                fill
                className="object-cover"
              />
              
              {/* Success overlay */}
              {uploadSuccess && (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-fadeIn">
                  <div className="bg-white rounded-full p-3 shadow-lg animate-bounceIn">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              )}
              
              {/* Loading overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="font-medium">업로드 중...</p>
                    <p className="text-sm opacity-75">{uploadProgress}%</p>
                  </div>
                </div>
              )}
            </div>

            {/* Remove button */}
            {!isUploading && (
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload status */}
          <div className="text-center">
            {isUploading ? (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  이미지를 업로드하고 있습니다... ({uploadProgress}%)
                </p>
              </div>
            ) : uploadSuccess ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Check className="w-5 h-5" />
                <span className="font-medium">업로드 완료!</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                다른 이미지를 선택하려면 X 버튼을 클릭하세요
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}