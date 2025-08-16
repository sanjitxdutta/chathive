import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [roomId, setRoomId] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [copied, setCopied] = useState(false);
  const [joinErr, setJoinErr] = useState("");

  const generateRoom = () => {
    const id = crypto.randomUUID().slice(0, 8).toUpperCase();
    setGeneratedId(id);
    setRoomId(id);
    setCopied(false);
  };

  const copyId = async () => {
    if (!generatedId) return;
    await navigator.clipboard.writeText(generatedId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const doJoin = (id: string) => {
    const v = id.trim().toUpperCase();
    if (!v) {
      setJoinErr("Please enter a room ID");
      return;
    }
    setJoinErr("");
    navigate(`/room/${v}`);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme === "light" ? "#ffffff" : "#121212",
        color: theme === "light" ? "#000000" : "#ffffff",
      }}
    >
      {/* Top bar */}
      <header className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight">ChatHive</div>
        <ThemeToggle />
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 mt-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Left: Copy + Generate */}
          <div className="rounded-2xl border shadow-sm p-6"
            style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}>
            <h2 className="text-xl font-semibold mb-2">Create a new room</h2>
            <p className="text-sm opacity-80 mb-4">
              Generate a room and share the ID with others to start chatting instantly.
            </p>

            <div className="flex gap-2">
              <Button onClick={generateRoom}>Generate Room</Button>
              <Button onClick={copyId} variant="secondary" disabled={!generatedId}>
                {copied ? "Copied" : "Copy ID"}
              </Button>
            </div>

            {generatedId && (
              <div className="mt-4">
                <div className="text-xs opacity-70 mb-1">Room ID</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm px-3 py-2 rounded-2xl"
                    style={{
                      backgroundColor: theme === "light" ? "#f5f5f5" : "#1e1e1e",
                      border: theme === "light" ? "1px solid #e5e5e5" : "1px solid #333"
                    }}>
                    {generatedId}
                  </span>
                  <Button variant="primary" onClick={() => doJoin(generatedId)}>Join</Button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Join existing */}
          <div className="rounded-2xl border shadow-sm p-6"
            style={{ borderColor: theme === "light" ? "#e5e5e5" : "#1f1f1f" }}>
            <h2 className="text-xl font-semibold mb-2">Join an existing room</h2>
            <p className="text-sm opacity-80 mb-4">Enter a room ID you’ve been given.</p>

            <div className="flex flex-col gap-3">
              <Input
                placeholder="e.g. 8CHARID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doJoin(roomId)}
                error={joinErr}
              />
              <Button onClick={() => doJoin(roomId)}>Join Room</Button>
            </div>

            {/* How it works */}
            <div className="mt-6 text-sm">
              <div className="font-semibold mb-1">How it works</div>
              <ul className="list-disc ml-5 space-y-1 opacity-80">
                <li>Anonymous — your name is assigned by the server.</li>
                <li>No history — only messages after you join are shown.</li>
                <li>Real-time — messages & join/leave notifications stream live.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroPage;
