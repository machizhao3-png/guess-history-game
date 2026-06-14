'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';
import { initPolling } from '@/lib/polling';
import { ResultModal } from './ResultModal';

interface QAEntry {
  id: string;
  content: string;
  aiReply: string;
  userNickname: string;
  userAvatar: string;
  createdAt: string;
}

export function QAPage() {
  const router = useRouter();
  const { gameId, user } = useGameStore();
  const [questions, setQuestions] = useState<QAEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [guessCorrect, setGuessCorrect] = useState(false);
  const [guesser, setGuesser] = useState('');
  const [error, setError] = useState<string>('');
  const [isOnline, setIsOnline] = useState(true);
  const [stopPolling, setStopPolling] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (!gameId) return;

    // 启动改进的轮询机制
    const stop = initPolling(gameId, (data) => {
      if (data.questions) {
        setQuestions(data.questions);
      }
      setIsOnline(true);
      setError('');
    }, {
      initialInterval: 1000,
      maxInterval: 30000,
      maxRetries: 3,
      onError: (err, retryCount) => {
        setIsOnline(false);
        if (retryCount >= 3) {
          setError(`网络错误：${err.message}，请检查连接`);
        }
      },
      onSuccess: () => {
        setIsOnline(true);
        setError('');
      },
    });

    setStopPolling(() => stop);

    return () => {
      stop();
    };
  }, [gameId]);

  const submitQuestion = async () => {
    if (!input.trim() || !gameId || !user.nickname) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          userId: user.nickname,
          question: input,
          userNickname: user.nickname,
          userAvatar: user.avatar,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to submit question');
      }

      setInput('');

      if (data.isGuessCorrect) {
        setGuessCorrect(true);
        setGuesser(user.nickname);
        if (stopPolling) stopPolling();
      }

      // 立即获取更新的状态
      await new Promise(resolve => setTimeout(resolve, 500));
      const stateRes = await fetch(`/api/game/state?gameId=${gameId}`);
      const stateData = await stateRes.json();
      if (stateData.questions) {
        setQuestions(stateData.questions);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`提问失败：${message}`);
      console.error('Failed to submit question:', err);
    }

    setLoading(false);
  };

  const goHome = () => {
    if (stopPolling) stopPolling();
    router.push('/');
  };

  const retryConnection = () => {
    setError('');
    setIsOnline(true);
  };

  if (guessCorrect) {
    return <ResultModal guesser={guesser} onClose={goHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={goHome}
          className="text-yellow-700 text-sm mb-4 hover:text-yellow-900 transition"
        >
          ← 返回主页
        </button>

        {/* 网络状态指示 */}
        {!isOnline && (
          <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-red-700">
                ⚠️ 网络连接中断，正在重试...
              </span>
              <button
                onClick={retryConnection}
                className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                立即重连
              </button>
            </div>
          </div>
        )}

        {/* 错误提示 */}
        {error && (
          <div className="mb-4 p-3 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">{error}</span>
              <button
                onClick={() => setError('')}
                className="text-orange-400 hover:text-orange-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 问答时间线 */}
        <div className="space-y-4 mb-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-yellow-200"></div>

              {/* 条目 */}
              <div className="ml-12 bg-white rounded-lg p-4 shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-yellow-600">#{idx + 1}</span>
                  <div className="text-right text-xs text-yellow-600">
                    <span>{q.userAvatar} {q.userNickname}</span>
                  </div>
                </div>
                <div className="text-sm text-yellow-900 mb-2">{q.content}</div>
                <div className={`text-sm font-bold ${
                  q.aiReply === '是' ? 'text-green-600' :
                  q.aiReply === '不是' ? 'text-red-600' :
                  q.aiReply === '猜对了' ? 'text-blue-600' :
                  'text-gray-600'
                }`}>
                  AI: {q.aiReply}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 固定输入框 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-yellow-200 p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && submitQuestion()}
            placeholder="是某个朝代/身份/性别/功绩...吗？"
            disabled={loading || !isOnline}
            className="flex-1 px-3 py-2 border-2 border-yellow-200 rounded focus:border-yellow-400 focus:outline-none disabled:bg-gray-100"
          />
          <button
            onClick={submitQuestion}
            disabled={!input.trim() || loading || !isOnline}
            className="bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded hover:bg-yellow-500 disabled:opacity-50 transition"
          >
            {loading ? '...' : '提问'}
          </button>
        </div>
      </div>
    </div>
  );
}
