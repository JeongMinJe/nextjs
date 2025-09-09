import { handlers } from "@/lib/auth";

// Next.js App Router에서는 GET과 POST 모두 export해야 함
export const { GET, POST } = handlers;
