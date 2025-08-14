// shadcn/ui에서 사용하는 유틸리티 함수들
// 클래스명 조합과 Tailwind 클래스 중복 제거를 담당합니다

import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}