'use client';

interface HistoryQuestion {
  content: string;
  aiReply: string;
  userNickname: string;
  userAvatar: string;
}

interface HistoryModalProps {
  figureName: string;
  questions: HistoryQuestion[];
  onClose: () => void;
}

export function HistoryModal({ figureName, questions, onClose }: HistoryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-sm w-full max-h-96 overflow-auto p-4">
        <h3 className="text-lg font-bold mb-4 text-yellow-900">{figureName}</h3>

        <div className="space-y-3 mb-4">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-yellow-50 rounded p-3 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-yellow-700 font-medium">{q.userAvatar} {q.userNickname}</span>
              </div>
              <div className="text-yellow-900 mb-1">{q.content}</div>
              <div className="font-bold text-yellow-600">AI: {q.aiReply}</div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-yellow-400 text-yellow-900 font-bold py-2 rounded hover:bg-yellow-500 transition"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
