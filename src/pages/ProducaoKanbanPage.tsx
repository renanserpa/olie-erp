import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AlertTriangle, Clock, CheckCircle, MoreHorizontal, Plus, Filter, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

// Tipos de dados
interface OrdemProducao {
  id: number;
  pedido_id: number;
  produto_id: number;
  cliente_id: number;
  prioridade: 'baixa' | 'normal' | 'alta';
  responsavel_id: string;
  data_inicio: string;
  data_entrega_prevista: string;
  etapa_atual: string;
  status: 'aberta' | 'em andamento' | 'finalizada' | 'pausada' | 'cancelada';
  observacoes?: string;
  
  // Dados relacionados
  produto?: {
    nome: string;
  };
  cliente?: {
    nome: string;
  };
  responsavel?: {
    nome: string;
  };
}

// Etapas de produção
const etapasProducao = [
  { id: 'aguardando', nome: 'Aguardando' },
  { id: 'corte', nome: 'Corte' },
  { id: 'costura', nome: 'Costura' },
  { id: 'montagem', nome: 'Montagem' },
  { id: 'revisao', nome: 'Revisão' },
  { id: 'finalizado', nome: 'Finalizado' }
];

const ProducaoKanbanPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [ordens, setOrdens] = useState<OrdemProducao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    prioridade: '',
    responsavel: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar ordens de produção
  useEffect(() => {
    const fetchOrdens = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const ordensSimuladas: OrdemProducao[] = [
          {
            id: 1,
            pedido_id: 101,
            produto_id: 1,
            cliente_id: 1,
            prioridade: 'alta',
            responsavel_id: '1',
            data_inicio: '2025-05-15',
            data_entrega_prevista: '2025-05-25',
            etapa_atual: 'corte',
            status: 'em andamento',
            produto: { nome: 'Bolsa Personalizada' },
            cliente: { nome: 'Maria Silva' },
            responsavel: { nome: 'João Costa' }
          },
          {
            id: 2,
            pedido_id: 102,
            produto_id: 2,
            cliente_id: 2,
            prioridade: 'normal',
            responsavel_id: '2',
            data_inicio: '2025-05-16',
            data_entrega_prevista: '2025-05-26',
            etapa_atual: 'aguardando',
            status: 'aberta',
            produto: { nome: 'Necessaire Floral' },
            cliente: { nome: 'Carlos Santos' },
            responsavel: { nome: 'Ana Oliveira' }
          },
          {
            id: 3,
            pedido_id: 103,
            produto_id: 3,
            cliente_id: 3,
            prioridade: 'baixa',
            responsavel_id: '1',
            data_inicio: '2025-05-14',
            data_entrega_prevista: '2025-05-30',
            etapa_atual: 'costura',
            status: 'em andamento',
            produto: { nome: 'Mochila Infantil' },
            cliente: { nome: 'Pedro Alves' },
            responsavel: { nome: 'João Costa' }
          },
          {
            id: 4,
            pedido_id: 104,
            produto_id: 4,
            cliente_id: 4,
            prioridade: 'alta',
            responsavel_id: '3',
            data_inicio: '2025-05-10',
            data_entrega_prevista: '2025-05-20',
            etapa_atual: 'montagem',
            status: 'em andamento',
            produto: { nome: 'Bolsa Térmica' },
            cliente: { nome: 'Lucia Ferreira' },
            responsavel: { nome: 'Roberto Silva' }
          },
          {
            id: 5,
            pedido_id: 105,
            produto_id: 5,
            cliente_id: 5,
            prioridade: 'normal',
            responsavel_id: '2',
            data_inicio: '2025-05-12',
            data_entrega_prevista: '2025-05-22',
            etapa_atual: 'revisao',
            status: 'em andamento',
            produto: { nome: 'Porta Documentos' },
            cliente: { nome: 'Fernanda Lima' },
            responsavel: { nome: 'Ana Oliveira' }
          },
          {
            id: 6,
            pedido_id: 106,
            produto_id: 6,
            cliente_id: 6,
            prioridade: 'baixa',
            responsavel_id: '3',
            data_inicio: '2025-05-05',
            data_entrega_prevista: '2025-05-15',
            etapa_atual: 'finalizado',
            status: 'finalizada',
            produto: { nome: 'Estojo Escolar' },
            cliente: { nome: 'Gabriel Mendes' },
            responsavel: { nome: 'Roberto Silva' }
          }
        ];
        
        setOrdens(ordensSimuladas);
      } catch (error) {
        console.error('Erro ao buscar ordens de produção:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdens();
  }, []);
  
  // Filtrar ordens
  const ordensFiltered = ordens.filter(ordem => {
    // Filtro por prioridade
    if (filtro.prioridade && ordem.prioridade !== filtro.prioridade) {
      return false;
    }
    
    // Filtro por responsável
    if (filtro.responsavel && ordem.responsavel_id !== filtro.responsavel) {
      return false;
    }
    
    // Filtro por busca (produto ou cliente)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const produtoMatch = ordem.produto?.nome.toLowerCase().includes(termoBusca);
      const clienteMatch = ordem.cliente?.nome.toLowerCase().includes(termoBusca);
      const idMatch = ordem.id.toString().includes(termoBusca);
      
      if (!produtoMatch && !clienteMatch && !idMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Agrupar ordens por etapa
  const ordensPorEtapa = etapasProducao.reduce((acc, etapa) => {
    acc[etapa.id] = ordensFiltered.filter(ordem => 
      ordem.etapa_atual.toLowerCase() === etapa.id.toLowerCase()
    );
    return acc;
  }, {} as Record<string, OrdemProducao[]>);
  
  // Manipular drag and drop
  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Verificar se o item foi solto em uma área válida
    if (!destination) {
      return;
    }
    
    // Verificar se o item foi movido para uma posição diferente
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // Obter a ordem que foi movida
    const ordemId = parseInt(draggableId.replace('ordem-', ''));
    const ordem = ordens.find(o => o.id === ordemId);
    
    if (!ordem) {
      return;
    }
    
    // Atualizar a etapa da ordem
    const novaEtapa = destination.droppableId;
    
    // Atualizar localmente
    const ordensAtualizadas = ordens.map(o => 
      o.id === ordemId ? { ...o, etapa_atual: novaEtapa } : o
    );
    
    setOrdens(ordensAtualizadas);
    
    // Em um ambiente real, isso seria salvo no Supabase
    try {
      // const { error } = await supabase
      //   .from('ordens_producao')
      //   .update({ etapa_atual: novaEtapa })
      //   .eq('id', ordemId);
      
      // if (error) throw error;
      
      console.log(`Ordem ${ordemId} movida para etapa ${novaEtapa}`);
    } catch (error) {
      console.error('Erro ao atualizar etapa da ordem:', error);
      
      // Reverter mudança em caso de erro
      setOrdens(ordens);
    }
  };
  
  // Renderizar card de ordem
  const renderOrdemCard = (ordem: OrdemProducao, index: number) => {
    // Definir cor de prioridade
    const prioridadeCor = {
      alta: 'bg-red-100 border-red-500 text-red-800',
      normal: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      baixa: 'bg-green-100 border-green-500 text-green-800'
    }[ordem.prioridade];
    
    // Verificar se está atrasada
    const dataEntrega = new Date(ordem.data_entrega_prevista);
    const hoje = new Date();
    const atrasada = dataEntrega < hoje && ordem.etapa_atual !== 'finalizado';
    
    return (
      <Draggable 
        draggableId={`ordem-${ordem.id}`} 
        index={index}
        key={ordem.id}
      >
        {(provided: any) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white rounded-md shadow-sm p-3 mb-2 border-l-4 ${prioridadeCor}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  #{ordem.id} - {ordem.produto?.nome}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Cliente: {ordem.cliente?.nome}
                </div>
              </div>
              <div className="flex items-center">
                {atrasada && (
                  <div className="mr-2 text-red-500" title="Atrasada">
                    <AlertTriangle size={16} />
                  </div>
                )}
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-500">
                <Clock size={14} className="inline mr-1" />
                {new Date(ordem.data_entrega_prevista).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-xs text-gray-500">
                {ordem.responsavel?.nome}
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  ordem.status === 'finalizada' 
                    ? 'bg-green-100 text-green-800' 
                    : ordem.status === 'em andamento'
                      ? 'bg-blue-100 text-blue-800'
                      : ordem.status === 'pausada'
                        ? 'bg-gray-100 text-gray-800'
                        : ordem.status === 'cancelada'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {ordem.status.charAt(0).toUpperCase() + ordem.status.slice(1)}
                </span>
              </div>
              <div className="text-xs">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  ordem.prioridade === 'alta' 
                    ? 'bg-red-100 text-red-800' 
                    : ordem.prioridade === 'normal'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                }`}>
                  {ordem.prioridade.charAt(0).toUpperCase() + ordem.prioridade.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    );
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Kanban de Produção</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar produto ou cliente..."
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
                    Prioridade
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.prioridade}
                    onChange={(e) => setFiltro(prev => ({ ...prev, prioridade: e.target.value }))}
                  >
                    <option value="">Todas</option>
                    <option value="alta">Alta</option>
                    <option value="normal">Normal</option>
                    <option value="baixa">Baixa</option>
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
                
                <div className="flex items-end">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    onClick={() => setFiltro({ prioridade: '', responsavel: '', busca: '' })}
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando ordens de produção...</div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {etapasProducao.map((etapa) => (
                <div key={etapa.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 flex justify-between items-center">
                      {etapa.nome}
                      <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                        {ordensPorEtapa[etapa.id]?.length || 0}
                      </span>
                    </h3>
                  </div>
                  
                  <Droppable droppableId={etapa.id}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-2 min-h-[200px] max-h-[calc(100vh-200px)] overflow-y-auto"
                      >
                        {ordensPorEtapa[etapa.id]?.map((ordem, index) => 
                          renderOrdemCard(ordem, index)
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};

export default ProducaoKanbanPage;
