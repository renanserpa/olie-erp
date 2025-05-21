import React, { useState, useEffect } from 'react';
import { Bell, Filter, Plus, Check, AlertTriangle, Info, Clock, Trash2, Eye, Archive } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';
import { Notification } from '../components/NotificationDropdown';

const tiposNotificacao = [
  { value: '', label: 'Todos os tipos' },
  { value: 'aviso', label: 'Aviso' },
  { value: 'alerta', label: 'Alerta' },
  { value: 'lembrete', label: 'Lembrete' },
  { value: 'tarefa', label: 'Tarefa' }
];

const origensNotificacao = [
  { value: '', label: 'Todas as origens' },
  { value: 'pedidos', label: 'Pedidos' },
  { value: 'estoque', label: 'Estoque' },
  { value: 'producao', label: 'Produção' },
  { value: 'compras', label: 'Compras' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'sistema', label: 'Sistema' }
];

const statusNotificacao = [
  { value: '', label: 'Todos os status' },
  { value: 'nova', label: 'Nova' },
  { value: 'lida', label: 'Lida' },
  { value: 'resolvida', label: 'Resolvida' }
];

const NotificacoesPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  const userId = '1'; // Simulando ID do usuário logado
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [origemFiltro, setOrigemFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  
  // Modal de detalhes
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  // Buscar notificações do usuário
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('notificacoes')
          .select('*')
          .eq('usuario_id', userId)
          .order('data_hora', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setNotifications(data as Notification[]);
          setFilteredNotifications(data as Notification[]);
        }
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
    
    // Configurar subscription para notificações em tempo real
    const subscription = supabase
      .channel('notificacoes_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'notificacoes',
        filter: `usuario_id=eq.${userId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as Notification, ...prev]);
          applyFilters([payload.new as Notification, ...notifications]);
        } else if (payload.eventType === 'UPDATE') {
          setNotifications(prev => 
            prev.map(n => n.id === payload.new.id ? payload.new as Notification : n)
          );
          applyFilters(notifications.map(n => n.id === payload.new.id ? payload.new as Notification : n));
        } else if (payload.eventType === 'DELETE') {
          setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
          applyFilters(notifications.filter(n => n.id !== payload.old.id));
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  // Aplicar filtros
  const applyFilters = (notificationsToFilter = notifications) => {
    let filtered = [...notificationsToFilter];
    
    if (tipoFiltro) {
      filtered = filtered.filter(n => n.tipo === tipoFiltro);
    }
    
    if (origemFiltro) {
      filtered = filtered.filter(n => n.origem === origemFiltro);
    }
    
    if (statusFiltro) {
      filtered = filtered.filter(n => n.status === statusFiltro);
    }
    
    setFilteredNotifications(filtered);
  };
  
  useEffect(() => {
    applyFilters();
  }, [tipoFiltro, origemFiltro, statusFiltro]);
  
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
      setFilteredNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'lida' } : n)
      );
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
      setFilteredNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, status: 'resolvida' } : n)
      );
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
      
      setNotifications(prev => prev.filter(n => n.id !== id));
      setFilteredNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Erro ao excluir notificação:', error);
    }
  };
  
  // Renderizar ícone baseado no tipo de notificação
  const renderIcon = (tipo: string) => {
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
  
  // Abrir modal de detalhes
  const openDetailsModal = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
    
    // Se a notificação for nova, marcar como lida
    if (notification.status === 'nova') {
      markAsRead(notification.id);
    }
  };
  
  // Fechar modal de detalhes
  const closeDetailsModal = () => {
    setSelectedNotification(null);
    setShowDetailsModal(false);
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text">Notificações</h1>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              {userProfile === 'Admin' && (
                <Button size="sm">
                  <Plus size={18} className="mr-1" />
                  Nova Notificação
                </Button>
              )}
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold text-text mb-4">Filtrar Notificações</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Tipo
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={tipoFiltro}
                    onChange={(e) => setTipoFiltro(e.target.value)}
                  >
                    {tiposNotificacao.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Origem
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={origemFiltro}
                    onChange={(e) => setOrigemFiltro(e.target.value)}
                  >
                    {origensNotificacao.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Status
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={statusFiltro}
                    onChange={(e) => setStatusFiltro(e.target.value)}
                  >
                    {statusNotificacao.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          {/* Lista de notificações */}
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Tipo</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Mensagem</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Origem</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Data/Hora</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Carregando notificações...
                    </td>
                  </tr>
                ) : filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Nenhuma notificação encontrada
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((notification) => (
                    <tr 
                      key={notification.id} 
                      className={`${notification.status === 'nova' ? 'bg-blue-50' : ''} ${
                        notification.prioridade === 'alta' ? 'border-l-4 border-l-red-500' : ''
                      } hover:bg-gray-50 cursor-pointer`}
                      onClick={() => openDetailsModal(notification)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          {renderIcon(notification.tipo)}
                          <span className="ml-2">
                            {tiposNotificacao.find(t => t.value === notification.tipo)?.label || notification.tipo}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {notification.mensagem}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {origensNotificacao.find(o => o.value === notification.origem)?.label || notification.origem}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formatDate(notification.data_hora)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          notification.status === 'nova' 
                            ? 'bg-blue-100 text-blue-800' 
                            : notification.status === 'lida' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {statusNotificacao.find(s => s.value === notification.status)?.label || notification.status}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailsModal(notification);
                            }}
                          >
                            <Eye size={18} />
                          </button>
                          {notification.status !== 'resolvida' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsResolved(notification.id);
                              }}
                            >
                              <Check size={18} />
                            </button>
                          )}
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal de detalhes da notificação */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {renderIcon(selectedNotification.tipo)}
                  <h3 className="text-lg font-semibold text-gray-900 ml-2">
                    {tiposNotificacao.find(t => t.value === selectedNotification.tipo)?.label || selectedNotification.tipo}
                  </h3>
                </div>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={closeDetailsModal}
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-700 text-base">{selectedNotification.mensagem}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Origem</p>
                    <p className="text-sm font-medium text-gray-900">
                      {origensNotificacao.find(o => o.value === selectedNotification.origem)?.label || selectedNotification.origem}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data/Hora</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedNotification.data_hora)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedNotification.status === 'nova' 
                          ? 'bg-blue-100 text-blue-800' 
                          : selectedNotification.status === 'lida' 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {statusNotificacao.find(s => s.value === selectedNotification.status)?.label || selectedNotification.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prioridade</p>
                    <p className="text-sm font-medium">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedNotification.prioridade === 'alta' 
                          ? 'bg-red-100 text-red-800' 
                          : selectedNotification.prioridade === 'normal' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedNotification.prioridade.charAt(0).toUpperCase() + selectedNotification.prioridade.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                {selectedNotification.status !== 'resolvida' && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      markAsResolved(selectedNotification.id);
                      closeDetailsModal();
                    }}
                  >
                    <Check size={18} className="mr-1" />
                    Marcar como resolvida
                  </Button>
                )}
                <Button
                  variant="danger"
                  onClick={() => {
                    deleteNotification(selectedNotification.id);
                    closeDetailsModal();
                  }}
                >
                  <Trash2 size={18} className="mr-1" />
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificacoesPage;
