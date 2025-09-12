import { useRef, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { useSaveDiary } from "../../queries/useDiaries";
import { useGenerateTitle } from "../../queries/useAI";
import ConfirmModal from "../common/ConfirmModal";

interface EditSectionProps {
  onOpenChat: (message?: string) => void;
}

const EditSection = ({ onOpenChat }: EditSectionProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const { mutate: saveDiary, isPending: isSaving } = useSaveDiary();
  const { mutateAsync: generateTitle } = useGenerateTitle();

  const handleSave = async () => {
    const content = textAreaRef.current?.value || "";
    if (!content.trim()) return; // 어딘가에, 알림을 주어야 할 듯.

    const response = await generateTitle(content);
    const titleFromAI = response.data.title;

    const newDiary = {
      title: titleFromAI,
      user_doc_id: "CWD91jDBLyyNNo4jbNKK",
      content,
    };

    saveDiary(newDiary);
  };

  const handleAIChatClick = () => {
    const content = textAreaRef.current?.value || "";

    if (content.trim()) {
      setEditorContent(content);
      setShowModal(true);
    } else {
      onOpenChat();
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    onOpenChat(editorContent);

    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    onOpenChat();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
      {/* 일기 입력 영역 */}
      <textarea
        ref={textAreaRef}
        className="flex-grow w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-slate-400 transition-colors"
        placeholder="오늘 하루는 어땠나요?"
      />
      <div className="mt-4 flex items-center justify-end gap-3">
        {/* AI와 대화 버튼 (기준) */}
        <button
          onClick={handleAIChatClick}
          className="cursor-pointer w-32 h-11 flex justify-center items-center text-sm font-semibold text-slate-500 bg-white border border-slate-300 rounded-lg transition-colors hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
        >
          AI와 대화
        </button>

        {/* 일기 저장 버튼 (수정) */}
        <button
          disabled={isSaving}
          onClick={handleSave}
          className={`cursor-pointer w-32 h-11 flex justify-center items-center text-sm font-semibold bg-slate-400 text-white rounded-lg transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isSaving ? (
            <ImSpinner2 className="animate-spin h-5 w-5" />
          ) : (
            <span>일기 저장</span>
          )}
        </button>
      </div>

      {/* Modal */}
      <ConfirmModal
        isOpen={showModal}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        title="AI와 대화하기"
        message="에디터에 작성한 내용을 AI와의 대화에 포함시키시겠습니까?"
        confirmText="포함하기"
        cancelText="새로 시작"
      />
    </div>
  );
};

export default EditSection;
