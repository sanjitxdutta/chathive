export type MessageKind = "message" | "join" | "leave" | "system";

export interface ChatMessage {
  id: string;
  kind: MessageKind;
  sender?: string;
  text: string;
  ts: number;
}
