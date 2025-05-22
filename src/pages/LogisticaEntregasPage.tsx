import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Truck, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';


// Tipos de dados
interface Entrega {
  id: number;
  pedido_id: number;
  data_entrega: string;
  status: 'Aguardando' | 'Em rota' | 'Entregue' | 'Recusada' | 'Retornada';
  responsavel_id: string;
  rota?: string;
  data_hora_saida?: string;
  data_hora_chegada?: string;
  observacoes?: string;
  
  // Dados relacionados
  pedido?: {
    id: number;
    cliente_nome: string;
  };
  responsavel?: {
    nome: string;
  };
}

const LogisticaEntregasPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    status: '',
    responsavel: '',
    rota: '',
    data: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar entregas
  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const entregasSimuladas: Entrega[] = [
          {
            id: 1,
            pedido_id: 101,
            data_entrega: '2025-05-25',
            status: 'Aguardando',
            responsavel_id: '1',
            rota: 'Zona Sul',
            observacoes: 'Entregar no período da manhã',
            pedido: { id: 101, cliente_nome: 'Maria Silva' },
            responsavel: { nome: 'João Costa' }
          },
          {
            id: 2,
            pedido_id: 102,
            data_entrega: '2025-05-22',
            status: 'Em rota',
            responsavel_id: '2',
            rota: 'Zona Norte',
            data_hora_saida: '2025-05-22T08:30:00',
            pedido: { id: 102, cliente_nome: 'Carlos Santos' },
            responsavel: { nome: 'Ana Oliveira' }
          },
          {
            id: 3,
            pedido_id: 103,
            data_entrega: '2025-05-20',
            status: 'Entregue',
            responsavel_id: '1',
            rota: 'Centro',
            data_hora_saida: '2025-05-20T09:15:00',
            data_hora_chegada: '2025-05-20T11:30:00',
            observacoes: 'Cliente elogiou o produto',
            pedido: { id: 103, cliente_nome: 'Pedro Alves' },
            responsavel: { nome: 'João Costa' }
          },
          {
            id: 4,
            pedido_id: 104,
            data_entrega: '2025-05-18',
            status: 'Recusada',
            responsavel_id: '3',
            rota: 'Zona Oeste',
            data_hora_saida: '2025-05-18T14:00:00',
            data_hora_chegada: '2025-05-18T16:45:00',
            observacoes: 'Cliente não estava no local',
            pedido: { id: 104, cliente_nome: 'Lucia Ferreira' },
            responsavel: { nome: 'Roberto Silva' }
          },
          {
            id: 5,
            pedido_id: 105,
            data_entrega: '2025-05-15',
            status: 'Retornada',
            responsavel_id: '2',
            rota: 'Zona Leste',
            data_hora_saida: '2025-05-15T10:00:00',
            data_hora_chegada: '2025-05-15T12:30:00',
            observacoes: 'Endereço incorreto',
            pedido: { id: 105, cliente_nome: 'Fernanda Lima' },
            responsavel: { nome: 'Ana Oliveira' }
          }
        ];
        
        setEntregas(entregasSimuladas);
      } catch (error) {
        console.error('Erro ao buscar entregas:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntregas();
  }, []);
  
  // Filtrar entregas
  const entregasFiltered = entregas.filter(entrega => {
    // Filtro por status
    if (filtro.status && entrega.status !== filtro.status) {
      return false;
    }
    
    // Filtro por responsável
    if (filtro.responsavel && entrega.responsavel_id !== filtro.responsavel) {
      return false;
    }
    
    // Filtro por rota
    if (filtro.rota && entrega.rota !== filtro.rota) {
      return false;
    }
    
    // Filtro por data
    if (filtro.data) {
      const dataEntrega = new Date(entrega.data_entrega);
      const dataFiltro = new Date(filtro.data);
      
      if (
        dataEntrega.getDate() !== dataFiltro.getDate() ||
        dataEntrega.getMonth() !== dataFiltro.getMonth() ||
        dataEntrega.getFullYear() !== dataFiltro.getFullYear()
      ) {
        return false;
      }
    }
    
    // Filtro por busca (cliente ou observações)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const clienteMatch = entrega.pedido?.cliente_nome.toLowerCase().includes(termoBusca);
      const observacoesMatch = entrega.observacoes?.toLowerCase().includes(termoBusca);
      const idMatch = entrega.id.toString().includes(termoBusca) || entrega.pedido_id.toString().includes(termoBusca);
      
      if (!clienteMatch && !observacoesMatch && !idMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  // Formatar data e hora
  const formatarDataHora = (dataHoraString?: string) => {
    if (!dataHoraString) return '-';
    
    const dataHora = new Date(dataHoraString);
    return dataHora.toLocaleString('pt-BR');
  };
  
  // Atualizar status da entrega
  const atualizarStatus = async (id: number, novoStatus: Entrega['status']) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('entregas')
      //   .update({ status: novoStatus })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const entregasAtualizadas = entregas.map(e => {
        if (e.id === id) {
          const entregaAtualizada = { ...e, status: novoStatus };
          
          // Atualizar data_hora_saida se status for "Em rota"
          if (novoStatus === 'Em rota' && !e.data_hora_saida) {
            entregaAtualizada.data_hora_saida = new Date().toISOString();
          }
          
          // Atualizar data_hora_chegada se status for "Entregue", "Recusada" ou "Retornada"
          if (['Entregue', 'Recusada', 'Retornada'].includes(novoStatus) && !e.data_hora_chegada) {
            entregaAtualizada.data_hora_chegada = new Date().toISOString();
          }
          
          return entregaAtualizada;
        }
        
        return e;
      });
      
      setEntregas(entregasAtualizadas);
      
      console.log(`Entrega ${id} atualizada para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status da entrega:', error);
    }
  };
  
  // Excluir entrega
  const excluirEntrega = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('entregas')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const entregasAtualizadas = entregas.filter(e => e.id !== id);
      
      setEntregas(entregasAtualizadas);
      
      console.log(`Entrega ${id} excluída`);
    } catch (error) {
      console.error('Erro ao excluir entrega:', error);
    }
  };
  
  // Renderizar ícone de status
  const renderIconeStatus = (status: Entrega['status']) => {
    switch (status) {
      case 'Aguardando':
        return <Clock size={18} className="text-yellow-500" />;
      case 'Em rota':
        return <Truck size={18} className="text-blue-500" />;
      case 'Entregue':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'Recusada':
        return <XCircle size={18} className="text-red-500" />;
      case 'Retornada':
        return <AlertTriangle size={18} className="text-orange-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Entregas</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar cliente ou observações..."
                  value={filtro.busca}
                  onChange={(e) => setFiltro(prev => ({ ...prev, busca: e.target.value }))}
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFiltros(!showFiltros)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              <Button size="sm">
                <Plus size={18} className="mr-1" />
                Nova Entrega
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.status}
                    onChange={(e) => setFiltro(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="Aguardando">Aguardando</option>
                    <option value="Em rota">Em rota</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Recusada">Recusada</option>
                    <option value="Retornada">Retornada</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsável
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.responsavel}
                    onChange={(e) => setFiltro(prev => ({ ...prev, responsavel: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="1">João Costa</option>
                    <option value="2">Ana Oliveira</option>
                    <option value="3">Roberto Silva</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rota
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.rota}
                    onChange={(e) => setFiltro(prev => ({ ...prev, rota: e.target.value }))}
                  >
                    <option value="">Todas</option>
                    <option value="Zona Sul">Zona Sul</option>
                    <option value="Zona Norte">Zona Norte</option>
                    <option value="Centro">Centro</option>
                    <option value="Zona Oeste">Zona Oeste</option>
                    <option value="Zona Leste">Zona Leste</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.data}
                    onChange={(e) => setFiltro(prev => ({ ...prev, data: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ status: '', responsavel: '', rota: '', data: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando entregas...</div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Responsável
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rota
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entregasFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma entrega encontrada
                    </td>
                  </tr>
                ) : (
                  entregasFiltered.map((entrega) => (
                    <tr key={entrega.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{entrega.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{entrega.pedido_id} - {entrega.pedido?.cliente_nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(entrega.data_entrega)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entrega.responsavel?.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entrega.rota || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderIconeStatus(entrega.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            entrega.status === 'Entregue' 
                              ? 'bg-green-100 text-green-800' 
                              : entrega.status === 'Recusada' || entrega.status === 'Retornada'
                                ? 'bg-red-100 text-red-800'
                                : entrega.status === 'Em rota'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {entrega.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <FileText size={18} />
                          </button>
                          
                          {entrega.status === 'Aguardando' && (
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Iniciar rota"
                              onClick={() => atualizarStatus(entrega.id, 'Em rota')}
                            >
                              <Truck size={18} />
                            </button>
                          )}
                          
                          {entrega.status === 'Em rota' && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Marcar como entregue"
                                onClick={() => atualizarStatus(entrega.id, 'Entregue')}
                              >
                                <CheckCircle size={18} />
                              </button>
                              
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Marcar como recusada"
                                onClick={() => atualizarStatus(entrega.id, 'Recusada')}
                              >
                                <XCircle size={18} />
                              </button>
                              
                              <button
                                className="text-orange-600 hover:text-orange-900"
                                title="Marcar como retornada"
                                onClick={() => atualizarStatus(entrega.id, 'Retornada')}
                              >
                                <AlertTriangle size={18} />
                              </button>
                            </>
                          )}
                          
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                            onClick={() => excluirEntrega(entrega.id)}
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
        )}
      </div>
    </div>
  );
};

export default LogisticaEntregasPage;
