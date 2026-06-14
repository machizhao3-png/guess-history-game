'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store';

interface ResultModalProps {
  guesser: string;
  onClose: () => void;
}

export function ResultModal({ guesser, onClose }: ResultModalProps) {
  const router = useRouter();
  const { setGameId } = useGameStore();

  const handleContinue = async () => {
    try {
      const res = await fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname: guesser,
          avatar: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).avatar : '😀',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setGameId(data.gameId);
        router.push('/game');
      }
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const handleHome = () => {
    onClose();
    router.push('/');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-yellow-50 rounded-lg p-8 max-w-sm w-full shadow-xl text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-yellow-900 mb-4">{guesser} 猜对了！</h2>
        <p className="text-yellow-700 mb-6">恭喜！你成功猜出了人物。</p>

        <div className="space-y-3">
          <button
            onClick={handleContinue}
            className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 rounded hover:bg-yellow-500 transition"
          >
            再猜一个
          </button>
          <button
            onClick={handleHome}
            className="w-full bg-yellow-200 text-yellow-900 font-bold py-3 rounded hover:bg-yellow-300 transition"
          >
            返回主页
          </button>
        </div>
      </div>
    </div>
  );
}
