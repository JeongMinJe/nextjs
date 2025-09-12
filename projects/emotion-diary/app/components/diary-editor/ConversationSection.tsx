"use client";

import { BeatLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { GoPaperAirplane } from "react-icons/go";
import type { Message } from "../../types/messages";
import { FaArrowLeft } from "react-icons/fa6";
import MessageBubble from "./MessageBubble";
import { PiCatBold } from "react-icons/pi";
import {
  useGenerateDiaryEntryFromAI,
  useSendMessage,
} from "../../queries/useAI";
import { useSaveDiary } from "../../queries/useDiaries";
import { ImSpinner2 } from "react-icons/im";

interface ConversationSectionProps {
  onGoBack: () => void;
  onNewChat: () => void;
  initialMessage?: string;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
}

const ConversationSection = ({
  onGoBack,
  onNewChat,
  initialMessage,
  chatHistory,
  setChatHistory,
}: ConversationSectionProps) => {
  const [inputValue, setInputValue] = useState("");

  const { mutate: saveDiary, isPending: isSaving } = useSaveDiary();
  const { mutate: sendMessage, isPending } = useSendMessage(setChatHistory);
  const { mutateAsync: generateDiaryEntryFromAI } =
    useGenerateDiaryEntryFromAI();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMessage = { role: "user", content: inputValue };
    const updatedHistory = [...chatHistory, newUserMessage];

    setChatHistory(updatedHistory);
    setInputValue("");
    sendMessage(updatedHistory);
  };

  const handleSaveWithSummaryFromAI = async () => {
    const response = await generateDiaryEntryFromAI(chatHistory);
    const { summary, title } = response.data;

    const newDiary = {
      title,
      user_doc_id: "CWD91jDBLyyNNo4jbNKK",
      content: summary,
    };

    saveDiary(newDiary);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    inputRef.current?.focus();
  }, [chatHistory]);

  // 초기 메시지 처리 (한 번만 실행)
  useEffect(() => {
    if (initialMessage && chatHistory.length === 0) {
      const userMessage = { role: "user", content: initialMessage };
      setChatHistory([userMessage]);
      sendMessage([userMessage]);
    }
  }, [initialMessage]); // chatHistory.length === 0 조건 추가

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 p-2 border-b border-slate-200 flex items-center justify-between">
        <button className="p-2 rounded-full hover:bg-slate-100">
          <FaArrowLeft
            onClick={onGoBack}
            className="h-5 w-5 text-slate-500 cursor-pointer"
          />
        </button>

        <div className="flex gap-2">
          <button
            onClick={onNewChat}
            className="cursor-pointer w-32 h-8 flex justify-center items-center py-2 px-4 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            새로 대화하기
          </button>
          <button
            disabled={isSaving || chatHistory.length === 0}
            onClick={handleSaveWithSummaryFromAI}
            className={`cursor-pointer w-48 h-8 flex justify-center items-center py-2 px-4 text-sm font-semibold rounded-lg transition-colors ${
              chatHistory.length > 0 && !isSaving
                ? "bg-slate-600 text-white hover:bg-slate-700"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <ImSpinner2 className="animate-spin h-4 w-4" />
            ) : (
              <span>AI 요약으로 일기 저장</span>
            )}
          </button>
        </div>
      </header>
      {/* 1. 채팅 기록 표시 영역 */}
      <div className="flex-grow overflow-y-auto p-4">
        {/* 2. map 부분을 MessageBubble 컴포넌트로 교체 */}
        {chatHistory.map((chat, index) => (
          <MessageBubble key={index} chat={chat} />
        ))}

        {isPending && (
          <div className="flex justify-start mb-4 items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
              <PiCatBold className="text-slate-500" />
            </div>
            <div className="bg-slate-200 py-3 px-5 rounded-2xl rounded-bl-none">
              <BeatLoader color={"#64748b"} size={8} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 2. 메시지 입력 폼 (반응형 적용) */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-slate-100 border-t border-slate-200"
      >
        <div className="flex items-center bg-white border border-slate-300 rounded-full px-2 py-1 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow bg-transparent p-2 focus:outline-none"
            placeholder="메시지를 입력하세요..."
            disabled={isPending}
          />
          <button
            type="submit"
            className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none disabled:bg-slate-300 transition-colors"
            disabled={isPending || !inputValue.trim()}
          >
            <GoPaperAirplane className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationSection;
