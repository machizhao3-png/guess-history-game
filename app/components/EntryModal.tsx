'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';

const EMOJIS = ['😀', '😎', '🤓', '😍', '🥳', '😸', '🐶', '🐰', '🦁', '🐯', '🦊', '🐻', '🐼', '🐨', '🦊', '🐢', '🦅', '🦋', '🌟', '✨'];

export function EntryModal() {
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, setUser, setGameId } = useGameStore();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData.nickname, userData.avatar);
    }
  }, []);

  if (user.nickname) return null;

  const handleConfirm = async () => {
    if (!nickname.trim() || !avatar) return;

    setLoading(true);
    try {
      const res = await fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatar }),
      });

      const data = await res.json();
      if (data.success) {
        setUser(nickname, avatar);
        setGameId(data.gameId);
        localStorage.setItem('user', JSON.stringify({ nickname, avatar }));
      }
    } catch (error) {
      console.error('Init error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-yellow-50 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6 text-yellow-900">欢迎加入</h1>

        <div className="mb-6">
          <p className="text-sm text-yellow-700 mb-3">选择你的头像</p>
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                className={`text-3xl p-2 rounded transition ${
                  avatar === emoji
                    ? 'bg-yellow-300 scale-110'
                    : 'hover:bg-yellow-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm text-yellow-700 mb-2 block">昵称 (2-8 字)</label>
          <input
            type="text"
            maxLength={8}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="输入昵称"
            className="w-full px-3 py-2 border-2 border-yellow-200 rounded focus:border-yellow-400 focus:outline-none"
          />
        </div>

        <button
          onClick={handleConfirm}
          disabled={!nickname.trim() || !avatar || loading}
          className="w-full bg-yellow-400 text-yellow-900 font-bold py-2 rounded hover:bg-yellow-500 disabled:opacity-50 transition"
        >
          {loading ? '加载中...' : '进入游戏'}
        </button>
      </div>
    </div>
  );
}
