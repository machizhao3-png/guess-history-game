export interface PollingOptions {
  initialInterval?: number;
  maxInterval?: number;
  maxRetries?: number;
  onError?: (error: Error, retryCount: number) => void;
  onSuccess?: () => void;
}

export function initPolling(
  gameId: string,
  onStateUpdate: (data: any) => void,
  options: PollingOptions = {}
) {
  const {
    initialInterval = 1000,
    maxInterval = 30000,
    maxRetries = 3,
    onError,
    onSuccess,
  } = options;

  let currentInterval = initialInterval;
  let retryCount = 0;
  let isActive = true;
  let timer: NodeJS.Timeout;

  const poll = async () => {
    try {
      const res = await fetch(`/api/game/state?gameId=${gameId}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.error || "Unknown error");
      }

      // 成功：重置间隔和重试计数
      currentInterval = initialInterval;
      retryCount = 0;
      onStateUpdate(data);
      onSuccess?.();
    } catch (error) {
      retryCount++;
      const err = error instanceof Error ? error : new Error(String(error));

      if (retryCount >= maxRetries) {
        console.error("[Poll] Max retries exceeded:", err);
        onError?.(err, retryCount);
        // 继续轮询但使用最大间隔
        currentInterval = maxInterval;
        retryCount = 0;
      } else {
        // 指数退避：1s → 2s → 4s → ...
        currentInterval = Math.min(currentInterval * 2, maxInterval);
        onError?.(err, retryCount);
      }
    }

    if (isActive) {
      timer = setTimeout(poll, currentInterval);
    }
  };

  // 立即执行第一次轮询
  poll();

  // 返回停止函数
  return () => {
    isActive = false;
    clearTimeout(timer);
  };
}
