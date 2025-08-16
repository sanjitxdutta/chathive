import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeroPage from "./pages/HeroPage";
import ChatRoom from "./pages/ChatRoom";
import { ThemeProvider } from "./context/ThemeContext";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/room/:roomId" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
