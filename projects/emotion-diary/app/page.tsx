"use client";

import DiaryList from "./components/diary-list";
import DiaryEditor from "./components/diary-editor";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen p-4 sm:p-6 md:p-8 lg:px-48 xl:px-64">
      <main className="max-w-7xl mx-auto flex flex-col lg:flex-row h-full lg:h-[calc(100vh-6rem)] gap-8">
        <section className="h-1/2 lg:h-full lg:w-1/2 bg-white rounded-xl shadow-md p-6 overflow-y-auto">
          <DiaryEditor />
        </section>

        <section className="h-1/2 lg:h-full lg:w-1/2 bg-white/70 backdrop-blur-sm rounded-xl shadow-md p-6 overflow-y-auto">
          <DiaryList />
        </section>
      </main>
    </div>
  );
}
