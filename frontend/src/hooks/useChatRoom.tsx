import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../types/chat";

type Inbound =
    | { type: "welcome"; name: string }
    | { type: "message"; sender: string; text: string; ts?: number }
    | { type: "join"; name: string }
    | { type: "leave"; name: string }
    | { type: "system"; text: string }
    // Fallbacks some backends use:
    | { event?: "join" | "leave"; user?: string; message?: string; name?: string; text?: string; at?: number; sender?: string };

type Outbound = { type: "message"; text: string };

const WS_URL = (import.meta as any).env?.VITE_WS_URL || "ws://localhost:8080/ws";

export function useChatRoom(roomId: string) {
    const [name, setName] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const wsRef = useRef<WebSocket | null>(null);
    const connectedOnce = useRef(false);

    useEffect(() => {
        if (!roomId || connectedOnce.current) return;
        connectedOnce.current = true;

        const url = new URL(WS_URL);
        url.searchParams.set("roomId", roomId);
        const ws = new WebSocket(url);
        wsRef.current = ws;

        const push = (m: ChatMessage) => setMessages((prev) => [...prev, m]);

        ws.onopen = () => {
            push({ id: crypto.randomUUID(), kind: "system", text: `Connected to room ${roomId}`, ts: Date.now() });
        };

        ws.onmessage = (ev) => {
            try {
                const raw: Inbound = JSON.parse(ev.data as string);

                // Normalize various inbound shapes to ChatMessage
                if ((raw as any).type === "welcome" && (raw as any).name) {
                    const n = (raw as any).name as string;
                    setName(n);
                    push({ id: crypto.randomUUID(), kind: "join", text: `${n} joined`, ts: Date.now() });
                    return;
                }

                if ((raw as any).type === "message") {
                    const { sender, text, ts } = raw as any;
                    push({ id: crypto.randomUUID(), kind: "message", sender, text, ts: ts || Date.now() });
                    return;
                }

                if ((raw as any).type === "join" && (raw as any).name) {
                    const n = (raw as any).name as string;
                    push({ id: crypto.randomUUID(), kind: "join", text: `${n} joined`, ts: Date.now() });
                    return;
                }

                if ((raw as any).type === "leave" && (raw as any).name) {
                    const n = (raw as any).name as string;
                    push({ id: crypto.randomUUID(), kind: "leave", text: `${n} left`, ts: Date.now() });
                    return;
                }

                if ((raw as any).type === "system" && (raw as any).text) {
                    push({ id: crypto.randomUUID(), kind: "system", text: (raw as any).text, ts: Date.now() });
                    return;
                }

                // Fallback patterns
                const event = (raw as any).event;
                const user = (raw as any).user || (raw as any).name || (raw as any).sender;
                const text = (raw as any).text || (raw as any).message;
                const at = (raw as any).at;

                if (event === "join" && user) {
                    if (!name) setName(user); // if backend uses join to assign
                    push({ id: crypto.randomUUID(), kind: "join", text: `${user} joined`, ts: Date.now() });
                    return;
                }

                if (event === "leave" && user) {
                    push({ id: crypto.randomUUID(), kind: "leave", text: `${user} left`, ts: Date.now() });
                    return;
                }

                if (text && user) {
                    push({ id: crypto.randomUUID(), kind: "message", sender: user, text, ts: at || Date.now() });
                    return;
                }

                // Unknown shape → show raw
                push({ id: crypto.randomUUID(), kind: "system", text: `Unknown event: ${ev.data}`, ts: Date.now() });
            } catch (e) {
                push({ id: crypto.randomUUID(), kind: "system", text: "Malformed server message", ts: Date.now() });
                console.error("Bad WS message", e);
            }
        };

        ws.onclose = () => {
            push({ id: crypto.randomUUID(), kind: "system", text: "Disconnected", ts: Date.now() });
        };

        return () => {
            ws.close();
        };
    }, [roomId, name]);

    const send = useCallback((text: string) => {
        const trimmed = text.trim();
        if (!trimmed || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        const out: Outbound = { type: "message", text: trimmed };
        wsRef.current.send(JSON.stringify(out));
    }, []);

    return { name, messages, send };
}
