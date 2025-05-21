import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertTriangle, Info, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';

export interface Notification {
  id: number;
  tipo: 'aviso' | 'alerta' | 'lembrete' | 'tarefa';
  mensagem: string;
  origem: string;
  data_hora: string;
  status: 'nova' | 'lida' | 'resolvida';
  usuario_id: string;
  prioridade: 'baixa' | 'normal' | 'alta';
}

interface NotificationDropdownProps {
  userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Buscar notificações do usuário
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notificacoes')
          .select('*')
          .eq('usuario_id', userId)
          .order('data_hora', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        if (data) {
          setNotifications(data as Notification[]);
          setUnreadCount(data.filter(n => n.status === 'nova').length);
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    };
    
    fetchNotifications();
    
    // Configurar subscription para notificações em tempo real
    const subscription = supabase
      .channel('notificacoes_changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notificacoes',
        filter: `usuario_id=eq.${userId}`
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
        if ((payload.new as Notification).status === 'nova') {
          setUnreadCount(prev => prev + 1);
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  // Marcar notificação como lida
  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ status: 'lida' })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'lida' } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };
  
  // Marcar notificação como resolvida
  const markAsResolved = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .update({ status: 'resolvida' })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'resolvida' } : n)
      );
      if (notifications.find(n => n.id === id)?.status === 'nova') {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Erro ao marcar notificação como resolvida:', error);
    }
  };
  
  // Excluir notificação
  const deleteNotification = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notificacoes')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      const notificationToRemove = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (notificationToRemove?.status === 'nova') {
        setUnreadCount(prev => prev - 1);
      }
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };
  
  // Renderizar ícone baseado no tipo de notificação
  const renderIcon = (tipo: string, prioridade: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle size={18} className="text-red-500" />;
      case 'aviso':
        return <Info size={18} className="text-blue-500" />;
      case 'lembrete':
        return <Clock size={18} className="text-yellow-500" />;
      case 'tarefa':
        return <Check size={18} className="text-green-500" />;
      default:
        return <Info size={18} className="text-gray-500" />;
    }
  };
  
  // Formatar data para exibição
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="relative">
      {/* Badge de notificação */}
      <button 
        className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} className="text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Dropdown de notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700">Notificações</h3>
            <button 
              className="text-xs text-secondary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              Fechar
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                Nenhuma notificação encontrada
              </div>
            ) : (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                    notification.status === 'nova' ? 'bg-blue-50' : ''
                  } ${
                    notification.prioridade === 'alta' ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      {renderIcon(notification.tipo, notification.prioridade)}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {notification.mensagem}
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">{notification.origem}</span> • {formatDate(notification.data_hora)}
                        </div>
                        <div className="flex space-x-1">
                          {notification.status === 'nova' && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Marcar como lida
                            </button>
                          )}
                          <button 
                            onClick={() => markAsResolved(notification.id)}
                            className="text-xs text-green-600 hover:text-green-800"
                          >
                            Resolver
                          </button>
                          <button 
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-gray-200 text-center">
            <button 
              className="text-xs text-secondary hover:underline"
              onClick={() => window.location.href = '/notificacoes'}
            >
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
