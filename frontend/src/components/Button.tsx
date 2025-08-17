import React from "react";
import { useTheme } from "../context/ThemeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

const Button: React.FC<ButtonProps> = ({ variant = "primary", className = "", ...props }) => {
  const { theme } = useTheme();

  const base = "h-10 sm:h-10 px-4 rounded-2xl text-sm font-medium transition shadow focus:outline-none cursor-pointer flex items-center justify-center";

  let styles = "";
  if (variant === "primary") {
    styles = theme === "light"
      ? "bg-black text-white hover:bg-[#333]"
      : "bg-[#FFC107] text-black hover:bg-[#e0a800]";
  } else if (variant === "secondary") {
    styles = "bg-[#FFC107] text-black hover:bg-[#e0a800]";
  } else {
    styles = theme === "light"
      ? "border border-black text-black hover:bg-[#FFC107] hover:text-black"
      : "border border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black";
  }

  return <button className={`${base} ${styles} ${className}`} {...props} />;
};

export default Button;
