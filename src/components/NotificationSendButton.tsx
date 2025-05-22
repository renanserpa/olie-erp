/*
 * NotificationSendButton.tsx
 * -----------------------------------------------------------
 * Botão para enviar notificação (usa ícone <Send />)
 * -----------------------------------------------------------
 * ✔ Tailwind padrão (azul como cor principal)
 * ✔ Estado disabled (opacity + cursor)
 */

import React from "react";
import { Send } from "lucide-react";

export interface NotificationSendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  fullWidth?: boolean;
}

const NotificationSendButton: React.FC<NotificationSendButtonProps> = ({
  onClick,
  disabled = false,
  children = "Enviar notificação",
  fullWidth = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        disabled ? "cursor-not-allowed opacity-50" : "bg-blue-600 hover:bg-blue-700"
      } ${fullWidth ? "w-full justify-center" : ""}`}
    >
      <Send size={18} className="mr-2" />
      {children}
    </button>
  );
};

export default NotificationSendButton;
