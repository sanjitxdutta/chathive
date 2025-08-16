import React from "react";
import { useTheme } from "../context/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const { theme } = useTheme();

    const baseStyles =
      "w-full rounded-2xl px-3 py-2 text-sm focus:outline-none transition";

    const themeStyles =
      theme === "light"
        ? "bg-white border border-black text-black focus:ring-2 focus:ring-[#FFC107]"
        : "bg-[#121212] border border-[#FFC107] text-white focus:ring-2 focus:ring-[#FFC107]";

    return (
      <label className="w-full block">
        {label && (
          <div className="mb-1 text-sm text-gray-600 dark:text-gray-300">
            {label}
          </div>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${themeStyles} ${className}`}
          {...props}
        />
        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      </label>
    );
  }
);

Input.displayName = "Input";
export default Input;
