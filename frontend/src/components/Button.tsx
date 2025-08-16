import React from "react";
import { useTheme } from "../context/ThemeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
  const { theme } = useTheme();

  const baseStyles =
    "px-4 py-2 rounded-2xl text-sm font-medium transition shadow focus:outline-none";

  const themeStyles =
    variant === "primary"
      ? theme === "light"
        ? "bg-black text-white hover:bg-[#333]"
        : "bg-[#FFC107] text-black hover:bg-[#e0a800]"
      : theme === "light"
      ? "border border-black text-black hover:bg-[#FFC107] hover:text-black"
      : "border border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black";

  return <button className={`${baseStyles} ${themeStyles} ${className}`} {...props} />;
};

export default Button;
