import { create } from 'zustand';

interface User {
  id: string;
  nickname: string;
  avatar: string;
}

interface Stats {
  totalGuessed: number;
  totalQuestions: number;
}

interface GameStore {
  user: User;
  gameId: string;
  stats: Stats;
  setUser: (id: string, nickname: string, avatar: string) => void;
  setGameId: (gameId: string) => void;
  setStats: (stats: Stats) => void;
  clearUser: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  user: { id: '', nickname: '', avatar: '' },
  gameId: '',
  stats: { totalGuessed: 0, totalQuestions: 0 },

  setUser: (id: string, nickname: string, avatar: string) =>
    set({ user: { id, nickname, avatar } }),

  setGameId: (gameId: string) => set({ gameId }),

  setStats: (stats: Stats) => set({ stats }),

  clearUser: () =>
    set({ user: { id: '', nickname: '', avatar: '' }, gameId: '' }),
}));
