// 게시글 관련 서버 액션들
// 게시글 생성, 수정, 삭제 등의 서버 작업을 처리합니다

"use server"

import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function createPost({ imageUrl, caption }) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "로그인이 필요합니다" }
    }

    // 입력 데이터 검증
    if (!imageUrl || !imageUrl.trim()) {
      return { error: "이미지는 필수입니다" }
    }

    if (!caption || !caption.trim()) {
      return { error: "캡션은 필수입니다" }
    }

    if (caption.length > 2200) {
      return { error: "캡션은 2200자 이하여야 합니다" }
    }

    // URL 형식 검증 (간단)
    try {
      new URL(imageUrl)
    } catch {
      return { error: "올바른 이미지 URL이 아닙니다" }
    }

    // 데이터베이스에 게시글 생성
    const post = await db.post.create({
      data: {
        caption: caption.trim(),
        imageUrl: imageUrl.trim(),
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })

    // 홈페이지 캐시 무효화 (새 게시글 반영)
    revalidatePath("/")
    
    console.log("새 게시글 생성됨:", post.id)
    return { success: true, post }

  } catch (error) {
    console.error("게시글 생성 오류:", error)
    
    // Prisma 에러 처리
    if (error.code === "P2002") {
      return { error: "중복된 데이터입니다" }
    }
    
    if (error.code === "P2025") {
      return { error: "사용자를 찾을 수 없습니다" }
    }

    return { error: "게시글 생성 중 오류가 발생했습니다" }
  }
}

export async function deletePost(postId) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions)
    if (!session) {
      return { error: "로그인이 필요합니다" }
    }

    // 게시글 존재 여부 및 권한 확인
    const existingPost = await db.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })

    if (!existingPost) {
      return { error: "게시글을 찾을 수 없습니다" }
    }

    if (existingPost.authorId !== session.user.id) {
      return { error: "게시글을 삭제할 권한이 없습니다" }
    }

    // 게시글 삭제
    await db.post.delete({
      where: { id: postId }
    })

    // 캐시 무효화
    revalidatePath("/")
    revalidatePath("/profile")

    return { success: true }

  } catch (error) {
    console.error("게시글 삭제 오류:", error)
    return { error: "게시글 삭제 중 오류가 발생했습니다" }
  }
}