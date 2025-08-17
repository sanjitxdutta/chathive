import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import Input from "../components/Input";
import Button from "../components/Button";
import MessageList from "../components/MessageList";
import { useTheme } from "../context/ThemeContext";
import { useChatRoom } from "../hooks/useChatRoom";
import { Send, Home } from "lucide-react";

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
      className="h-dvh flex flex-col"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
      }}
    >

      <div
        className="flex-none max-w-5xl w-full mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between border-b"
        style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
      >

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link to="/">
            <Button variant="ghost">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </Link>

          <div className="flex flex-col justify-center min-w-0">
            <div className="text-[10px] sm:text-xs opacity-70 whitespace-nowrap">
              Room
            </div>
            <div className="font-mono font-semibold text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">
              {roomId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[160px] text-right sm:text-left">
            {name ? (
              <>

                <span className="block ont-semibold sm:hidden">
                  You
                  <br />
                  {name}
                </span>

                <span className="hidden sm:inline">You: {name}</span>
              </>
            ) : (
              "Assigning name..."
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto max-w-5xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <MessageList messages={messages} selfName={name} />
      </div>

      <div
        className="flex-none max-w-5xl w-full mx-auto px-4 sm:px-6 py-2 border-t flex items-center gap-2"
        style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
      >
        <Input
          className="flex-1 h-10 sm:h-12 text-sm sm:text-base"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSend()}
        />

        <Button
          onClick={doSend}
          className="hidden sm:flex h-10 sm:h-12 px-4 sm:px-6 items-center justify-center text-sm"
        >
          Send
        </Button>

        <button
          onClick={doSend}
          className="sm:hidden h-10 px-3 flex items-center justify-center rounded-xl bg-black text-white dark:bg-[#FFC107] dark:text-black hover:opacity-90 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );

};

export default ChatRoom;
