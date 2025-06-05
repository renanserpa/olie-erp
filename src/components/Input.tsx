/*
 * Input.tsx
 * -----------------------------------------------------------
 * Campo de texto reutilizável com suporte a máscara (InputMask)
 * -----------------------------------------------------------
 * ✔ Utiliza Tailwind padrão (sem tokens custom)
 * ✔ Tipagem forte (extends InputHTMLAttributes)
 * ✔ Estado de erro, fullWidth e required *
 */

import React from "react";
import InputMask from "react-input-mask";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  mask?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  mask,
  fullWidth = true,
  className = "",
  id,
  ...props
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  /* ---------- classes ---------- */
  const inputClasses = [
    "block px-3 py-2 rounded-md bg-white shadow-sm w-full",
    error ? "border-red-500" : "border-gray-300",
    "border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={["mb-4", fullWidth ? "w-full" : ""].join(" ")}>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
        {props.required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {mask ? (
        <InputMask id={inputId} mask={mask} className={inputClasses} {...props} />
      ) : (
        <input id={inputId} className={inputClasses} {...props} />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;