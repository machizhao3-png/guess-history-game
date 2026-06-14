import { checkGuess } from '@/lib/ai';

describe('lib/ai.ts - checkGuess', () => {
  it('should return true when guess matches person name exactly', async () => {
    const result = await checkGuess('秦始皇', '秦始皇');
    expect(result).toBe(true);
  });

  it('should return true when person name includes guess', async () => {
    const result = await checkGuess('秦始皇', '秦');
    expect(result).toBe(true);
  });

  it('should return true when guess includes person name', async () => {
    const result = await checkGuess('秦', '秦始皇');
    expect(result).toBe(true);
  });

  it('should return false when guess does not match', async () => {
    const result = await checkGuess('秦始皇', '武则天');
    expect(result).toBe(false);
  });

  it('should handle whitespace', async () => {
    const result = await checkGuess('秦始皇', ' 秦始皇 ');
    expect(result).toBe(true);
  });
});
