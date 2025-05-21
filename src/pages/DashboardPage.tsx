import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, AlertTriangle, Package, ShoppingCart } from 'lucide-react';
import Sidebar from '../components/Sidebar';

// Dados simulados para os gráficos
const statusPedidosData = [
  { name: 'Aguardando', value: 12, color: '#FFB547' },
  { name: 'Em Produção', value: 8, color: '#36A2EB' },
  { name: 'Concluído', value: 15, color: '#4BC0C0' },
  { name: 'Entregue', value: 10, color: '#A5854E' },
  { name: 'Cancelado', value: 2, color: '#FF6384' }
];

// Dados simulados para os cards
const cardsData = {
  pedidosAbertos: 20,
  ordensProducao: 8,
  estoquesCriticos: 5
};

// Dados simulados para a fila de produção
const filaProducaoData = [
  { id: 'OP-2025-001', produto: 'Vestido Personalizado', cliente: 'Maria Silva', etapa: 'Corte', status: 'Em Andamento', prazo: '25/05/2025' },
  { id: 'OP-2025-002', produto: 'Conjunto Infantil', cliente: 'João Pereira', etapa: 'Costura', status: 'Em Andamento', prazo: '27/05/2025' },
  { id: 'OP-2025-003', produto: 'Bolsa Artesanal', cliente: 'Ana Oliveira', etapa: 'Acabamento', status: 'Em Andamento', prazo: '22/05/2025' },
  { id: 'OP-2025-004', produto: 'Toalha Bordada', cliente: 'Carlos Santos', etapa: 'Bordado', status: 'Aguardando', prazo: '30/05/2025' }
];

// Dados simulados para os últimos pedidos
const ultimosPedidosData = [
  { id: 'PED-2025-010', cliente: 'Fernanda Lima', data: '18/05/2025', status: 'Aguardando Pagamento', valor: 'R$ 450,00' },
  { id: 'PED-2025-009', cliente: 'Roberto Alves', data: '17/05/2025', status: 'Em Produção', valor: 'R$ 780,00' },
  { id: 'PED-2025-008', cliente: 'Juliana Costa', data: '15/05/2025', status: 'Concluído', valor: 'R$ 320,00' },
  { id: 'PED-2025-007', cliente: 'Marcelo Souza', data: '12/05/2025', status: 'Entregue', valor: 'R$ 590,00' }
];

const DashboardPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold text-text mb-6">Dashboard</h1>
        
        {/* Cards de indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pedidos Abertos</p>
                <h2 className="text-3xl font-bold text-text">{cardsData.pedidosAbertos}</h2>
              </div>
              <div className="p-3 bg-primary/50 rounded-full">
                <ShoppingCart size={24} className="text-secondary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ordens de Produção</p>
                <h2 className="text-3xl font-bold text-text">{cardsData.ordensProducao}</h2>
              </div>
              <div className="p-3 bg-primary/50 rounded-full">
                <Package size={24} className="text-secondary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Estoques Críticos</p>
                <h2 className="text-3xl font-bold text-text">{cardsData.estoquesCriticos}</h2>
              </div>
              <div className="p-3 bg-primary/50 rounded-full">
                <AlertTriangle size={24} className="text-secondary" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de status dos pedidos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-text mb-4">Status dos Pedidos</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPedidosData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusPedidosData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Fila de Produção */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Fila de Produção</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock size={16} className="mr-1" />
                <span>Atualizado: Hoje, 13:45</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OP</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etapa</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prazo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filaProducaoData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-text">{item.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.produto}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.etapa}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.prazo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Últimos Pedidos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-text mb-4">Últimos Pedidos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ultimosPedidosData.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text">{pedido.id}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{pedido.cliente}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{pedido.data}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pedido.status === 'Em Produção' ? 'bg-blue-100 text-blue-800' : 
                        pedido.status === 'Concluído' ? 'bg-green-100 text-green-800' : 
                        pedido.status === 'Entregue' ? 'bg-purple-100 text-purple-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pedido.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{pedido.valor}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-secondary hover:text-secondary/80 mr-2">Ver</button>
                      <button className="text-secondary hover:text-secondary/80">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
