import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { FormSection } from '../components/FormComponents';
import { Search, Plus, Edit, Trash2, FileText, Filter, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

// Dados simulados para a listagem de pedidos
const pedidosData = [
  { 
    id: 'PED-2025-001', 
    cliente: 'Maria Silva', 
    data_pedido: '18/05/2025', 
    data_entrega: '28/05/2025',
    valor_total: 'R$ 750,00',
    status: 'Em Produção',
    forma_pagamento: 'Cartão de Crédito',
    prioridade: 'Normal'
  },
  { 
    id: 'PED-2025-002', 
    cliente: 'João Pereira', 
    data_pedido: '17/05/2025', 
    data_entrega: '25/05/2025',
    valor_total: 'R$ 320,00',
    status: 'Aguardando Pagamento',
    forma_pagamento: 'Pix',
    prioridade: 'Alta'
  },
  { 
    id: 'PED-2025-003', 
    cliente: 'Ana Oliveira', 
    data_pedido: '15/05/2025', 
    data_entrega: '22/05/2025',
    valor_total: 'R$ 980,00',
    status: 'Concluído',
    forma_pagamento: 'Transferência',
    prioridade: 'Normal'
  },
  { 
    id: 'PED-2025-004', 
    cliente: 'Carlos Santos', 
    data_pedido: '12/05/2025', 
    data_entrega: '20/05/2025',
    valor_total: 'R$ 450,00',
    status: 'Entregue',
    forma_pagamento: 'Cartão de Crédito',
    prioridade: 'Baixa'
  },
  { 
    id: 'PED-2025-005', 
    cliente: 'Fernanda Lima', 
    data_pedido: '10/05/2025', 
    data_entrega: '18/05/2025',
    valor_total: 'R$ 1.200,00',
    status: 'Cancelado',
    forma_pagamento: 'Boleto',
    prioridade: 'Normal'
  }
];

// Dados simulados para os selects de filtro
const statusPedidos = [
  { value: '', label: 'Todos os status' },
  { value: 'Aguardando Pagamento', label: 'Aguardando Pagamento' },
  { value: 'Em Produção', label: 'Em Produção' },
  { value: 'Concluído', label: 'Concluído' },
  { value: 'Entregue', label: 'Entregue' },
  { value: 'Cancelado', label: 'Cancelado' }
];

const formasPagamento = [
  { value: '', label: 'Todas as formas' },
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Transferência', label: 'Transferência' },
  { value: 'Boleto', label: 'Boleto' }
];

const prioridades = [
  { value: '', label: 'Todas as prioridades' },
  { value: 'Alta', label: 'Alta' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Baixa', label: 'Baixa' }
];

// Schema de validação para o formulário de filtro
const filtroSchema = z.object({
  termo_busca: z.string().optional(),
  status: z.string().optional(),
  forma_pagamento: z.string().optional(),
  prioridade: z.string().optional(),
  data_inicial: z.string().optional(),
  data_final: z.string().optional()
});

type FiltroFormData = z.infer<typeof filtroSchema>;

const PedidoListPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [filteredData, setFilteredData] = React.useState(pedidosData);
  const [showFilters, setShowFilters] = React.useState(false);
  
  const { register, handleSubmit } = useForm<FiltroFormData>({
    resolver: zodResolver(filtroSchema)
  });
  
  const onSubmitFilter = (data: FiltroFormData) => {
    console.log('Filtros aplicados:', data);
    
    // Simulação de filtragem
    let filtered = [...pedidosData];
    
    if (data.termo_busca) {
      const termo = data.termo_busca.toLowerCase();
      filtered = filtered.filter(item => 
        item.cliente.toLowerCase().includes(termo) || 
        item.id.toLowerCase().includes(termo)
      );
    }
    
    if (data.status) {
      filtered = filtered.filter(item => item.status === data.status);
    }
    
    if (data.forma_pagamento) {
      filtered = filtered.filter(item => item.forma_pagamento === data.forma_pagamento);
    }
    
    if (data.prioridade) {
      filtered = filtered.filter(item => item.prioridade === data.prioridade);
    }
    
    // Filtragem por data poderia ser implementada aqui
    
    setFilteredData(filtered);
    setShowFilters(false);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Aguardando Pagamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Produção':
        return 'bg-blue-100 text-blue-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Entregue':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPrioridadeBadgeClass = (prioridade: string) => {
    switch (prioridade) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      case 'Baixa':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text">Pedidos</h1>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              <Button size="sm">
                <Plus size={18} className="mr-1" />
                Novo Pedido
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold text-text mb-4">Filtrar Pedidos</h3>
              
              <form onSubmit={handleSubmit(onSubmitFilter)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Busca
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                      placeholder="Número do pedido ou cliente"
                      {...register('termo_busca')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Status
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('status')}
                  >
                    {statusPedidos.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('forma_pagamento')}
                  >
                    {formasPagamento.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Prioridade
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('prioridade')}
                  >
                    {prioridades.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('data_inicial')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Data Final
                  </label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('data_final')}
                  />
                </div>
                
                <div className="md:col-span-3 flex justify-end mt-4">
                  <Button type="submit" size="sm">
                    Aplicar Filtros
                  </Button>
                </div>
              </form>
            </div>
          )}
          
          {/* Tabela de pedidos */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data do Pedido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrega Prevista
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prioridade
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text">
                      {pedido.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {pedido.cliente}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {pedido.data_pedido}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {pedido.data_entrega}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text">
                      {pedido.valor_total}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getStatusBadgeClass(pedido.status)
                      }`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getPrioridadeBadgeClass(pedido.prioridade)
                      }`}>
                        {pedido.prioridade}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-secondary hover:text-secondary/80 mr-3">
                        <FileText size={18} />
                      </button>
                      <button className="text-secondary hover:text-secondary/80 mr-3">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Nenhum pedido encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Mostrando {filteredData.length} de {pedidosData.length} pedidos
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Anterior
              </button>
              <button className="px-3 py-1 bg-secondary text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoListPage;
