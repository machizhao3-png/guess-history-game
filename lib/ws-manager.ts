import { WebSocket, WebSocketServer } from "ws";

export interface WSMessage {
  type: "question" | "guess" | "sync" | "state";
  payload: Record<string, unknown>;
}

export class WSManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(wss: WebSocketServer) {
    this.wss = wss;
  }

  addClient(ws: WebSocket) {
    this.clients.add(ws);
    console.log(`[WS] Client connected. Total: ${this.clients.size}`);

    ws.on("close", () => {
      this.clients.delete(ws);
      console.log(`[WS] Client disconnected. Total: ${this.clients.size}`);
    });

    ws.on("error", (err) => {
      console.error("[WS] Error:", err);
      this.clients.delete(ws);
    });
  }

  broadcast(message: WSMessage) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  broadcastExcept(message: WSMessage, excludeWs: WebSocket) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  sendToClient(ws: WebSocket, message: WSMessage) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  }

  getClientCount(): number {
    return this.clients.size;
  }
}

let wsManager: WSManager | null = null;

export function initWSManager(wss: WebSocketServer): WSManager {
  wsManager = new WSManager(wss);
  return wsManager;
}

export function getWSManager(): WSManager {
  if (!wsManager) {
    throw new Error("WSManager not initialized");
  }
  return wsManager;
}
