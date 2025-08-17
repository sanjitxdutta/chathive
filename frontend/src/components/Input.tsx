import React from "react";
import { useTheme } from "../context/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightSlot?: React.ReactNode;
  onRightSlotClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", rightSlot, onRightSlotClick, ...props }, ref) => {
    const { theme } = useTheme();

    const baseStyles = "w-full h-10 sm:h-12 text-sm sm:text-base rounded-2xl px-3 focus:outline-none transition pr-10";

    const themeStyles =
      theme === "light"
        ? "bg-white text-black border border-gray-200 focus:border-black"
        : "bg-[#0d0d0d] text-white border border-[#232323] focus:border-white";

    return (
      <label className="block text-sm w-full">
        {label && <div className="mb-1 opacity-80">{label}</div>}
        <div className="relative w-full">
          <input
            ref={ref}
            className={`${themeStyles} ${baseStyles} ${className}`}
            {...props}
          />
          {rightSlot && (
            <button
              type="button"
              onClick={onRightSlotClick}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:opacity-80 focus:outline-none"
              aria-label="icon-button"
            >
              {rightSlot}
            </button>
          )}
        </div>
        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      </label>
    );
  }
);

Input.displayName = "Input";

export default Input;
