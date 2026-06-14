export function initWebSocket(onMessage: (data: any) => void) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`);

  ws.onopen = () => {
    console.log('[WS] Connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('[WS] Parse error:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('[WS] Error:', error);
  };

  ws.onclose = () => {
    console.log('[WS] Disconnected');
  };

  return ws;
}
