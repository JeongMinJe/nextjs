import { useState } from "react";
import ConversationSection from "./ConversationSection";
import EditSection from "./EditSection";
import Header from "./Header";
import type { Message } from "../../types/messages";

const DiaryEditor = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<
    string | undefined
  >();
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const handleOpenChat = (message?: string) => {
    setInitialChatMessage(message);
    setIsChatOpen(true);
  };

  const handleGoBack = () => {
    setIsChatOpen(false);
    setInitialChatMessage(undefined);
    // chatHistory는 유지 - 대화 내용 보존
  };

  const handleNewChat = () => {
    setChatHistory([]);
    setInitialChatMessage(undefined);
  };

  return (
    <div className="flex flex-col h-full shadow-md">
      <header className="flex-shrink-0">
        <Header />
      </header>

      <main className="flex-grow overflow-y-auto min-h-0 ">
        {isChatOpen ? (
          <ConversationSection
            onGoBack={handleGoBack}
            onNewChat={handleNewChat}
            initialMessage={initialChatMessage}
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
          />
        ) : (
          <EditSection onOpenChat={handleOpenChat} />
        )}
      </main>
    </div>
  );
};

export default DiaryEditor;
