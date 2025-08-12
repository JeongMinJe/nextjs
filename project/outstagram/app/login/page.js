// 로그인 페이지 컴포넌트
// GitHub OAuth를 통한 로그인 버튼을 제공합니다

"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
 const [isLoading, setIsLoading] = useState(false)

 const handleGitHubLogin = async () => {
   setIsLoading(true)
   try {
     await signIn("github", { callbackUrl: "/" })
   } catch (error) {
     console.error("로그인 오류:", error)
   } finally {
     setIsLoading(false)
   }
 }

 return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50">
     <div className="max-w-md w-full space-y-8">
       <div className="text-center">
         <h2 className="text-3xl font-bold text-gray-900">
           📸 MyGram
         </h2>
         <p className="mt-2 text-sm text-gray-600">
           GitHub 계정으로 간편하게 로그인하세요
         </p>
       </div>

       <div className="bg-white py-8 px-6 shadow-sm rounded-lg border border-gray-200">
         <button
           onClick={handleGitHubLogin}
           disabled={isLoading}
           className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
         >
           {isLoading ? (
             "로그인 중..."
           ) : (
             <>
               <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
               </svg>
               GitHub로 로그인
             </>
           )}
         </button>

         <p className="mt-4 text-xs text-gray-500 text-center">
           로그인하면 서비스 이용약관과 개인정보처리방침에 동의하는 것으로 간주됩니다.
         </p>
       </div>
     </div>
   </div>
 )
}