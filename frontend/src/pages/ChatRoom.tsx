import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Input from "../components/Input";
import Button from "../components/Button";
import MessageList from "../components/MessageList";
import { useTheme } from "../context/ThemeContext";
import { useChatRoom } from "../hooks/useChatRoom";
import { Send } from "lucide-react";

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

      <div
        className="max-w-5xl w-full mx-auto px-6 py-4 flex items-center justify-between border-b"
        style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
      >
        <div>
          <div className="text-xs opacity-70">Room</div>
          <div className="font-mono font-semibold">{roomId}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            {name ? `You: ${name}` : "Assigning name..."}
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col gap-0 px-6 py-4">
        <div
          className="flex-1 rounded-2xl border shadow-sm flex flex-col"
          style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
        >
          <MessageList messages={messages} selfName={name} />
          <div
            className="p-3 border-t flex items-center gap-2 w-full"
            style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
          >

            <Input
              className="flex-1 h-12 text-base"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSend()}
            />

            <Button
              onClick={doSend}
              className="hidden sm:block h-12 px-6 flex items-center justify-center"
            >
              Send
            </Button>

            <button
              onClick={doSend}
              className="sm:hidden h-12 px-4 flex items-center justify-center rounded-xl bg-black text-white dark:bg-[#FFC107] dark:text-black hover:opacity-90 transition"
            >
              <Send size={18} />
            </button>

          </div>
        </div>

        <div className="mt-4">
          <Link
            to="/"
            className={`inline-block text-sm px-4 py-2 rounded-lg border transition hover:shadow-sm hover:-translate-y-0.5
              ${theme === "light"
                ? "hover:bg-gray-50 text-gray-700"
                : "hover:bg-gray-800 text-gray-300"
              }`}
            style={{
              borderColor: theme === "light" ? "#e5e5e5" : "#2a2a2a",
            }}
          >
            ← Back to Home
          </Link>

        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
