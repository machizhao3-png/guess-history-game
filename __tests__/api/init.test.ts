import { POST } from '@/app/api/init/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      create: jest.fn(),
    },
  },
}));

jest.mock('@/lib/ai', () => ({
  generatePerson: jest.fn().mockResolvedValue('秦始皇'),
}));

jest.mock('@/lib/game-state', () => ({
  startNewGame: jest.fn().mockResolvedValue({
    gameId: 'test-game-123',
    currentPerson: '秦始皇',
    questionCount: 0,
    isEnded: false,
  }),
  updatePersonName: jest.fn(),
}));

describe('/api/init', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create user and game on POST', async () => {
    const mockUser = {
      id: 'user-123',
      nickname: 'Test Player',
      avatar: '😎',
      createdAt: new Date(),
    };

    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/init', {
      method: 'POST',
      body: JSON.stringify({
        nickname: 'Test Player',
        avatar: '😎',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.userId).toBe('user-123');
    expect(data.gameId).toBe('test-game-123');
  });

  it('should return 400 if nickname or avatar is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/init', {
      method: 'POST',
      body: JSON.stringify({
        nickname: 'Test Player',
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
