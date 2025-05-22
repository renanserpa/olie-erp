import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Filter, Download, RefreshCw, TrendingUp, TrendingDown, 
  DollarSign, Package, Users, ShoppingCart, Clock, 
  Calendar, CheckCircle, AlertTriangle, ArrowUp, ArrowDown
} from 'lucide-react';

// Componente principal do Dashboard com Gráficos
const DashboardGraficos: React.FC = () => {
  // Estados para gerenciar os dados
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano'>('mes');
  const [carregando, setCarregando] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados para os dados dos gráficos
  const [indicadoresProducao, setIndicadoresProducao] = useState<any[]>([]);
  const [producaoPorEtapa, setProducaoPorEtapa] = useState<any[]>([]);
  const [producaoPorTempo, setProducaoPorTempo] = useState<any[]>([]);
  const [eficienciaPorProduto, setEficienciaPorProduto] = useState<any[]>([]);
  const [distribuicaoPrioridades, setDistribuicaoPrioridades] = useState<any[]>([]);
  const [tendenciaEntregas, setTendenciaEntregas] = useState<any[]>([]);
  const [utilizacaoInsumos, setUtilizacaoInsumos] = useState<any[]>([]);
  const [produtividadeEquipe, setProdutividadeEquipe] = useState<any[]>([]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    carregarDados();
  }, [periodoSelecionado]);

  // Função para carregar dados
  const carregarDados = async () => {
    setCarregando(true);
    
    // Simulação de carregamento de dados
    // Em um ambiente real, isso seria uma chamada à API
    setTimeout(() => {
      // Dados simulados para indicadores de produção
      const indicadoresSimulados = [
        {
          id: 'producao_total',
          titulo: 'Produção Total',
          valor: periodoSelecionado === 'hoje' ? 12 : 
                 periodoSelecionado === 'semana' ? 68 : 
                 periodoSelecionado === 'mes' ? 245 : 
                 periodoSelecionado === 'trimestre' ? 720 : 1850,
          unidade: 'unidades',
          variacao: periodoSelecionado === 'hoje' ? 8.5 : 
                    periodoSelecionado === 'semana' ? 12.3 : 
                    periodoSelecionado === 'mes' ? 5.7 : 
                    periodoSelecionado === 'trimestre' ? -2.1 : 7.8,
          icone: Package
        },
        {
          id: 'tempo_medio',
          titulo: 'Tempo Médio',
          valor: periodoSelecionado === 'hoje' ? 42 : 
                 periodoSelecionado === 'semana' ? 45 : 
                 periodoSelecionado === 'mes' ? 43 : 
                 periodoSelecionado === 'trimestre' ? 40 : 38,
          unidade: 'minutos',
          variacao: periodoSelecionado === 'hoje' ? -5.2 : 
                    periodoSelecionado === 'semana' ? -3.1 : 
                    periodoSelecionado === 'mes' ? -4.5 : 
                    periodoSelecionado === 'trimestre' ? -8.3 : -12.5,
          icone: Clock
        },
        {
          id: 'taxa_entrega',
          titulo: 'Taxa de Entrega',
          valor: periodoSelecionado === 'hoje' ? 92 : 
                 periodoSelecionado === 'semana' ? 89 : 
                 periodoSelecionado === 'mes' ? 94 : 
                 periodoSelecionado === 'trimestre' ? 91 : 93,
          unidade: '%',
          variacao: periodoSelecionado === 'hoje' ? 2.5 : 
                    periodoSelecionado === 'semana' ? -1.2 : 
                    periodoSelecionado === 'mes' ? 3.8 : 
                    periodoSelecionado === 'trimestre' ? 0.5 : 2.1,
          icone: CheckCircle
        },
        {
          id: 'pedidos_atrasados',
          titulo: 'Pedidos Atrasados',
          valor: periodoSelecionado === 'hoje' ? 3 : 
                 periodoSelecionado === 'semana' ? 8 : 
                 periodoSelecionado === 'mes' ? 12 : 
                 periodoSelecionado === 'trimestre' ? 35 : 78,
          unidade: 'pedidos',
          variacao: periodoSelecionado === 'hoje' ? -25.0 : 
                    periodoSelecionado === 'semana' ? 14.3 : 
                    periodoSelecionado === 'mes' ? -7.7 : 
                    periodoSelecionado === 'trimestre' ? -15.0 : -5.8,
          icone: AlertTriangle
        }
      ];
      
      // Dados simulados para produção por etapa
      const etapasSimuladas = [
        { nome: 'Separação', quantidade: 18, tempoMedio: 15, cor: '#0079BF' },
        { nome: 'Corte', quantidade: 12, tempoMedio: 25, cor: '#8E44AD' },
        { nome: 'Bordado', quantidade: 8, tempoMedio: 40, cor: '#D81B60' },
        { nome: 'Costura', quantidade: 15, tempoMedio: 35, cor: '#F2D600' },
        { nome: 'Acabamento', quantidade: 10, tempoMedio: 20, cor: '#FF9F1A' },
        { nome: 'Finalizado', quantidade: 22, tempoMedio: 0, cor: '#61BD4F' }
      ];
      
      // Dados simulados para produção por tempo
      const diasMes = periodoSelecionado === 'mes' ? 30 : 
                      periodoSelecionado === 'semana' ? 7 : 
                      periodoSelecionado === 'hoje' ? 1 : 
                      periodoSelecionado === 'trimestre' ? 90 : 365;
      
      const producaoTempoSimulada = Array.from({ length: diasMes }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() - (diasMes - 1 - i));
        
        // Gerar valores aleatórios com tendência de crescimento
        const base = 5 + Math.floor(i / 5);
        const variacao = Math.floor(Math.random() * 5) - 2;
        const producao = Math.max(1, base + variacao);
        
        return {
          data: data.toISOString().split('T')[0],
          producao,
          meta: 8
        };
      });
      
      // Dados simulados para eficiência por produto
      const produtosSimulados = [
        { nome: 'Necessaire Paris', eficiencia: 92, tempoMedio: 30, quantidade: 45 },
        { nome: 'Bolsa Tote', eficiencia: 87, tempoMedio: 60, quantidade: 28 },
        { nome: 'Porta Documentos', eficiencia: 95, tempoMedio: 45, quantidade: 15 },
        { nome: 'Kit Necessaires', eficiencia: 89, tempoMedio: 90, quantidade: 12 },
        { nome: 'Mochila Urban', eficiencia: 78, tempoMedio: 75, quantidade: 8 }
      ];
      
      // Dados simulados para distribuição de prioridades
      const prioridadesSimuladas = [
        { nome: 'Baixa', valor: 25, cor: '#4285F4' },
        { nome: 'Normal', valor: 45, cor: '#34A853' },
        { nome: 'Alta', valor: 20, cor: '#FBBC05' },
        { nome: 'Urgente', valor: 10, cor: '#EA4335' }
      ];
      
      // Dados simulados para tendência de entregas
      const entregasSimuladas = Array.from({ length: 12 }, (_, i) => {
        const mes = new Date();
        mes.setMonth(mes.getMonth() - (11 - i));
        
        // Gerar valores com tendência de crescimento
        const base = 15 + Math.floor(i * 1.5);
        const variacao = Math.floor(Math.random() * 8) - 4;
        const entregas = Math.max(5, base + variacao);
        const pontual = Math.floor(entregas * (0.85 + (Math.random() * 0.1)));
        
        return {
          mes: mes.toLocaleDateString('pt-BR', { month: 'short' }),
          total: entregas,
          pontual: pontual,
          atrasado: entregas - pontual
        };
      });
      
      // Dados simulados para utilização de insumos
      const insumosSimulados = [
        { nome: 'Tecido Algodão', utilizado: 120, disponivel: 200, cor: '#4285F4' },
        { nome: 'Tecido Sintético', utilizado: 85, disponivel: 150, cor: '#34A853' },
        { nome: 'Zíper', utilizado: 250, disponivel: 300, cor: '#FBBC05' },
        { nome: 'Linha', utilizado: 180, disponivel: 500, cor: '#EA4335' },
        { nome: 'Botões', utilizado: 320, disponivel: 400, cor: '#8E44AD' },
        { nome: 'Etiquetas', utilizado: 210, disponivel: 250, cor: '#D81B60' }
      ];
      
      // Dados simulados para produtividade da equipe
      const equipeSimulada = [
        { nome: 'João', producao: 42, meta: 40, eficiencia: 105 },
        { nome: 'Maria', producao: 38, meta: 40, eficiencia: 95 },
        { nome: 'Carlos', producao: 45, meta: 40, eficiencia: 112.5 },
        { nome: 'Ana', producao: 36, meta: 40, eficiencia: 90 },
        { nome: 'Pedro', producao: 41, meta: 40, eficiencia: 102.5 }
      ];
      
      // Atualizar os estados com os dados simulados
      setIndicadoresProducao(indicadoresSimulados);
      setProducaoPorEtapa(etapasSimuladas);
      setProducaoPorTempo(producaoTempoSimulada);
      setEficienciaPorProduto(produtosSimulados);
      setDistribuicaoPrioridades(prioridadesSimuladas);
      setTendenciaEntregas(entregasSimuladas);
      setUtilizacaoInsumos(insumosSimulados);
      setProdutividadeEquipe(equipeSimulada);
      
      setUltimaAtualizacao(new Date());
      setCarregando(false);
    }, 1000);
  };

  // Função para formatar data/hora
  const formatarDataHora = (data: Date): string => {
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Função para formatar números
  const formatarNumero = (valor: number): string => {
    return valor.toLocaleString('pt-BR');
  };

  // Função para formatar percentual
  const formatarPercentual = (valor: number): string => {
    return `${valor > 0 ? '+' : ''}${valor.toFixed(1)}%`;
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Produção</h1>
          <p className="text-gray-600">
            Análise de desempenho e indicadores de produção
            {!carregando && (
              <span className="text-xs ml-2">
                Atualizado em {formatarDataHora(ultimaAtualizacao)}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter size={16} className="mr-1" />
            Filtros
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
            onClick={() => carregarDados()}
            disabled={carregando}
          >
            <RefreshCw size={16} className={`mr-1 ${carregando ? 'animate-spin' : ''}`} />
            {carregando ? 'Atualizando...' : 'Atualizar'}
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
          >
            <Download size={16} className="mr-1" />
            Exportar
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={periodoSelecionado}
                onChange={(e) => setPeriodoSelecionado(e.target.value as any)}
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Últimos 7 dias</option>
                <option value="mes">Último mês</option>
                <option value="trimestre">Último trimestre</option>
                <option value="ano">Último ano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Produtos</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="todos">Todos os produtos</option>
                <option value="necessaire">Necessaire Paris</option>
                <option value="bolsa">Bolsa Tote</option>
                <option value="porta_documentos">Porta Documentos</option>
                <option value="kit">Kit Necessaires</option>
                <option value="mochila">Mochila Urban</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Equipe</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="todos">Toda a equipe</option>
                <option value="corte">Equipe de Corte</option>
                <option value="costura">Equipe de Costura</option>
                <option value="bordado">Equipe de Bordado</option>
                <option value="acabamento">Equipe de Acabamento</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
            >
              Limpar
            </button>
            <button 
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              onClick={() => setMostrarFiltros(false)}
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
      
      {/* Indicadores Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {indicadoresProducao.map((indicador) => (
          <div key={indicador.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${
              indicador.variacao > 0 
                ? (indicador.id === 'pedidos_atrasados' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')
                : (indicador.id === 'pedidos_atrasados' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')
            }`}>
              <indicador.icone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{indicador.titulo}</p>
              <p className="text-2xl font-bold">
                {formatarNumero(indicador.valor)} 
                <span className="text-lg font-normal">{indicador.unidade}</span>
              </p>
            </div>
            <div className={`ml-auto ${
              indicador.variacao > 0 
                ? (indicador.id === 'pedidos_atrasados' ? 'text-red-600' : 'text-green-600')
                : (indicador.id === 'pedidos_atrasados' ? 'text-green-600' : 'text-red-600')
            }`}>
              <div className="flex items-center">
                {indicador.variacao > 0 
                  ? (indicador.id === 'pedidos_atrasados' ? <ArrowUp size={16} /> : <ArrowUp size={16} />)
                  : (indicador.id === 'pedidos_atrasados' ? <ArrowDown size={16} /> : <ArrowDown size={16} />)
                }
                <span className="ml-1">{formatarPercentual(indicador.variacao)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Gráficos - Primeira Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Produção por Tempo */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Produção Diária</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={producaoPorTempo}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorProducao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0079BF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0079BF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={(value) => {
                    const data = new Date(value);
                    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => [`${value} unidades`, 'Produção']}
                  labelFormatter={(value) => {
                    const data = new Date(value);
                    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="producao" 
                  stroke="#0079BF" 
                  fillOpacity={1} 
                  fill="url(#colorProducao)" 
                  name="Produção"
                />
                <Line 
                  type="monotone" 
                  dataKey="meta" 
                  stroke="#FF9F1A" 
                  strokeWidth={2} 
                  dot={false}
                  name="Meta"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de Produção por Etapa */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Produção por Etapa</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={producaoPorEtapa}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return name === 'Quantidade' 
                      ? [`${value} unidades`, name] 
                      : [`${value} minutos`, name];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="quantidade" 
                  name="Quantidade" 
                  radius={[4, 4, 0, 0]}
                >
                  {producaoPorEtapa.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Bar>
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="tempoMedio" 
                  stroke="#FF9F1A" 
                  name="Tempo Médio" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Gráficos - Segunda Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico de Distribuição de Prioridades */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Distribuição de Prioridades</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoPrioridades}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  nameKey="nome"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {distribuicaoPrioridades.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} pedidos`, 'Quantidade']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de Eficiência por Produto */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Eficiência por Produto</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eficienciaPorProduto}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                <YAxis dataKey="nome" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Eficiência']}
                />
                <Legend />
                <Bar 
                  dataKey="eficiencia" 
                  fill="#34A853" 
                  name="Eficiência" 
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de Utilização de Insumos */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Utilização de Insumos</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={utilizacaoInsumos}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="nome" type="category" tick={{ fontSize: 12 }} width={100} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return [`${value} unidades`, name === 'utilizado' ? 'Utilizado' : 'Disponível'];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="utilizado" 
                  stackId="a" 
                  fill="#0079BF" 
                  name="Utilizado" 
                />
                <Bar 
                  dataKey="disponivel" 
                  stackId="a" 
                  fill="#E0E0E0" 
                  name="Disponível" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Gráficos - Terceira Linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Tendência de Entregas */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Tendência de Entregas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tendenciaEntregas}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return [`${value} pedidos`, name === 'pontual' ? 'Pontual' : name === 'atrasado' ? 'Atrasado' : 'Total'];
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="pontual" 
                  stackId="a" 
                  fill="#34A853" 
                  name="Pontual" 
                />
                <Bar 
                  dataKey="atrasado" 
                  stackId="a" 
                  fill="#EA4335" 
                  name="Atrasado" 
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#0079BF" 
                  name="Total" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de Produtividade da Equipe */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Produtividade da Equipe</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={produtividadeEquipe}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 120]} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    return name === 'Eficiência' 
                      ? [`${value}%`, name] 
                      : [`${value} unidades`, name];
                  }}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="producao" 
                  fill="#0079BF" 
                  name="Produção" 
                />
                <Bar 
                  yAxisId="left" 
                  dataKey="meta" 
                  fill="#E0E0E0" 
                  name="Meta" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="eficiencia" 
                  stroke="#FBBC05" 
                  name="Eficiência" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Resumo de Desempenho */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Resumo de Desempenho</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Produtos Mais Produzidos</h4>
            <div className="space-y-2">
              {eficienciaPorProduto.sort((a, b) => b.quantidade - a.quantidade).slice(0, 3).map((produto, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                  <span>{produto.nome}</span>
                  <span className="font-medium">{produto.quantidade} unidades</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Gargalos de Produção</h4>
            <div className="space-y-2">
              {producaoPorEtapa
                .filter(etapa => etapa.nome !== 'Finalizado')
                .sort((a, b) => b.tempoMedio - a.tempoMedio)
                .slice(0, 3)
                .map((etapa, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>Etapa: {etapa.nome}</span>
                    <span className="font-medium">{etapa.tempoMedio} min/unidade</span>
                  </div>
                ))
              }
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Insumos Críticos</h4>
            <div className="space-y-2">
              {utilizacaoInsumos
                .map(insumo => ({
                  ...insumo,
                  percentual: (insumo.utilizado / insumo.disponivel) * 100
                }))
                .sort((a, b) => b.percentual - a.percentual)
                .slice(0, 3)
                .map((insumo, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <span>{insumo.nome}</span>
                    <span className={`font-medium ${insumo.percentual > 80 ? 'text-red-600' : insumo.percentual > 60 ? 'text-orange-600' : 'text-green-600'}`}>
                      {insumo.percentual.toFixed(0)}% utilizado
                    </span>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGraficos;
