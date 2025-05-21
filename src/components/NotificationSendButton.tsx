import React from 'react';
import { Send } from 'lucide-react';

interface NotificationSendButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const NotificationSendButton: React.FC<NotificationSendButtonProps> = ({ 
  onClick, 
  disabled = false,
  children 
}) => {
  return (
    <button 
      className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <Send size={18} className="mr-2" />
      {children || 'Enviar Notificação'}
    </button>
  );
};

export default NotificationSendButton;
