import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, Filter, Download, RefreshCw, ChevronDown, ChevronUp, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

// Tipos de dados
interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface ChartData {
  name: string;
  [key: string]: string | number;
}

const BIPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [periodo, setPeriodo] = useState<'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano'>('mes');
  const [loading, setLoading] = useState(true);
  const [showFiltros, setShowFiltros] = useState(false);
  const [filtro, setFiltro] = useState({
    departamento: '',
    categoria: '',
    cliente: ''
  });
  
  // Estados para dados dos gráficos
  const [cards, setCards] = useState<DashboardCard[]>([]);
  const [vendasPorPeriodo, setVendasPorPeriodo] = useState<ChartData[]>([]);
  const [vendasPorCategoria, setVendasPorCategoria] = useState<ChartData[]>([]);
  const [statusPedidos, setStatusPedidos] = useState<ChartData[]>([]);
  const [topProdutos, setTopProdutos] = useState<ChartData[]>([]);
  const [topClientes, setTopClientes] = useState<ChartData[]>([]);
  
  // Cores para gráficos
  const COLORS = ['#A5854E', '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'];
  
  // Buscar dados
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        
        // Cards
        const cardsSimulados: DashboardCard[] = [
          {
            id: 'vendas',
            title: 'Vendas Totais',
            value: 'R$ 125.430,00',
            change: 12.5,
            changeType: 'positive',
            icon: <DollarSign size={24} />,
            color: '#A5854E'
          },
          {
            id: 'pedidos',
            title: 'Pedidos',
            value: 87,
            change: 8.2,
            changeType: 'positive',
            icon: <ShoppingCart size={24} />,
            color: '#8884d8'
          },
          {
            id: 'produtos',
            title: 'Produtos Vendidos',
            value: 342,
            change: -3.1,
            changeType: 'negative',
            icon: <Package size={24} />,
            color: '#82ca9d'
          },
          {
            id: 'clientes',
            title: 'Novos Clientes',
            value: 24,
            change: 15.8,
            changeType: 'positive',
            icon: <Users size={24} />,
            color: '#ffc658'
          }
        ];
        
        // Vendas por período
        const vendasPorPeriodoSimuladas: ChartData[] = [
          { name: 'Jan', vendas: 4000, meta: 3000 },
          { name: 'Fev', vendas: 3000, meta: 3000 },
          { name: 'Mar', vendas: 5000, meta: 3000 },
          { name: 'Abr', vendas: 2780, meta: 3000 },
          { name: 'Mai', vendas: 4890, meta: 3000 },
          { name: 'Jun', vendas: 3390, meta: 3000 },
          { name: 'Jul', vendas: 4490, meta: 3500 },
          { name: 'Ago', vendas: 5100, meta: 3500 },
          { name: 'Set', vendas: 4300, meta: 3500 },
          { name: 'Out', vendas: 5200, meta: 3500 },
          { name: 'Nov', vendas: 6100, meta: 4000 },
          { name: 'Dez', vendas: 7500, meta: 4000 }
        ];
        
        // Vendas por categoria
        const vendasPorCategoriaSimuladas: ChartData[] = [
          { name: 'Vestidos', value: 35 },
          { name: 'Blusas', value: 25 },
          { name: 'Saias', value: 15 },
          { name: 'Calças', value: 10 },
          { name: 'Acessórios', value: 15 }
        ];
        
        // Status de pedidos
        const statusPedidosSimulados: ChartData[] = [
          { name: 'Aguardando', value: 15 },
          { name: 'Em Produção', value: 30 },
          { name: 'Prontos', value: 20 },
          { name: 'Enviados', value: 25 },
          { name: 'Entregues', value: 10 }
        ];
        
        // Top produtos
        const topProdutosSimulados: ChartData[] = [
          { name: 'Vestido Floral', vendas: 42 },
          { name: 'Blusa Bordada', vendas: 38 },
          { name: 'Saia Midi', vendas: 34 },
          { name: 'Calça Pantalona', vendas: 29 },
          { name: 'Vestido Longo', vendas: 25 }
        ];
        
        // Top clientes
        const topClientesSimulados: ChartData[] = [
          { name: 'Maria Silva', compras: 12500 },
          { name: 'João Oliveira', compras: 9800 },
          { name: 'Ana Santos', compras: 8500 },
          { name: 'Carlos Ferreira', compras: 7200 },
          { name: 'Juliana Costa', compras: 6500 }
        ];
        
        setCards(cardsSimulados);
        setVendasPorPeriodo(vendasPorPeriodoSimuladas);
        setVendasPorCategoria(vendasPorCategoriaSimuladas);
        setStatusPedidos(statusPedidosSimulados);
        setTopProdutos(topProdutosSimulados);
        setTopClientes(topClientesSimulados);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, [periodo]);
  
  // Formatar valor
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Renderizar cards
  const renderCards = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
                <div className={`flex items-center mt-2 ${
                  card.changeType === 'positive' 
                    ? 'text-green-600' 
                    : card.changeType === 'negative' 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                }`}>
                  {card.changeType === 'positive' ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : card.changeType === 'negative' ? (
                    <TrendingDown size={16} className="mr-1" />
                  ) : null}
                  <span className="text-sm">
                    {card.change}% {card.changeType === 'positive' ? 'acima' : card.changeType === 'negative' ? 'abaixo' : ''} do mês anterior
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // Renderizar gráfico de vendas por período
  const renderVendasPorPeriodo = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Vendas por Período</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="xs">
              <Download size={14} className="mr-1" />
              Exportar
            </Button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={vendasPorPeriodo}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatarValor(value as number)} />
              <Legend />
              <Area type="monotone" dataKey="vendas" stroke="#A5854E" fill="#A5854E" fillOpacity={0.3} name="Vendas" />
              <Area type="monotone" dataKey="meta" stroke="#8884d8" fill="#8884d8" fillOpacity={0.1} name="Meta" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Renderizar gráficos de distribuição
  const renderGraficosDistribuicao = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vendas por Categoria */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Vendas por Categoria</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vendasPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {vendasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Status de Pedidos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Status de Pedidos</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusPedidos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusPedidos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar rankings
  const renderRankings = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Produtos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Top Produtos</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProdutos}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#A5854E" name="Vendas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Top Clientes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Top Clientes</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topClientes}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => formatarValor(value as number)} />
                <Legend />
                <Bar dataKey="compras" fill="#8884d8" name="Compras" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Dashboard Analítico</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm rounded-md"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value as any)}
                >
                  <option value="hoje">Hoje</option>
                  <option value="semana">Esta Semana</option>
                  <option value="mes">Este Mês</option>
                  <option value="trimestre">Este Trimestre</option>
                  <option value="ano">Este Ano</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFiltros(!showFiltros)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1000);
                }}
              >
                <RefreshCw size={18} className="mr-1" />
                Atualizar
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.departamento}
                    onChange={(e) => setFiltro(prev => ({ ...prev, departamento: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="Produção">Produção</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Financeiro">Financeiro</option>
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
                    <option value="Vestidos">Vestidos</option>
                    <option value="Blusas">Blusas</option>
                    <option value="Saias">Saias</option>
                    <option value="Calças">Calças</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.cliente}
                    onChange={(e) => setFiltro(prev => ({ ...prev, cliente: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="Maria Silva">Maria Silva</option>
                    <option value="João Oliveira">João Oliveira</option>
                    <option value="Ana Santos">Ana Santos</option>
                    <option value="Carlos Ferreira">Carlos Ferreira</option>
                    <option value="Juliana Costa">Juliana Costa</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ departamento: '', categoria: '', cliente: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando dados...</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cards */}
            {renderCards()}
            
            {/* Gráfico de Vendas por Período */}
            {renderVendasPorPeriodo()}
            
            {/* Gráficos de Distribuição */}
            {renderGraficosDistribuicao()}
            
            {/* Rankings */}
            {renderRankings()}
          </div>
        )}
      </div>
    </div>
  );
};

export default BIPage;
