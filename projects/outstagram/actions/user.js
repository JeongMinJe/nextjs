// 사용자 관련 서버 액션들
// 프로필 업데이트 등의 서버 작업을 처리합니다

"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function updateProfile(formData) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      throw new Error("로그인이 필요합니다")
    }

    // 폼 데이터 추출
    const name = formData.get("name")
    const bio = formData.get("bio")

    // 유효성 검사
    if (!name || name.trim().length < 1) {
      throw new Error("이름은 필수입니다")
    }

    // 데이터베이스 업데이트
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        bio: bio?.trim() || null,
      },
    })

    // 캐시 무효화 (페이지 새로고침)
    revalidatePath("/profile")
    
    return { success: true }
  } catch (error) {
    console.error("프로필 업데이트 오류:", error)
    return { error: error.message }
  }
}