import React, { useState, useEffect } from 'react';
import { 
  Filter, Search, AlertTriangle, Clock, 
  ChevronDown, ChevronUp, List, BarChart2, 
  TrendingUp, TrendingDown, Users, Target, 
  Calendar, CheckSquare, PlayCircle, PauseCircle, StopCircle
} from 'lucide-react';

// Interfaces para o Dashboard de Produção
interface Pedido {
  id: string;
  codigo: string;
  cliente: { nome: string };
  dataEntrega: string | null;
  status: StatusPedido;
  itens: ItemPedido[];
  prioridade: 'baixa' | 'normal' | 'alta' | 'urgente';
}

type StatusPedido = 
  'novo' | 
  'analise' | 
  'aprovado' | 
  'producao' | 
  'pronto' | 
  'enviado' | 
  'entregue' | 
  'cancelado';

interface ItemPedido {
  id: string;
  pedidoId: string;
  produto: { nome: string, referencia: string };
  quantidade: number;
  tempoProducaoEstimado: number;
  statusProducao: StatusProducao;
  dataInicioProducao: string | null;
  dataFimProducao: string | null;
  responsavel: string | null;
}

type StatusProducao = 
  'aguardando' | 
  'separacao' | 
  'corte' | 
  'bordado' | 
  'costura' | 
  'acabamento' | 
  'finalizado';

interface ProducaoPorEtapa {
  etapa: StatusProducao;
  quantidade: number;
  tempoMedioMinutos: number;
}

interface IndicadorDesempenho {
  nome: string;
  valor: string | number;
  unidade: string;
  tendencia: 'subindo' | 'descendo' | 'estavel';
  icone: React.ElementType;
}

