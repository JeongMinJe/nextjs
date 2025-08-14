// 좋아요 관련 서버 액션들
// 좋아요 토글(추가/제거)을 처리합니다

"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function toggleLike(postId) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "로그인이 필요합니다" }
    }

    // 현재 좋아요 상태 확인
    const existingLike = await db.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: postId
        }
      }
    })

    if (existingLike) {
      // 좋아요가 있으면 제거
      await db.like.delete({
        where: {
          id: existingLike.id
        }
      })
    } else {
      // 좋아요가 없으면 추가
      await db.like.create({
        data: {
          userId: session.user.id,
          postId: postId
        }
      })
    }

    // 홈페이지 캐시 무효화 (좋아요 개수 즉시 반영)
    revalidatePath("/")
    
    return { success: true }

  } catch (error) {
    console.error("좋아요 토글 오류:", error)
    
    // Prisma 에러 처리
    if (error.code === "P2025") {
      return { error: "게시글을 찾을 수 없습니다" }
    }
    
    return { error: "좋아요 처리 중 오류가 발생했습니다" }
  }
}