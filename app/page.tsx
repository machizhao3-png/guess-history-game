'use client';

import { useEffect, useState } from 'react';
import { EntryModal } from './components/EntryModal';
import { HomePage } from './components/HomePage';
import { useGameStore } from '@/lib/store';

export default function Home() {
  const { user } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <EntryModal />
      {user.nickname && <HomePage />}
    </>
  );
}
