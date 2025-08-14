// 댓글 관련 서버 액션들
// 댓글 생성, 삭제 등의 서버 작업을 처리합니다

"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createComment({ postId, content }) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "로그인이 필요합니다" }
    }

    // 입력 데이터 검증
    if (!content || !content.trim()) {
      return { error: "댓글 내용을 입력해주세요" }
    }

    if (content.length > 1000) {
      return { error: "댓글은 1000자 이하여야 합니다" }
    }

    // 게시글 존재 여부 확인
    const postExists = await db.post.findUnique({
      where: { id: postId },
      select: { id: true }
    })

    if (!postExists) {
      return { error: "게시글을 찾을 수 없습니다" }
    }

    // 댓글 생성
    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    // 홈페이지 캐시 무효화
    revalidatePath("/")
    
    console.log("새 댓글 생성됨:", comment.id)
    return { success: true, comment }

  } catch (error) {
    console.error("댓글 생성 오류:", error)
    
    if (error.code === "P2025") {
      return { error: "게시글을 찾을 수 없습니다" }
    }
    
    return { error: "댓글 작성 중 오류가 발생했습니다" }
  }
}

export async function deleteComment(commentId) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "로그인이 필요합니다" }
    }

    // 댓글 존재 여부 및 권한 확인
    const existingComment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true }
    })

    if (!existingComment) {
      return { error: "댓글을 찾을 수 없습니다" }
    }

    if (existingComment.userId !== session.user.id) {
      return { error: "댓글을 삭제할 권한이 없습니다" }
    }

    // 댓글 삭제
    await db.comment.delete({
      where: { id: commentId }
    })

    // 캐시 무효화
    revalidatePath("/")

    return { success: true }

  } catch (error) {
    console.error("댓글 삭제 오류:", error)
    return { error: "댓글 삭제 중 오류가 발생했습니다" }
  }
}