import React from "react";
import { useTheme } from "../context/ThemeContext";

export type MessageKind = "message" | "join" | "leave" | "system";

export interface ChatMessage {
  id: string;
  kind: MessageKind;
  sender?: string;
  text: string;
  ts: number;
}

interface MessageProps {
  msg: ChatMessage;
  selfName?: string;
}

const Message: React.FC<MessageProps> = ({ msg, selfName }) => {
  const { theme } = useTheme();
  const isSelf = msg.kind === "message" && msg.sender === selfName;

  if (msg.kind !== "message") {
    return (
      <div className="text-center my-2 text-xs">
        <span
          className={
            theme === "light"
              ? "text-gray-500"
              : "text-gray-400"
          }
        >
          • {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex mb-2 ${isSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm shadow`}
        style={{
          backgroundColor: isSelf
            ? theme === "light"
              ? "#FFC107"
              : "#FFC107"
            : theme === "light"
            ? "#f5f5f5" 
            : "#1e1e1e", 
          color: isSelf
            ? "#000000"
            : theme === "light"
            ? "#000000"
            : "#ffffff",
        }}
      >
        {!isSelf && (
          <div className="text-[11px] opacity-70 mb-0.5">{msg.sender}</div>
        )}
        <div>{msg.text}</div>
      </div>
    </div>
  );
};

export default Message;
