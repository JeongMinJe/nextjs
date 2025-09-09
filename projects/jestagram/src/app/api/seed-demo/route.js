// app/api/seed-demo/route.js
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  DEMO_ACCOUNTS,
  DEMO_POSTS,
  DEMO_COMMENTS,
  DEMO_FOLLOWS,
} from "@/lib/demo-accounts";

const prisma = new PrismaClient();

export async function POST() {
  // 보안: 데모 모드에서만 실행 가능
  if (process.env.DEMO_MODE !== "true") {
    return NextResponse.json(
      { error: "데모 모드에서만 실행 가능" },
      { status: 403 }
    );
  }

  try {
    // 기존 데이터 삭제 (순서 중요: 외래키 제약 때문)
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.user.deleteMany();

    // 데모 사용자 생성
    for (const account of DEMO_ACCOUNTS) {
      await prisma.user.create({
        data: {
          id: account.id,
          name: account.name,
          email: account.email,
          image: account.image,
          bio: account.bio,
          createdAt: account.createdAt,
        },
      });
    }

    // 데모 포스트 생성
    for (const post of DEMO_POSTS) {
      await prisma.post.create({
        data: {
          id: post.id,
          caption: post.caption,
          imageUrl: post.imageUrl,
          authorId: post.authorId,
          createdAt: post.createdAt,
        },
      });
    }

    // 데모 댓글 생성
    for (const comment of DEMO_COMMENTS) {
      await prisma.comment.create({
        data: {
          id: comment.id,
          content: comment.content,
          authorId: comment.authorId,
          postId: comment.postId,
          createdAt: comment.createdAt,
        },
      });
    }

    // 팔로우 관계 생성
    for (const follow of DEMO_FOLLOWS) {
      await prisma.follow.create({
        data: {
          followerId: follow.followerId,
          followingId: follow.followingId,
        },
      });
    }

    return NextResponse.json({
      message: "데모 데이터 생성 완료",
      users: DEMO_ACCOUNTS.length,
      posts: DEMO_POSTS.length,
      comments: DEMO_COMMENTS.length,
      follows: DEMO_FOLLOWS.length,
    });
  } catch (error) {
    console.error("데모 데이터 생성 실패:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
