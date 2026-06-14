'use client';

import { QAPage } from '@/app/components/QAPage';
import { useGameStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePage() {
  const { user, gameId } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (!user.nickname) {
      router.push('/');
    }
  }, [user.nickname, router]);

  if (!user.nickname) {
    return null;
  }

  return <QAPage />;
}
