"use client";

import { FaCircleUser } from "react-icons/fa6";
import { useGetUserData } from "../../queries/useUsers";

const EMAIL_FOR_TEST = "test@example.com";

const Header = () => {
  const { data: userData } = useGetUserData(EMAIL_FOR_TEST);

  return (
    <section className="flex items-center border-b border-slate-200 pb-4">
      {/* 제목 (왼쪽) */}
      <h1 className="text-xl sm:text-2xl font-bold text-slate-700 pl-2">
        Emotion Diary Editor
      </h1>

      {/* 사용자 정보 (오른쪽) */}
      <div className="ml-auto flex items-center gap-3 cursor-pointer rounded-full p-1 hover:bg-slate-100 transition-colors">
        <FaCircleUser className="h-7 w-7 text-slate-500 sm:h-8 sm:w-8" />
        <div className="whitespace-nowrap pr-2 text-sm font-medium text-slate-600 sm:text-base">
          {userData?.name}
        </div>
      </div>
    </section>
  );
};

export default Header;
