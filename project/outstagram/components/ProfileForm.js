// 프로필 수정 폼 컴포넌트
// 사용자가 이름과 소개를 수정할 수 있습니다

"use client"

import { useTransition } from "react"
import { updateProfile } from "@/actions/user"

export default function ProfileForm({ user }) {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData) => {
    startTransition(() => {
      updateProfile(formData)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          이름
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={user?.name || ""}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="이름을 입력하세요"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          소개
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          defaultValue={user?.bio || ""}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="자신을 소개해보세요"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isPending ? "저장 중..." : "프로필 업데이트"}
      </button>
    </form>
  )
}