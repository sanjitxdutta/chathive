import React, { useEffect, useRef } from "react";
import Message from "./Message";
import type { ChatMessage } from "../types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  selfName?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, selfName }) => {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="px-2 sm:px-3 py-3">
      {messages.map((m) => (
        <Message key={m.id} msg={m} selfName={selfName} />
      ))}
      <div ref={endRef} />
    </div>
  );

};

export default MessageList;
