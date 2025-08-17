import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/chat";

type Inbound =
  | { type: "welcome"; name?: string; payload?: { name?: string } }
  | { type: "chat"; payload?: { sender: string; message: string; ts?: number } }
  | { type: "notification"; payload?: { message: string } }
  | { type: "error"; message: string }
  | {
    type?: "join" | "leave" | "message";
    event?: "join" | "leave";
    user?: string;
    message?: string;
    name?: string;
    text?: string;
    at?: number;
    sender?: string;
  };

// const WS_URL =
//   (import.meta as any)?.env?.VITE_WS_URL ??
//   `${location.protocol === "https:" ? "wss" : "ws"}://${location.hostname}:8080`;

const WS_URL = import.meta.env.VITE_WS_URL as string;

export function useChatRoom(roomId: string) {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const connectedFor = useRef<string | null>(null);

  useEffect(() => {
    if (!roomId) return;
    if (connectedFor.current === roomId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    connectedFor.current = roomId;

    const push = (m: ChatMessage) =>
      setMessages((prev) => [...prev, m]);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { roomId: roomId.toLowerCase() },
        })
      );

      push({
        id: crypto.randomUUID(),
        kind: "system",
        text: `Connected to room ${roomId}`,
        ts: Date.now(),
      });
    };

    ws.onmessage = (ev) => {
      try {
        const raw: Inbound = JSON.parse(ev.data as string);

        if ("type" in raw && raw.type === "error") {
          const msg = (raw as any).message || "Server error";
          push({
            id: crypto.randomUUID(),
            kind: "system",
            text: msg,
            ts: Date.now(),
          });
          return;
        }

        if ("type" in raw && raw.type === "welcome") {
          const n = raw.payload?.name || raw.name;
          if (n) {
            setName(n);
            push({
              id: crypto.randomUUID(),
              kind: "join",
              text: `${n} joined`,
              ts: Date.now(),
            });
          }
          return;
        }

        if ("type" in raw && raw.type === "chat") {
          const p = (raw as any).payload ?? raw;
          if (p?.sender && (p?.message ?? p?.text)) {
            push({
              id: crypto.randomUUID(),
              kind: "message",
              sender: p.sender,
              text: p.message ?? p.text,
              ts: p.ts || Date.now(),
            });
            return;
          }
        }

        if ("type" in raw && raw.type === "notification") {
          const msg =
            (raw as any)?.payload?.message ??
            (raw as any)?.message ??
            (raw as any)?.text;
          if (msg) {
            const lower = msg.toLowerCase();
            const kind =
              lower.includes("has joined")
                ? "join"
                : lower.includes("has left")
                  ? "leave"
                  : "system";
            push({
              id: crypto.randomUUID(),
              kind: kind as any,
              text: msg,
              ts: Date.now(),
            });
            return;
          }
        }

        const event = (raw as any).event;
        const user =
          (raw as any).user || (raw as any).name || (raw as any).sender;
        const text = (raw as any).text || (raw as any).message;
        const at = (raw as any).at;

        if (event === "join" && user) {
          if (!name) setName(user);
          push({
            id: crypto.randomUUID(),
            kind: "join",
            text: `${user} joined`,
            ts: Date.now(),
          });
          return;
        }

        if (event === "leave" && user) {
          push({
            id: crypto.randomUUID(),
            kind: "leave",
            text: `${user} left`,
            ts: Date.now(),
          });
          return;
        }

        if (text && user) {
          push({
            id: crypto.randomUUID(),
            kind: "message",
            sender: user,
            text,
            ts: at || Date.now(),
          });
          return;
        }

        push({
          id: crypto.randomUUID(),
          kind: "system",
          text: `Unknown event: ${ev.data}`,
          ts: Date.now(),
        });
      } catch (e) {
        push({
          id: crypto.randomUUID(),
          kind: "system",
          text: "Malformed server message",
          ts: Date.now(),
        });
        console.error("Bad WS message", e);
      }
    };

    ws.onclose = () => {
      push({
        id: crypto.randomUUID(),
        kind: "system",
        text: "Disconnected",
        ts: Date.now(),
      });
    };

    return () => {
      try {
        ws.close();
      } catch { }
      if (wsRef.current === ws) wsRef.current = null;
      if (connectedFor.current === roomId) connectedFor.current = null;
    };
  }, [roomId]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (
      !trimmed ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    )
      return;
    wsRef.current.send(
      JSON.stringify({
        type: "chat",
        payload: { message: trimmed },
      })
    );
  }, []);

  return { name, messages, send };
}
