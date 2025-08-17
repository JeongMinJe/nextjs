import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MyGram - 나만의 인스타그램",
  description: "Next.js로 만든 소셜 미디어 플랫폼",
};

export default async function RootLayout({ children }) {
  // 서버에서 현재 세션 정보 가져오기
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gray-50">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
