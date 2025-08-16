import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Input from "../components/Input";
import Button from "../components/Button";
import MessageList from "../components/MessageList";
import { useTheme } from "../context/ThemeContext";
import { useChatRoom } from "../hooks/useChatRoom";

const ChatRoom: React.FC = () => {
  const { roomId = "" } = useParams();
  const { theme } = useTheme();
  const { name, messages, send } = useChatRoom(roomId);
  const [text, setText] = useState("");

  const doSend = () => {
    if (!text.trim()) return;
    send(text);
    setText("");
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
      }}
    >
      {/* Header */}
      <div className="max-w-5xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b"
        style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}>
        <div>
          <div className="text-xs opacity-70">Room</div>
          <div className="font-mono font-semibold">{roomId}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm">{name ? `You: ${name}` : "Assigning name..."}</div>
          <ThemeToggle />
        </div>
      </div>

      {/* Messages + Input */}
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col gap-0 px-6 py-4">
        <div className="flex-1 rounded-2xl border shadow-sm flex flex-col"
          style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}>
          <MessageList messages={messages} selfName={name} />
          <div className="p-3 border-t flex gap-2"
            style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}>
            <Input
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSend()}
            />
            <Button onClick={doSend}>Send</Button>
          </div>
        </div>

        <div className="mt-4 text-sm opacity-80">
          <Link to="/" className="underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
