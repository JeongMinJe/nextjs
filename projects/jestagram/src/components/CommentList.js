// components/CommentList.js
// 댓글 목록 표시 컴포넌트

"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { deleteComment } from "@/actions/posts";
import { Trash2, MoreVertical, Loader2 } from "lucide-react";

export default function CommentList({
  comments: initialComments,
  postAuthorId,
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [isPending, startTransition] = useTransition();

  // 시간 표시 함수
  const getTimeAgo = (createdAt) => {
    const now = new Date();
    const commentTime = new Date(createdAt);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);

    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    return commentTime.toLocaleDateString("ko-KR");
  };

  // 댓글 삭제 처리
  const handleDeleteComment = async (commentId) => {
    if (!confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      return;
    }

    setDeletingCommentId(commentId);

    startTransition(async () => {
      try {
        console.log("🗑️ 댓글 삭제 시작:", commentId);

        const result = await deleteComment(commentId);

        if (result.success) {
          console.log("✅ 댓글 삭제 완료!");
          // 삭제된 댓글을 목록에서 제거
          setComments((prev) =>
            prev.filter((comment) => comment.id !== commentId)
          );
        } else {
          alert(result.error || "댓글 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("❌ 댓글 삭제 오류:", error);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      } finally {
        setDeletingCommentId(null);
      }
    });
  };

  // 새 댓글 추가 (CommentForm에서 호출)
  const addNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  // 댓글 삭제 권한 확인
  const canDeleteComment = (comment) => {
    if (!session) return false;

    // 댓글 작성자 본인이거나 게시글 작성자인 경우 삭제 가능
    return (
      comment.userId === session.user.id || postAuthorId === session.user.id
    );
  };

  if (comments.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500 text-sm">
        <p>아직 댓글이 없습니다.</p>
        <p>첫 번째 댓글을 작성해보세요! 💬</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-2">
      {/* 댓글 수 표시 */}
      <div className="mb-4 text-sm font-semibold text-gray-900">
        댓글 {comments.length}개
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start space-x-3 group">
            {/* 프로필 이미지 */}
            <Link href={`/profile/${comment.user.id}`}>
              <img
                src={comment.user.image}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
              />
            </Link>

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="font-semibold text-sm text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    {comment.user.name}
                  </Link>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed break-words">
                  {comment.content}
                </p>
              </div>
            </div>

            {/* 삭제 버튼 (권한이 있는 경우만) */}
            {canDeleteComment(comment) && (
              <div className="relative">
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deletingCommentId === comment.id}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="댓글 삭제"
                >
                  {deletingCommentId === comment.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
