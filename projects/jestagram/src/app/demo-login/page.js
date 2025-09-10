// app/demo-login/page.js
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Camera } from "lucide-react";
import { DEMO_ACCOUNTS } from "../../../prisma/seed/demo-accounts";

export default function DemoLoginPage() {
  const [loadingUserId, setLoadingUserId] = useState(null);

  // 세션 체크 로직 제거 - NextAuth가 자동으로 처리

  const handleDemoLogin = async (userId) => {
    setLoadingUserId(userId);
    try {
      // NextAuth가 자동으로 로그인 처리 및 리다이렉트
      await signIn("demo", {
        userId,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
      setLoadingUserId(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* 로고 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4 animate-pulse">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            📸 Jestagram
          </h2>
          <p className="text-gray-600">
            데모 계정으로 포트폴리오를 체험해보세요
          </p>
        </div>

        {/* 데모 계정 선택 */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">
            데모 계정 선택
          </h3>
          <div className="space-y-3">
            {DEMO_ACCOUNTS.map((account) => {
              const isLoading = loadingUserId === account.id;
              return (
                <button
                  key={account.id}
                  onClick={() => handleDemoLogin(account.id)}
                  disabled={loadingUserId !== null}
                  className="w-full flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <img
                    src={account.image}
                    alt={account.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">
                      {account.name}
                    </div>
                    <div className="text-sm text-gray-500">{account.bio}</div>
                  </div>
                  {isLoading && (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            데모 계정으로 모든 기능을 체험할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
