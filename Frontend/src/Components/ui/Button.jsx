import React from "react";

export default function GradientButton({
  children,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-4
        rounded-xl
        font-medium
        text-white
        transition
        hover:opacity-90
        whitespace-nowrap
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        background:
          "linear-gradient(90deg, var(--primary), var(--accent))",
        boxShadow: "0 0 40px rgba(59,130,246,0.35)",
      }}
    >
      {children}
    </button>
  );
}