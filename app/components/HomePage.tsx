'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface HistoricalFigure {
  figureName: string;
  questionCount: number;
  guessedBy: string;
}

export function HomePage() {
  const router = useRouter();
  const { gameId, stats } = useGameStore();
  const [history, setHistory] = useState<HistoricalFigure[]>([]);
  const [selectedFigure, setSelectedFigure] = useState<HistoricalFigure | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (data.history) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const enterGame = () => {
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
      <div className="max-w-md mx-auto">
        {/* 顶部统计 */}
        <div className="flex justify-between mb-8 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-700">{stats.totalGuessed}</div>
            <div className="text-sm text-yellow-600">累计猜对</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-700">{stats.totalQuestions}</div>
            <div className="text-sm text-yellow-600">累计提问</div>
          </div>
        </div>

        {/* 中央大卡片 */}
        <div
          onClick={enterGame}
          className="bg-white rounded-2xl shadow-lg p-16 text-center mb-8 cursor-pointer hover:shadow-xl hover:scale-105 transition"
        >
          <div className="text-6xl mb-4">?</div>
          <div className="text-yellow-600 text-sm">点击开始猜谜</div>
        </div>

        {/* 历史人物列表 */}
        {history.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-yellow-900 mb-4">已猜出的人物</h2>
            <div className="space-y-2">
              {history.map((figure, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFigure(figure)}
                  className="w-full bg-white rounded-lg p-3 text-left hover:bg-yellow-50 transition flex justify-between items-center"
                >
                  <span className="font-medium text-yellow-900">{figure.figureName}</span>
                  <span className="text-xs text-yellow-600">{figure.questionCount} 问</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 历史问答弹窗 */}
        {selectedFigure && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-sm w-full max-h-96 overflow-auto p-4">
              <h3 className="text-lg font-bold mb-4 text-yellow-900">{selectedFigure.figureName}</h3>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-yellow-700">猜对者: {selectedFigure.guessedBy}</div>
                <div className="text-sm text-yellow-700">提问数: {selectedFigure.questionCount}</div>
              </div>
              <button
                onClick={() => setSelectedFigure(null)}
                className="w-full bg-yellow-400 text-yellow-900 font-bold py-2 rounded hover:bg-yellow-500 transition"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
