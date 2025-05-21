import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, CheckCircle, XCircle, Clock, AlertTriangle, FileText, Edit, Trash2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

// Tipos de dados
interface SolicitacaoCompra {
  id: number;
  material_id: number;
  quantidade: number;
  solicitante_id: string;
  status: 'Solicitado' | 'Aguardando aprovação' | 'Aprovado' | 'Recusado' | 'Finalizado';
  data_solicitacao: string;
  urgencia: 'Normal' | 'Urgente';
  justificativa?: string;
  
  // Dados relacionados
  material?: {
    nome: string;
    unidade_medida: string;
  };
  solicitante?: {
    nome: string;
  };
}

const ComprasSolicitacoesPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    status: '',
    material: '',
    solicitante: '',
    urgencia: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar solicitações de compra
  useEffect(() => {
    const fetchSolicitacoes = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const solicitacoesSimuladas: SolicitacaoCompra[] = [
          {
            id: 1,
            material_id: 1,
            quantidade: 10,
            solicitante_id: '1',
            status: 'Solicitado',
            data_solicitacao: '2025-05-15T10:30:00',
            urgencia: 'Normal',
            justificativa: 'Estoque baixo para próxima produção',
            material: { nome: 'Tecido Oxford', unidade_medida: 'metro' },
            solicitante: { nome: 'João Costa' }
          },
          {
            id: 2,
            material_id: 2,
            quantidade: 50,
            solicitante_id: '2',
            status: 'Aguardando aprovação',
            data_solicitacao: '2025-05-16T14:20:00',
            urgencia: 'Urgente',
            justificativa: 'Material necessário para pedido prioritário',
            material: { nome: 'Zíper nº 5', unidade_medida: 'unidade' },
            solicitante: { nome: 'Ana Oliveira' }
          },
          {
            id: 3,
            material_id: 3,
            quantidade: 5,
            solicitante_id: '1',
            status: 'Aprovado',
            data_solicitacao: '2025-05-14T09:15:00',
            urgencia: 'Normal',
            justificativa: 'Reposição de estoque',
            material: { nome: 'Linha para costura', unidade_medida: 'rolo' },
            solicitante: { nome: 'João Costa' }
          },
          {
            id: 4,
            material_id: 4,
            quantidade: 20,
            solicitante_id: '3',
            status: 'Recusado',
            data_solicitacao: '2025-05-10T16:45:00',
            urgencia: 'Normal',
            justificativa: 'Novo fornecedor',
            material: { nome: 'Botões decorativos', unidade_medida: 'pacote' },
            solicitante: { nome: 'Roberto Silva' }
          },
          {
            id: 5,
            material_id: 5,
            quantidade: 15,
            solicitante_id: '2',
            status: 'Finalizado',
            data_solicitacao: '2025-05-05T11:30:00',
            urgencia: 'Urgente',
            justificativa: 'Estoque zerado',
            material: { nome: 'Elástico 10mm', unidade_medida: 'metro' },
            solicitante: { nome: 'Ana Oliveira' }
          }
        ];
        
        setSolicitacoes(solicitacoesSimuladas);
      } catch (error) {
        console.error('Erro ao buscar solicitações de compra:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSolicitacoes();
  }, []);
  
  // Filtrar solicitações
  const solicitacoesFiltered = solicitacoes.filter(solicitacao => {
    // Filtro por status
    if (filtro.status && solicitacao.status !== filtro.status) {
      return false;
    }
    
    // Filtro por material
    if (filtro.material && solicitacao.material_id.toString() !== filtro.material) {
      return false;
    }
    
    // Filtro por solicitante
    if (filtro.solicitante && solicitacao.solicitante_id !== filtro.solicitante) {
      return false;
    }
    
    // Filtro por urgência
    if (filtro.urgencia && solicitacao.urgencia !== filtro.urgencia) {
      return false;
    }
    
    // Filtro por busca (material ou justificativa)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const materialMatch = solicitacao.material?.nome.toLowerCase().includes(termoBusca);
      const justificativaMatch = solicitacao.justificativa?.toLowerCase().includes(termoBusca);
      const idMatch = solicitacao.id.toString().includes(termoBusca);
      
      if (!materialMatch && !justificativaMatch && !idMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Formatar data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Aprovar solicitação
  const aprovarSolicitacao = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('solicitacoes_compra')
      //   .update({ status: 'Aprovado' })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const solicitacoesAtualizadas = solicitacoes.map(s => 
        s.id === id ? { ...s, status: 'Aprovado' as const } : s
      );
      
      setSolicitacoes(solicitacoesAtualizadas);
      
      console.log(`Solicitação ${id} aprovada`);
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
    }
  };
  
  // Recusar solicitação
  const recusarSolicitacao = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('solicitacoes_compra')
      //   .update({ status: 'Recusado' })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const solicitacoesAtualizadas = solicitacoes.map(s => 
        s.id === id ? { ...s, status: 'Recusado' as const } : s
      );
      
      setSolicitacoes(solicitacoesAtualizadas);
      
      console.log(`Solicitação ${id} recusada`);
    } catch (error) {
      console.error('Erro ao recusar solicitação:', error);
    }
  };
  
  // Excluir solicitação
  const excluirSolicitacao = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('solicitacoes_compra')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const solicitacoesAtualizadas = solicitacoes.filter(s => s.id !== id);
      
      setSolicitacoes(solicitacoesAtualizadas);
      
      console.log(`Solicitação ${id} excluída`);
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Solicitações de Compra</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar material ou justificativa..."
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
                Nova Solicitação
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
                    <option value="Solicitado">Solicitado</option>
                    <option value="Aguardando aprovação">Aguardando aprovação</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Recusado">Recusado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.material}
                    onChange={(e) => setFiltro(prev => ({ ...prev, material: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="1">Tecido Oxford</option>
                    <option value="2">Zíper nº 5</option>
                    <option value="3">Linha para costura</option>
                    <option value="4">Botões decorativos</option>
                    <option value="5">Elástico 10mm</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solicitante
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.solicitante}
                    onChange={(e) => setFiltro(prev => ({ ...prev, solicitante: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="1">João Costa</option>
                    <option value="2">Ana Oliveira</option>
                    <option value="3">Roberto Silva</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urgência
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.urgencia}
                    onChange={(e) => setFiltro(prev => ({ ...prev, urgencia: e.target.value }))}
                  >
                    <option value="">Todas</option>
                    <option value="Normal">Normal</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ status: '', material: '', solicitante: '', urgencia: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando solicitações de compra...</div>
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
                    Material
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Solicitante
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgência
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {solicitacoesFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhuma solicitação encontrada
                    </td>
                  </tr>
                ) : (
                  solicitacoesFiltered.map((solicitacao) => (
                    <tr key={solicitacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{solicitacao.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {solicitacao.material?.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {solicitacao.quantidade} {solicitacao.material?.unidade_medida}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {solicitacao.solicitante?.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(solicitacao.data_solicitacao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          solicitacao.status === 'Aprovado' 
                            ? 'bg-green-100 text-green-800' 
                            : solicitacao.status === 'Recusado'
                              ? 'bg-red-100 text-red-800'
                              : solicitacao.status === 'Finalizado'
                                ? 'bg-gray-100 text-gray-800'
                                : solicitacao.status === 'Aguardando aprovação'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                        }`}>
                          {solicitacao.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          solicitacao.urgencia === 'Urgente' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {solicitacao.urgencia}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalhes"
                          >
                            <FileText size={18} />
                          </button>
                          
                          {solicitacao.status === 'Aguardando aprovação' && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-900"
                                title="Aprovar"
                                onClick={() => aprovarSolicitacao(solicitacao.id)}
                              >
                                <CheckCircle size={18} />
                              </button>
                              
                              <button
                                className="text-red-600 hover:text-red-900"
                                title="Recusar"
                                onClick={() => recusarSolicitacao(solicitacao.id)}
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          
                          {(solicitacao.status === 'Solicitado' || solicitacao.status === 'Aguardando aprovação') && (
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                            onClick={() => excluirSolicitacao(solicitacao.id)}
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

export default ComprasSolicitacoesPage;
