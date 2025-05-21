import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, DollarSign, CreditCard, FileText, Edit, Trash2, Calendar, ArrowUpRight, ArrowDownRight, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

// Tipos de dados
interface Lancamento {
  id: number;
  tipo: 'receita' | 'despesa';
  categoria_id: number;
  descricao: string;
  valor: number;
  data_vencimento: string;
  data_pagamento?: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  forma_pagamento?: string;
  documento?: string;
  observacoes?: string;
  
  // Dados relacionados
  categoria?: {
    nome: string;
  };
}

const FinanceiroLancamentosPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    tipo: '',
    categoria: '',
    status: '',
    periodo: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar lançamentos
  useEffect(() => {
    const fetchLancamentos = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const lancamentosSimulados: Lancamento[] = [
          {
            id: 1,
            tipo: 'receita',
            categoria_id: 1,
            descricao: 'Pagamento Pedido #101',
            valor: 1250.00,
            data_vencimento: '2025-05-15',
            data_pagamento: '2025-05-15',
            status: 'pago',
            forma_pagamento: 'PIX',
            documento: 'NF-1001',
            categoria: { nome: 'Vendas' }
          },
          {
            id: 2,
            tipo: 'despesa',
            categoria_id: 2,
            descricao: 'Compra de materiais',
            valor: 450.00,
            data_vencimento: '2025-05-20',
            status: 'pendente',
            forma_pagamento: 'Boleto',
            documento: 'NF-2001',
            categoria: { nome: 'Materiais' }
          },
          {
            id: 3,
            tipo: 'despesa',
            categoria_id: 3,
            descricao: 'Aluguel do ateliê',
            valor: 2000.00,
            data_vencimento: '2025-05-10',
            data_pagamento: '2025-05-09',
            status: 'pago',
            forma_pagamento: 'Transferência',
            categoria: { nome: 'Instalações' }
          },
          {
            id: 4,
            tipo: 'receita',
            categoria_id: 1,
            descricao: 'Pagamento Pedido #102',
            valor: 875.50,
            data_vencimento: '2025-05-05',
            status: 'atrasado',
            forma_pagamento: 'Cartão de Crédito',
            documento: 'NF-1002',
            observacoes: 'Cliente solicitou prazo adicional',
            categoria: { nome: 'Vendas' }
          },
          {
            id: 5,
            tipo: 'despesa',
            categoria_id: 4,
            descricao: 'Pagamento de funcionários',
            valor: 5000.00,
            data_vencimento: '2025-05-30',
            status: 'pendente',
            forma_pagamento: 'Transferência',
            categoria: { nome: 'Folha de Pagamento' }
          },
          {
            id: 6,
            tipo: 'despesa',
            categoria_id: 5,
            descricao: 'Conta de energia',
            valor: 350.00,
            data_vencimento: '2025-05-18',
            status: 'pendente',
            forma_pagamento: 'Boleto',
            categoria: { nome: 'Utilidades' }
          },
          {
            id: 7,
            tipo: 'receita',
            categoria_id: 6,
            descricao: 'Venda de retalhos',
            valor: 120.00,
            data_vencimento: '2025-05-12',
            data_pagamento: '2025-05-12',
            status: 'pago',
            forma_pagamento: 'Dinheiro',
            categoria: { nome: 'Outros' }
          }
        ];
        
        setLancamentos(lancamentosSimulados);
      } catch (error) {
        console.error('Erro ao buscar lançamentos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLancamentos();
  }, []);
  
  // Filtrar lançamentos
  const lancamentosFiltered = lancamentos.filter(lancamento => {
    // Filtro por tipo
    if (filtro.tipo && lancamento.tipo !== filtro.tipo) {
      return false;
    }
    
    // Filtro por categoria
    if (filtro.categoria && lancamento.categoria_id.toString() !== filtro.categoria) {
      return false;
    }
    
    // Filtro por status
    if (filtro.status && lancamento.status !== filtro.status) {
      return false;
    }
    
    // Filtro por período
    if (filtro.periodo) {
      const dataVencimento = new Date(lancamento.data_vencimento);
      const hoje = new Date();
      
      if (filtro.periodo === 'hoje') {
        const dataHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const dataVencimentoFormatada = new Date(dataVencimento.getFullYear(), dataVencimento.getMonth(), dataVencimento.getDate());
        if (dataVencimentoFormatada.getTime() !== dataHoje.getTime()) {
          return false;
        }
      } else if (filtro.periodo === 'semana') {
        const umaSemanaAtras = new Date(hoje);
        umaSemanaAtras.setDate(hoje.getDate() - 7);
        const umaSemanaFrente = new Date(hoje);
        umaSemanaFrente.setDate(hoje.getDate() + 7);
        if (dataVencimento < umaSemanaAtras || dataVencimento > umaSemanaFrente) {
          return false;
        }
      } else if (filtro.periodo === 'mes') {
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        if (dataVencimento < inicioMes || dataVencimento > fimMes) {
          return false;
        }
      }
    }
    
    // Filtro por busca (descrição ou observações)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const descricaoMatch = lancamento.descricao.toLowerCase().includes(termoBusca);
      const observacoesMatch = lancamento.observacoes?.toLowerCase().includes(termoBusca);
      const documentoMatch = lancamento.documento?.toLowerCase().includes(termoBusca);
      const idMatch = lancamento.id.toString().includes(termoBusca);
      
      if (!descricaoMatch && !observacoesMatch && !documentoMatch && !idMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calcular totais
  const totalReceitas = lancamentosFiltered
    .filter(l => l.tipo === 'receita')
    .reduce((acc, l) => acc + l.valor, 0);
    
  const totalDespesas = lancamentosFiltered
    .filter(l => l.tipo === 'despesa')
    .reduce((acc, l) => acc + l.valor, 0);
    
  const saldo = totalReceitas - totalDespesas;
  
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
  
  // Atualizar status do lançamento
  const atualizarStatus = async (id: number, novoStatus: Lancamento['status']) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('lancamentos')
      //   .update({ status: novoStatus })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const lancamentosAtualizados = lancamentos.map(l => {
        if (l.id === id) {
          const lancamentoAtualizado = { ...l, status: novoStatus };
          
          // Atualizar data_pagamento se status for "pago"
          if (novoStatus === 'pago' && !l.data_pagamento) {
            lancamentoAtualizado.data_pagamento = new Date().toISOString().split('T')[0];
          }
          
          return lancamentoAtualizado;
        }
        
        return l;
      });
      
      setLancamentos(lancamentosAtualizados);
      
      console.log(`Lançamento ${id} atualizado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status do lançamento:', error);
    }
  };
  
  // Excluir lançamento
  const excluirLancamento = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('lancamentos')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const lancamentosAtualizados = lancamentos.filter(l => l.id !== id);
      
      setLancamentos(lancamentosAtualizados);
      
      console.log(`Lançamento ${id} excluído`);
    } catch (error) {
      console.error('Erro ao excluir lançamento:', error);
    }
  };
  
  // Renderizar ícone de status
  const renderIconeStatus = (status: Lancamento['status']) => {
    switch (status) {
      case 'pendente':
        return <Calendar size={18} className="text-yellow-500" />;
      case 'pago':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'atrasado':
        return <AlertTriangle size={18} className="text-red-500" />;
      case 'cancelado':
        return <XCircle size={18} className="text-gray-500" />;
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
            <h1 className="text-2xl font-bold text-text">Financeiro - Lançamentos</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar descrição ou documento..."
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
                Novo Lançamento
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.tipo}
                    onChange={(e) => setFiltro(prev => ({ ...prev, tipo: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.categoria}
                    onChange={(e) => setFiltro(prev => ({ ...prev, categoria: e.target.value }))}
                  >
                    <option value="">Todas</option>
                    <option value="1">Vendas</option>
                    <option value="2">Materiais</option>
                    <option value="3">Instalações</option>
                    <option value="4">Folha de Pagamento</option>
                    <option value="5">Utilidades</option>
                    <option value="6">Outros</option>
                  </select>
                </div>
                
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
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                    <option value="cancelado">Cancelado</option>
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
                    <option value="semana">Esta semana</option>
                    <option value="mes">Este mês</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ tipo: '', categoria: '', status: '', periodo: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
          
          {/* Resumo financeiro */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <ArrowUpRight size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Receitas</p>
                  <p className="text-xl font-semibold text-gray-900">{formatarValor(totalReceitas)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 mr-4">
                  <ArrowDownRight size={24} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total de Despesas</p>
                  <p className="text-xl font-semibold text-gray-900">{formatarValor(totalDespesas)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${saldo >= 0 ? 'bg-blue-100' : 'bg-orange-100'} mr-4`}>
                  <DollarSign size={24} className={`${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Saldo</p>
                  <p className={`text-xl font-semibold ${saldo >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatarValor(saldo)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando lançamentos...</div>
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
                    Descrição
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
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
                {lancamentosFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum lançamento encontrado
                    </td>
                  </tr>
                ) : (
                  lancamentosFiltered.map((lancamento) => (
                    <tr key={lancamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{lancamento.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className={`mr-2 flex-shrink-0 h-4 w-4 rounded-full ${
                            lancamento.tipo === 'receita' ? 'bg-green-400' : 'bg-red-400'
                          }`}></div>
                          <span>{lancamento.descricao}</span>
                        </div>
                        {lancamento.documento && (
                          <div className="text-xs text-gray-400 mt-1">
                            Doc: {lancamento.documento}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lancamento.categoria?.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(lancamento.data_vencimento)}
                        {lancamento.data_pagamento && (
                          <div className="text-xs text-gray-400 mt-1">
                            Pago em: {formatarData(lancamento.data_pagamento)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={lancamento.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                          {lancamento.tipo === 'receita' ? '+' : '-'} {formatarValor(lancamento.valor)}
                        </span>
                        {lancamento.forma_pagamento && (
                          <div className="text-xs text-gray-400 mt-1">
                            {lancamento.forma_pagamento}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderIconeStatus(lancamento.status)}
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lancamento.status === 'pago' 
                              ? 'bg-green-100 text-green-800' 
                              : lancamento.status === 'atrasado'
                                ? 'bg-red-100 text-red-800'
                                : lancamento.status === 'cancelado'
                                  ? 'bg-gray-100 text-gray-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lancamento.status.charAt(0).toUpperCase() + lancamento.status.slice(1)}
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
                          
                          {lancamento.status === 'pendente' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Marcar como pago"
                              onClick={() => atualizarStatus(lancamento.id, 'pago')}
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          
                          {(lancamento.status === 'pendente' || lancamento.status === 'atrasado') && (
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              title="Cancelar"
                              onClick={() => atualizarStatus(lancamento.id, 'cancelado')}
                            >
                              <XCircle size={18} />
                            </button>
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
                            onClick={() => excluirLancamento(lancamento.id)}
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

export default FinanceiroLancamentosPage;
