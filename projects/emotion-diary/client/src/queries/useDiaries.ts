import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DiaryListItem, DiaryPost } from "../types/diaries";
import apiClient from "../lib/axios";

const getDiaries = async (email: string): Promise<DiaryListItem[]> => {
  const response = await apiClient.get("/diaries", {
    params: { email },
  });
  return response.data;
};

export const useGetDiaries = (email: string) => {
  return useQuery<DiaryListItem[]>({
    queryKey: ["diaries", email],
    queryFn: () => getDiaries(email),
    refetchOnWindowFocus: false,
    enabled: !!email,
  });
};

const saveDiaryRequest = (newDiary: DiaryPost) => {
  return apiClient.post("/diaries", newDiary);
};

export const useSaveDiary = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDiaryRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaries"] });
    },
  });
};