// Componente principal do Dashboard de Produção
const DashboardProducao: React.FC = () => {
  // Estados para gerenciar os dados
  const [pedidosProducao, setPedidosProducao] = useState<Pedido[]>([]);
  const [itensProducao, setItensProducao] = useState<ItemPedido[]>([]);
  const [producaoPorEtapa, setProducaoPorEtapa] = useState<ProducaoPorEtapa[]>([]);
  const [indicadores, setIndicadores] = useState<IndicadorDesempenho[]>([]);
  const [filtros, setFiltros] = useState({
    termo: '',
    etapa: 'todas',
    prioridade: 'todas',
    periodo: 'hoje'
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Efeito para carregar e processar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados de pedidos
    // Em um ambiente real, isso seria uma chamada à API buscando pedidos com status 'producao'
    const carregarDados = async () => {
      // Dados simulados (baseados nos pedidos criados no PedidosModule)
      const pedidosSimulados: Pedido[] = [
        // ... (Incluir aqui uma amostra de pedidos com status 'producao')
        // Exemplo:
        {
          id: 'ped-001',
          codigo: 'P20250001',
          cliente: { nome: 'Maria Silva' },
          dataEntrega: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 dias
          status: 'producao',
          prioridade: 'alta',
          itens: [
            {
              id: 'item-1-0',
              pedidoId: 'ped-001',
              produto: { nome: 'Necessaire Paris', referencia: 'NEC-001' },
              quantidade: 2,
              tempoProducaoEstimado: 30,
              statusProducao: 'corte',
              dataInicioProducao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
              dataFimProducao: null,
              responsavel: 'João'
            },
            {
              id: 'item-1-1',
              pedidoId: 'ped-001',
              produto: { nome: 'Bolsa Tote', referencia: 'BOL-001' },
              quantidade: 1,
              tempoProducaoEstimado: 40,
              statusProducao: 'separacao',
              dataInicioProducao: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              dataFimProducao: null,
              responsavel: 'Ana'
            }
          ]
        },
        {
          id: 'ped-002',
          codigo: 'P20250002',
          cliente: { nome: 'João Oliveira' },
          dataEntrega: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias
          status: 'producao',
          prioridade: 'urgente',
          itens: [
            {
              id: 'item-2-0',
              pedidoId: 'ped-002',
              produto: { nome: 'Necessaire Paris', referencia: 'NEC-001' },
              quantidade: 1,
              tempoProducaoEstimado: 35, // Com personalização
              statusProducao: 'bordado',
              dataInicioProducao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
              dataFimProducao: null,
              responsavel: 'Carlos'
            }
          ]
        },
        {
          id: 'ped-003',
          codigo: 'P20250003',
          cliente: { nome: 'Ana Pereira' },
          dataEntrega: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias
          status: 'producao',
          prioridade: 'normal',
          itens: [
            {
              id: 'item-3-0',
              pedidoId: 'ped-003',
              produto: { nome: 'Bolsa Tote', referencia: 'BOL-001' },
              quantidade: 3,
              tempoProducaoEstimado: 40,
              statusProducao: 'costura',
              dataInicioProducao: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
              dataFimProducao: null,
              responsavel: 'Maria'
            }
          ]
        }
      ];

      setPedidosProducao(pedidosSimulados);

      // Extrair todos os itens em produção
      const todosItens = pedidosSimulados.flatMap(p => p.itens);
      setItensProducao(todosItens);

      // Calcular produção por etapa
      const etapas: StatusProducao[] = ['separacao', 'corte', 'bordado', 'costura', 'acabamento'];
      const producaoEtapa: ProducaoPorEtapa[] = etapas.map(etapa => {
        const itensNaEtapa = todosItens.filter(item => item.statusProducao === etapa);
        const quantidade = itensNaEtapa.reduce((sum, item) => sum + item.quantidade, 0);
        // Simulação de tempo médio
        const tempoMedio = Math.floor(Math.random() * 30) + 10; 
        return { etapa, quantidade, tempoMedioMinutos: tempoMedio };
      });
      setProducaoPorEtapa(producaoEtapa);

      // Calcular indicadores de desempenho (simulados)
      const indicadoresSimulados: IndicadorDesempenho[] = [
        {
          nome: 'Itens em Produção',
          valor: todosItens.reduce((sum, item) => sum + item.quantidade, 0),
          unidade: 'unid.',
          tendencia: 'estavel',
          icone: List
        },
        {
          nome: 'Pedidos Atrasados',
          valor: pedidosSimulados.filter(p => p.dataEntrega && new Date(p.dataEntrega) < new Date()).length,
          unidade: 'pedidos',
          tendencia: 'subindo',
          icone: AlertTriangle
        },
        {
          nome: 'Tempo Médio por Item',
          valor: 45, // Simulado
          unidade: 'min',
          tendencia: 'descendo',
          icone: Clock
        },
        {
          nome: 'Eficiência Geral',
          valor: 85, // Simulado
          unidade: '%',
          tendencia: 'estavel',
          icone: Target
        }
      ];
      setIndicadores(indicadoresSimulados);
    };

    carregarDados();
  }, []);

  // Função para filtrar itens em produção
  const itensFiltrados = itensProducao.filter(item => {
    const pedido = pedidosProducao.find(p => p.id === item.pedidoId);
    if (!pedido) return false;

    const matchTermo = item.produto.nome.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      item.produto.referencia.toLowerCase().includes(filtros.termo.toLowerCase()) ||
                      pedido.codigo.toLowerCase().includes(filtros.termo.toLowerCase());
    
    const matchEtapa = filtros.etapa === 'todas' || item.statusProducao === filtros.etapa;
    
    const matchPrioridade = filtros.prioridade === 'todas' || pedido.prioridade === filtros.prioridade;
    
    // Filtro de período (simplificado para "hoje")
    let matchPeriodo = true;
    if (filtros.periodo === 'hoje') {
      // Lógica para verificar se o item foi trabalhado hoje (simplificado)
      matchPeriodo = item.dataInicioProducao ? new Date(item.dataInicioProducao).toDateString() === new Date().toDateString() : false;
    }
    
    return matchTermo && matchEtapa && matchPrioridade && matchPeriodo;
  });

  // Função para verificar se um item está atrasado
  const isAtrasado = (item: ItemPedido): boolean => {
    const pedido = pedidosProducao.find(p => p.id === item.pedidoId);
    if (!pedido || !pedido.dataEntrega) return false;
    // Lógica simplificada: considera atrasado se a data de entrega está próxima e o item não está finalizado
    const hoje = new Date();
    const dataEntrega = new Date(pedido.dataEntrega);
    const diffDias = (dataEntrega.getTime() - hoje.getTime()) / (1000 * 3600 * 24);
    return diffDias < 2 && item.statusProducao !== 'finalizado'; 
  };

  // Função para obter cor de prioridade
  const getCorPrioridade = (prioridade: 'baixa' | 'normal' | 'alta' | 'urgente'): string => {
    switch (prioridade) {
      case 'baixa': return 'bg-blue-100 text-blue-800';
      case 'normal': return 'bg-green-100 text-green-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter cor de status de produção
  const getCorStatusProducao = (status: StatusProducao): string => {
    switch (status) {
      case 'aguardando': return 'bg-gray-100 text-gray-800';
      case 'separacao': return 'bg-blue-100 text-blue-800';
      case 'corte': return 'bg-purple-100 text-purple-800';
      case 'bordado': return 'bg-pink-100 text-pink-800';
      case 'costura': return 'bg-yellow-100 text-yellow-800';
      case 'acabamento': return 'bg-indigo-100 text-indigo-800';
      case 'finalizado': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Produção</h1>
          <p className="text-gray-600">Acompanhe o fluxo de produção do ateliê</p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter size={16} className="mr-1" />
            Filtros
          </button>
          {/* Adicionar botões de ação rápida se necessário */}
        </div>
      </div>
      
      {/* Filtros */}
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="Produto, Ref. ou Pedido"
                  value={filtros.termo}
                  onChange={(e) => setFiltros({...filtros, termo: e.target.value})}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Etapa</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.etapa}
                onChange={(e) => setFiltros({...filtros, etapa: e.target.value as any})}
              >
                <option value="todas">Todas</option>
                <option value="separacao">Separação</option>
                <option value="corte">Corte</option>
                <option value="bordado">Bordado</option>
                <option value="costura">Costura</option>
                <option value="acabamento">Acabamento</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.prioridade}
                onChange={(e) => setFiltros({...filtros, prioridade: e.target.value as any})}
              >
                <option value="todas">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.periodo}
                onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Esta Semana</option>
                <option value="mes">Este Mês</option>
                <option value="todos">Todos</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => setFiltros({termo: '', etapa: 'todas', prioridade: 'todas', periodo: 'hoje'})}
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
      
      {/* Indicadores de Desempenho */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {indicadores.map((ind, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-center">
            <div className={`p-3 rounded-full mr-4 ${ind.tendencia === 'subindo' ? 'bg-red-100 text-red-600' : ind.tendencia === 'descendo' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
              <ind.icone size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{ind.nome}</p>
              <p className="text-2xl font-bold">{ind.valor} <span className="text-lg font-normal">{ind.unidade}</span></p>
            </div>
            {ind.tendencia !== 'estavel' && (
              <div className={`ml-auto ${ind.tendencia === 'subindo' ? 'text-red-600' : 'text-green-600'}`}>
                {ind.tendencia === 'subindo' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Produção por Etapa */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold mb-4">Produção por Etapa</h3>
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {producaoPorEtapa.map((etapaData) => (
            <div key={etapaData.etapa} className="min-w-[150px] bg-gray-50 p-3 rounded-md text-center">
              <p className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mb-2 ${getCorStatusProducao(etapaData.etapa)}`}>
                {etapaData.etapa.charAt(0).toUpperCase() + etapaData.etapa.slice(1)}
              </p>
              <p className="text-xl font-bold">{etapaData.quantidade}</p>
              <p className="text-sm text-gray-500">Itens</p>
              <p className="text-xs text-gray-500 mt-1">Tempo Médio: {etapaData.tempoMedioMinutos} min</p>
            </div>
          ))}
        </div>
        {/* Poderia adicionar um gráfico de barras aqui */}
      </div>
      
      {/* Lista de Itens em Produção */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h3 className="text-lg font-semibold p-4">Itens em Produção</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item / Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etapa Atual
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Previsão Entrega
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itensFiltrados.map(item => {
              const pedido = pedidosProducao.find(p => p.id === item.pedidoId);
              const atrasado = isAtrasado(item);
              return (
                <tr key={item.id} className={`hover:bg-gray-50 ${atrasado ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.produto.nome} ({item.quantidade}x)</div>
                    <div className="text-sm text-gray-500">{pedido?.codigo} - {pedido?.cliente.nome}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatusProducao(item.statusProducao)}`}>
                      {item.statusProducao.charAt(0).toUpperCase() + item.statusProducao.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pedido && (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorPrioridade(pedido.prioridade)}`}>
                        {pedido.prioridade.charAt(0).toUpperCase() + pedido.prioridade.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.responsavel || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {pedido?.dataEntrega ? new Date(pedido.dataEntrega).toLocaleDateString('pt-BR') : '-'}
                    {atrasado && <AlertTriangle size={14} className="inline ml-1 text-red-500"/>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Botões de ação para produção (ex: iniciar, pausar, finalizar etapa) */}
                    <button className="text-blue-600 hover:text-blue-900 mr-2" title="Iniciar Etapa">
                      <PlayCircle size={18} />
                    </button>
                    <button className="text-orange-600 hover:text-orange-900 mr-2" title="Pausar Etapa">
                      <PauseCircle size={18} />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Finalizar Etapa">
                      <CheckSquare size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardProducao;

