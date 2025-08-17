import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HeroPage from "./pages/HeroPage";
import ChatRoom from "./pages/ChatRoom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HeroPage />} />
        <Route path="/room/:roomId" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
