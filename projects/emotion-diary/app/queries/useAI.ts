"use client";

import { useMutation } from "@tanstack/react-query";
import type { Message } from "../types/messages";
import type { AxiosResponse } from "axios";
import apiClient from "../lib/axios";
import type { GeneratedTitle } from "../types/ai";

const generateDiaryEntryRequest = (chatHistory: Message[]) => {
  return apiClient.post("/ai/diary-entry", {
    chatHistory,
  });
};

export const useGenerateDiaryEntryFromAI = () => {
  return useMutation({
    mutationFn: generateDiaryEntryRequest,
  });
};

const postChatMessage = (fullChatHistory: Message[]) => {
  return apiClient.post("/chat", {
    messages: fullChatHistory,
  });
};

export const useSendMessage = (
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>
) => {
  return useMutation<AxiosResponse<{ reply: Message }>, Error, Message[]>({
    mutationFn: postChatMessage,
    onSuccess: (data) => {
      setChatHistory((prev) => [...prev, data.data.reply]);
    },
    onError: (error) => {
      console.error("API 호출 오류:", error);
    },
  });
};

const generateTitleRequest = (content: string) => {
  return apiClient.post("/ai/title", { content });
};

export const useGenerateTitle = () => {
  return useMutation<AxiosResponse<GeneratedTitle>, Error, string>({
    mutationFn: generateTitleRequest,
  });
};
