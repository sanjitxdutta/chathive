import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { Clipboard, ClipboardCheck } from "lucide-react";

const HeroPage: React.FC = () => {
  const HEX_ID = /^[0-9a-f]{4,32}$/i;

  const navigate = useNavigate();
  const { theme } = useTheme();

  const [roomId, setRoomId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinErr, setJoinErr] = useState("");

  const generateId = () => {
    try {
      return crypto.randomUUID().slice(0, 8).toUpperCase();
    } catch {
      return Array.from(crypto.getRandomValues(new Uint8Array(4)))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
    }
  };

  const generateRoom = () => {
    const id = generateId();
    setGeneratedId(id);
    setCopied(false);
  };

  const copyId = async () => {
    if (!generatedId) return;

    try {
      await navigator.clipboard.writeText(generatedId);
      setCopied(true);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = generatedId;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        setCopied(true);
      } catch (error) {
        console.error("Fallback copy failed:", error);
      }

      document.body.removeChild(textArea);
    }

    setTimeout(() => setCopied(false), 1500);
  };


  const doJoin = (id: string) => {
    const v = id.trim();
    if (!v) return setJoinErr("Please enter a room ID");
    if (!HEX_ID.test(v))
      return setJoinErr("Use 4-32 hex characters (0-9, A-F).");
    setJoinErr("");
    navigate(`/room/${v.toUpperCase()}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
      }}
    >

      <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight">
            ChatHive
          </div>
        </a>
        <ThemeToggle />
      </header>

      <section className="max-w-3xl w-full mx-auto px-4 sm:px-6 text-center mt-6 sm:mt-10 mb-6">
        <div className="flex justify-center items-center gap-2 mb-3">
          <img
            src="/logo.png"
            alt="ChatHive Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Welcome to ChatHive
          </h1>
        </div>
        <p className="text-sm sm:text-base lg:text-lg opacity-80 max-w-2xl mx-auto">
          Anonymous & Ephemeral Chatrooms — create a room, share the ID, and
          start chatting instantly. No accounts. No history. Just real-time fun.
        </p>
      </section>

      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 flex flex-col gap-6 mb-8">

        <div
          className="rounded-2xl border shadow-sm p-5 sm:p-6 backdrop-blur-md bg-white/70 dark:bg-white/5"
          style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Create a new room
          </h2>
          <p className="text-sm opacity-80 mb-4">
            Generate a room and share the ID with others to start chatting
            instantly.
          </p>

          <Button onClick={generateRoom} className="w-full sm:w-auto">
            Generate Room
          </Button>

          {generatedId && (
            <div className="mt-4">
              <div className="text-xs opacity-70 mb-1">Room ID</div>
              <div className="flex flex-col gap-3 w-full sm:max-w-xs">
                <Input
                  value={generatedId}
                  readOnly
                  rightSlot={
                    copied ? (
                      <ClipboardCheck className="w-4 h-4" />
                    ) : (
                      <Clipboard className="w-4 h-4" />
                    )
                  }
                  onRightSlotClick={copyId}
                />
                <Button variant="primary" onClick={() => doJoin(generatedId)}>
                  Join
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          className="rounded-2xl border shadow-sm p-5 sm:p-6 backdrop-blur-md bg-white/70 dark:bg-white/5"
          style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
        >
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Join an existing room
          </h2>
          <p className="text-sm opacity-80 mb-4">
            Enter a room ID you’ve been given.
          </p>

          <div className="flex flex-col gap-3 w-full sm:max-w-sm">
            <Input
              placeholder="e.g. A1B2C3D4"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doJoin(roomId)}
              error={joinErr}
            />
            <Button onClick={() => doJoin(roomId)}>Join Room</Button>
          </div>

          <div className="mt-6 text-sm">
            <div className="font-semibold mb-1">How it works</div>
            <ul className="list-disc ml-5 space-y-1 opacity-80 text-xs sm:text-sm">
              <li>Anonymous — your name is assigned by the server.</li>
              <li>No history — only messages after you join are shown.</li>
              <li>Real-time — messages & join/leave notifications stream live.</li>
            </ul>
          </div>
        </div>
      </main>

      <footer
        className="mt-auto w-full py-4 text-center text-xs sm:text-sm opacity-70 border-t"
        style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}
      >
        v1.0.0 © {new Date().getFullYear()} sanjitxdutta. All Rights Reserved.
        <p className="mt-1">Built with ❤️ for quick, private conversations.</p>
      </footer>
    </div>
  );
};

export default HeroPage;
