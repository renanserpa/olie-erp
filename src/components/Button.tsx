/*
 * Button.tsx – componente reutilizável
 * -----------------------------------------------------------
 * • Tailwind puro (sem tokens custom) para funcionar em qualquer setup
 * • forwardRef para compatibilidade com react-hook-form
 * • Variantes: primary, secondary, outline, danger, ghost
 * • Tamanhos: sm, md, lg  +  fullWidth
 * • Estado loading (spinner inline SVG)
 */

import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

/** Spinner simples (Tailwind) */
const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin text-current"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      fill="currentColor"
    />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    /* ---------- classes utilitárias ---------- */
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:cursor-not-allowed";

    const variantClasses: Record<Required<ButtonProps>["variant"], string> = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-emerald-600 text-white hover:bg-emerald-700",
      outline:
        "border border-blue-600 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20",
      danger: "bg-red-600 text-white hover:bg-red-700",
      ghost: "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20",
    };

    const sizeClasses: Record<Required<ButtonProps>["size"], string> = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const width = fullWidth ? "w-full" : "";

    /* ---------- render ---------- */
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[base, variantClasses[variant], sizeClasses[size], width, className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading && <Spinner />}
        {loading ? <span className="ml-2">Aguarde…</span> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
