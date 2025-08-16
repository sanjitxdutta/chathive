import React from "react";
import { useTheme } from "../context/ThemeContext";
import Button from "./Button";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="w-5 h-5" />
          <span className="hidden sm:inline">Dark</span>
        </>
      ) : (
        <>
          <Sun className="w-5 h-5" />
          <span className="hidden sm:inline">Light</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggle;
