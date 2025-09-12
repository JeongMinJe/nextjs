// components/MessageBubble.tsx

import { PiCatBold } from "react-icons/pi";
import type { Message } from "../../types/messages";

interface MessageBubbleProps {
  chat: Message;
}

const MessageBubble = ({ chat }: MessageBubbleProps) => {
  const isUser = chat.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-500 text-white py-2 px-4 rounded-2xl rounded-br-none max-w-[80%] sm:max-w-md">
          {chat.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 items-start gap-3">
      {/* AI 아바타 */}
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
        <PiCatBold className="text-slate-500" />
      </div>
      {/* AI 메시지 */}
      <div className="bg-slate-200 text-slate-800 py-2 px-4 rounded-2xl rounded-bl-none max-w-[80%] sm:max-w-md">
        {chat.content}
      </div>
    </div>
  );
};

export default MessageBubble;
