export async function initGame(nickname: string, avatar: string) {
  const res = await fetch('/api/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nickname, avatar }),
  });
  return res.json();
}

export async function getGameState(gameId: string) {
  const res = await fetch(`/api/game/state?gameId=${gameId}`);
  return res.json();
}

export async function submitQuestion(gameId: string, userId: string, question: string, userNickname: string, userAvatar: string) {
  const res = await fetch('/api/question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ gameId, userId, question, userNickname, userAvatar }),
  });
  return res.json();
}

export async function getHistory() {
  const res = await fetch('/api/history');
  return res.json();
}
