import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, CheckCircle, XCircle, Edit, Trash2, ShoppingCart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';


// Tipos de dados
interface OrdemCompra {
  id: number;
  fornecedor_id: number;
  solicitacao_id?: number;
  data_ordem: string;
  forma_pagamento?: string;
  prazo_entrega?: number;
  status: 'Aberta' | 'Em andamento' | 'Recebida' | 'Cancelada';
  valor_total: number;
  observacoes?: string;
  
  // Dados relacionados
  fornecedor?: {
    nome: string;
  };
  itens?: ItemOrdemCompra[];
}

interface ItemOrdemCompra {
  id: number;
  ordem_id: number;
  material_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  
  // Dados relacionados
  material?: {
    nome: string;
    unidade_medida: string;
  };
}

const ComprasOrdensPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [ordens, setOrdens] = useState<OrdemCompra[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    status: '',
    fornecedor: '',
    periodo: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar ordens de compra
  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const ordensSimuladas: OrdemCompra[] = [
          {
            id: 1,
            fornecedor_id: 1,
            solicitacao_id: 2,
            data_ordem: '2025-05-15',
            forma_pagamento: 'Boleto 30 dias',
            prazo_entrega: 7,
            status: 'Aberta',
            valor_total: 1250.00,
            observacoes: 'Entrega no endereço principal',
            fornecedor: { nome: 'Tecidos Premium Ltda' },
            itens: [
              {
                id: 1,
                ordem_id: 1,
                material_id: 2,
                quantidade: 50,
                valor_unitario: 25.00,
                valor_total: 1250.00,
                material: { nome: 'Zíper nº 5', unidade_medida: 'unidade' }
              }
            ]
          },
          {
            id: 2,
            fornecedor_id: 2,
            solicitacao_id: 3,
            data_ordem: '2025-05-14',
            forma_pagamento: 'Cartão de Crédito',
            prazo_entrega: 5,
            status: 'Em andamento',
            valor_total: 350.00,
            fornecedor: { nome: 'Armarinho Central' },
            itens: [
              {
                id: 2,
                ordem_id: 2,
                material_id: 3,
                quantidade: 5,
                valor_unitario: 70.00,
                valor_total: 350.00,
                material: { nome: 'Linha para costura', unidade_medida: 'rolo' }
              }
            ]
          },
          {
            id: 3,
            fornecedor_id: 3,
            data_ordem: '2025-05-10',
            forma_pagamento: 'PIX',
            prazo_entrega: 3,
            status: 'Recebida',
            valor_total: 875.50,
            observacoes: 'Pedido recebido completo',
            fornecedor: { nome: 'Distribuidora de Aviamentos' },
            itens: [
              {
                id: 3,
                ordem_id: 3,
                material_id: 4,
                quantidade: 20,
                valor_unitario: 12.50,
                valor_total: 250.00,
                material: { nome: 'Botões decorativos', unidade_medida: 'pacote' }
              },
              {
                id: 4,
                ordem_id: 3,
                material_id: 5,
                quantidade: 25,
                valor_unitario: 25.02,
                valor_total: 625.50,
                material: { nome: 'Elástico 10mm', unidade_medida: 'metro' }
              }
            ]
          },
          {
            id: 4,
            fornecedor_id: 1,
            data_ordem: '2025-05-05',
            forma_pagamento: 'Boleto 15 dias',
            prazo_entrega: 10,
            status: 'Cancelada',
            valor_total: 2000.00,
            observacoes: 'Cancelado por atraso na entrega',
            fornecedor: { nome: 'Tecidos Premium Ltda' },
            itens: [
              {
                id: 5,
                ordem_id: 4,
                material_id: 1,
                quantidade: 20,
                valor_unitario: 100.00,
                valor_total: 2000.00,
                material: { nome: 'Tecido Oxford', unidade_medida: 'metro' }
              }
            ]
          }
        ];
        
        setOrdens(ordensSimuladas);
      } catch (error) {
        console.error('Erro ao buscar ordens de compra:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdens();
  }, []);
  
  // Filtrar ordens
  const ordensFiltered = ordens.filter(ordem => {
    // Filtro por status
    if (filtro.status && ordem.status !== filtro.status) {
      return false;
    }
    
    // Filtro por fornecedor
    if (filtro.fornecedor && ordem.fornecedor_id.toString() !== filtro.fornecedor) {
      return false;
    }
    
    // Filtro por período
    if (filtro.periodo) {
      const dataOrdem = new Date(ordem.data_ordem);
      const hoje = new Date();
      
      if (filtro.periodo === 'hoje') {
        const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const dataOrdemFormatada = new Date(dataOrdem.getFullYear(), dataOrdem.getMonth(), dataOrdem.getDate());
        if (dataOrdemFormatada.getTime() !== dataHoje.getTime()) {
          return false;
        }
      } else if (filtro.periodo === 'semana') {
        const umaSemanaAtras = new Date(hoje);
        umaSemanaAtras.setDate(hoje.getDate() - 7);
        if (dataOrdem < umaSemanaAtras) {
          return false;
        }
      } else if (filtro.periodo === 'mes') {
        const umMesAtras = new Date(hoje);
        umMesAtras.setMonth(hoje.getMonth() - 1);
        if (dataOrdem < umMesAtras) {
          return false;
        }
      }
    }
    
    // Filtro por busca (fornecedor ou observações)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const fornecedorMatch = ordem.fornecedor?.nome.toLowerCase().includes(termoBusca);
      const observacoesMatch = ordem.observacoes?.toLowerCase().includes(termoBusca);
      const idMatch = ordem.id.toString().includes(termoBusca);
      
      if (!fornecedorMatch && !observacoesMatch && !idMatch) {
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
  
  // Formatar valor
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Atualizar status da ordem
  const atualizarStatus = async (id: number, novoStatus: OrdemCompra['status']) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('ordens_compra')
      //   .update({ status: novoStatus })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const ordensAtualizadas = ordens.map(o => 
        o.id === id ? { ...o, status: novoStatus } : o
      );
      
      setOrdens(ordensAtualizadas);
      
      console.log(`Ordem ${id} atualizada para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status da ordem:', error);
    }
  };
  
  // Excluir ordem
  const excluirOrdem = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('ordens_compra')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const ordensAtualizadas = ordens.filter(o => o.id !== id);
      
      setOrdens(ordensAtualizadas);
      
      console.log(`Ordem ${id} excluída`);
    } catch (error) {
      console.error('Erro ao excluir ordem:', error);
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Ordens de Compra</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar fornecedor ou observações..."
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
                Nova Ordem
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="Aberta">Aberta</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Recebida">Recebida</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fornecedor
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.fornecedor}
                    onChange={(e) => setFiltro(prev => ({ ...prev, fornecedor: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="1">Tecidos Premium Ltda</option>
                    <option value="2">Armarinho Central</option>
                    <option value="3">Distribuidora de Aviamentos</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.periodo}
                    onChange={(e) => setFiltro(prev => ({ ...prev, periodo: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="hoje">Hoje</option>
                    <option value="semana">Últimos 7 dias</option>
                    <option value="mes">Últimos 30 dias</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ status: '', fornecedor: '', periodo: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando ordens de compra...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {ordensFiltered.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                Nenhuma ordem de compra encontrada
              </div>
            ) : (
              ordensFiltered.map((ordem) => (
                <div key={ordem.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          Ordem #{ordem.id} - {ordem.fornecedor?.nome}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Data: {formatarData(ordem.data_ordem)} | 
                          Valor: {formatarValor(ordem.valor_total)} | 
                          Prazo de entrega: {ordem.prazo_entrega} dias
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        ordem.status === 'Recebida' 
                          ? 'bg-green-100 text-green-800' 
                          : ordem.status === 'Cancelada'
                            ? 'bg-red-100 text-red-800'
                            : ordem.status === 'Em andamento'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {ordem.status}
                      </span>
                    </div>
                    
                    {ordem.observacoes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Observações:</strong> {ordem.observacoes}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {ordem.status === 'Aberta' && (
                        <button
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={() => atualizarStatus(ordem.id, 'Em andamento')}
                        >
                          <ShoppingCart size={14} className="mr-1" />
                          Iniciar Compra
                        </button>
                      )}
                      
                      {ordem.status === 'Em andamento' && (
                        <button
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          onClick={() => atualizarStatus(ordem.id, 'Recebida')}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Marcar como Recebida
                        </button>
                      )}
                      
                      {(ordem.status === 'Aberta' || ordem.status === 'Em andamento') && (
                        <button
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => atualizarStatus(ordem.id, 'Cancelada')}
                        >
                          <XCircle size={14} className="mr-1" />
                          Cancelar
                        </button>
                      )}
                      
                      <button
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                      >
                        <Edit size={14} className="mr-1" />
                        Editar
                      </button>
                      
                      <button
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                        onClick={() => excluirOrdem(ordem.id)}
                      >
                        <Trash2 size={14} className="mr-1" />
                        Excluir
                      </button>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900">Itens da Ordem</h4>
                    <div className="mt-2 overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Material
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantidade
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor Unitário
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {ordem.itens?.map((item) => (
                            <tr key={item.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                {item.material?.nome}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {item.quantidade} {item.material?.unidade_medida}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {formatarValor(item.valor_unitario)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {formatarValor(item.valor_total)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50">
                            <td colSpan={3} className="px-3 py-2 text-sm font-medium text-gray-900 text-right">
                              Total:
                            </td>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                              {formatarValor(ordem.valor_total)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprasOrdensPage;
