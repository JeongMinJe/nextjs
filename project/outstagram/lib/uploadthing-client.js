// UploadThing 클라이언트 훅 (컴포넌트 전용)
// 서버에서는 import하지 않습니다

"use client"

import { generateReactHelpers } from "@uploadthing/react"

export const { useUploadThing } = generateReactHelpers({
  router: {
    imageUploader: null // 실제 라우터는 서버에서만 필요
  }
})