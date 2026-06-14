import { POST } from '@/app/api/question/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/ai', () => ({
  answerQuestion: jest.fn().mockResolvedValue({
    reply: '是',
    error: undefined,
  }),
  checkGuess: jest.fn().mockResolvedValue(false),
}));

jest.mock('@/lib/game-state', () => ({
  getGameState: jest.fn().mockResolvedValue({
    gameId: 'test-game-123',
    currentPerson: '秦始皇',
    questionCount: 2,
    isEnded: false,
  }),
  addQuestion: jest.fn(),
}));

describe('/api/question', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process question and return AI reply', async () => {
    const mockUser = {
      id: 'user-123',
      nickname: 'Test Player',
      avatar: '😎',
      createdAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/question', {
      method: 'POST',
      body: JSON.stringify({
        gameId: 'test-game-123',
        userId: 'user-123',
        question: '是男性吗？',
        userNickname: 'Test Player',
        userAvatar: '😎',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.aiReply).toBe('是');
    expect(data.isGuessCorrect).toBe(false);
  });

  it('should return 400 if required fields are missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/question', {
      method: 'POST',
      body: JSON.stringify({
        gameId: 'test-game-123',
        userId: 'user-123',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });

  it('should return 500 if ANTHROPIC_API_KEY is not set', async () => {
    const originalEnv = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    const request = new NextRequest('http://localhost:3000/api/question', {
      method: 'POST',
      body: JSON.stringify({
        gameId: 'test-game-123',
        userId: 'user-123',
        question: '是男性吗？',
        userNickname: 'Test Player',
        userAvatar: '😎',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(500);

    process.env.ANTHROPIC_API_KEY = originalEnv;
  });
});
