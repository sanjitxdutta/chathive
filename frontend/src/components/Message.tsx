import React from "react";
import { useTheme } from "../context/ThemeContext";
import type { ChatMessage } from "../types/chat";

interface Props {
  msg: ChatMessage;
  selfName?: string;
}

const Message: React.FC<Props> = ({ msg, selfName }) => {
  const { theme } = useTheme();
  const isSelf = msg.kind === "message" && msg.sender === selfName;

  if (msg.kind !== "message") {
    return (
      <div className="text-center my-2 text-xs">
        <span className={theme === "light" ? "text-gray-500" : "text-gray-400"}>
          • {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex mb-2 ${isSelf ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative px-3 py-2 rounded-2xl text-sm shadow-md max-w-[75%] sm:max-w-[60%] break-words
        ${isSelf ? "bg-[#FFC107] text-black" : theme === "light"
            ? "bg-[#FFF9E6] text-[#3b2f00]"
            : "bg-[#2a2a1e] text-[#f5e9c6]"}`}
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
