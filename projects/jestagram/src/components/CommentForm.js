// components/CommentForm.js
// 댓글 작성 폼 컴포넌트

"use client";

import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { addComment } from "@/actions/posts";
import { Send, Loader2 } from "lucide-react";

export default function CommentForm({ postId, onCommentAdded }) {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  // 댓글 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로그인 확인
    if (!session) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 내용 검증
    if (!content.trim()) {
      setError("댓글 내용을 입력해주세요.");
      return;
    }

    if (content.length > 1000) {
      setError("댓글은 1000자 이하여야 합니다.");
      return;
    }

    setError("");

    // 서버 액션 실행
    startTransition(async () => {
      try {
        console.log("💬 댓글 작성 시작...");

        const formData = new FormData();
        formData.append("postId", postId);
        formData.append("content", content.trim());

        const result = await addComment(formData);

        if (result.success) {
          console.log("✅ 댓글 작성 완료!");
          setContent(""); // 입력창 비우기

          // 부모 컴포넌트에 새 댓글 알리기
          if (onCommentAdded) {
            onCommentAdded(result.comment);
          }
        } else {
          setError(result.error || "댓글 작성에 실패했습니다.");
        }
      } catch (error) {
        console.error("❌ 댓글 작성 오류:", error);
        setError("댓글 작성 중 오류가 발생했습니다.");
      }
    });
  };

  // 로그인하지 않은 사용자
  if (!session) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        댓글을 작성하려면 로그인이 필요합니다.
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 p-4">
      {/* 에러 메시지 */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="flex items-start space-x-3">
        {/* 프로필 이미지 */}
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />

        {/* 입력 영역 */}
        <div className="flex-1">
          <div className="flex items-end space-x-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPending}
              placeholder="댓글을 작성하세요..."
              className="flex-1 resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-50"
              rows={1}
              style={{
                minHeight: "40px",
                maxHeight: "120px",
                height: "auto",
                overflow: "hidden",
              }}
              onInput={(e) => {
                // 자동 높이 조절
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 120) + "px";
              }}
            />

            <button
              type="submit"
              disabled={isPending || !content.trim()}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* 글자 수 표시 */}
          <div
            className={`text-xs mt-1 text-right ${
              content.length > 900 ? "text-red-500" : "text-gray-400"
            }`}
          >
            {content.length}/1000
          </div>
        </div>
      </form>
    </div>
  );
}
