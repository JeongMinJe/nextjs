// UploadThing 서버 설정 (API 라우트 전용)
// 클라이언트 코드는 포함하지 않습니다

import { createUploadthing } from "uploadthing/next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ 
    image: { 
      maxFileSize: "4MB",
      maxFileCount: 1 
    } 
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions)
      
      if (!session) {
        throw new Error("로그인이 필요합니다")
      }

      return { userId: session.user.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("업로드 완료:", file.url)
      console.log("업로드한 사용자:", metadata.userId)
      
      return { uploadedBy: metadata.userId, url: file.url }
    }),
}