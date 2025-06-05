import React, { useState, useEffect } from 'react';
import { 
  Truck, Package, MapPin, Calendar, User, Search, Filter, 
  Plus, Edit, Trash2, Eye, CheckCircle, XCircle, AlertTriangle, 
  Navigation, Clock, ArrowRight, ArrowLeft, MoreHorizontal, 
  Download, Upload, List, Grid, Settings, BarChart2
} from 'lucide-react';

// Interfaces para o módulo Logística
interface Entrega {
  id: string;
  pedidoId: string;
  clienteId: string;
  dataEnvio: string;
  dataPrevistaEntrega: string;
  dataEntregaReal: string | null;
  status: 'pendente' | 'em_transito' | 'entregue' | 'atrasado' | 'falha_entrega' | 'cancelado';
  transportadoraId: string;
  codigoRastreio: string | null;
  enderecoEntrega: {
    rua: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  valorFrete: number;
  pesoTotal: number;
  volumeTotal: number;
  observacoes: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface Recebimento {
  id: string;
  fornecedorId: string;
  notaFiscal: string;
  dataRecebimento: string;
  status: 'agendado' | 'recebido' | 'parcialmente_recebido' | 'recusado' | 'cancelado';
  itens: Array<{ produtoId: string; quantidadeEsperada: number; quantidadeRecebida: number; lote: string | null; validade: string | null }>;
  transportadora: string | null;
  motorista: string | null;
  placaVeiculo: string | null;
  observacoes: string;
  conferidoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface Transportadora {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  telefone: string;
  email: string;
  endereco: {
    rua: string;
    numero: string;
    complemento: string | null;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  servicosOferecidos: string[];
  tabelaFrete: string | null; // Link ou referência
  ativa: boolean;
}

interface EventoRastreio {
  id: string;
  entregaId: string;
  dataHora: string;
  localizacao: string;
  descricao: string;
  statusOriginal: string;
}

// Componente principal do módulo Logística
const LogisticaModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [recebimentos, setRecebimentos] = useState<Recebimento[]>([]);
  const [transportadoras, setTransportadoras] = useState<Transportadora[]>([]);
  
  const [abaSelecionada, setAbaSelecionada] = useState<'entregas' | 'recebimentos' | 'transportadoras' | 'configuracoes'>('entregas');
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'lista' | 'mapa' | 'kanban'>('lista');
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState<string>('todos');
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano'>('mes');
  
  const [mostrarFormEntrega, setMostrarFormEntrega] = useState(false);
  const [entregaSelecionada, setEntregaSelecionada] = useState<Entrega | null>(null);
  const [mostrarDetalhesEntrega, setMostrarDetalhesEntrega] = useState(false);
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados
    const carregarDados = async () => {
      const hoje = new Date();
      
      // Dados simulados de transportadoras
      const transportadorasSimuladas: Transportadora[] = [
        {
          id: 'transp-1',
          nome: 'Correios',
          cnpj: '34.028.316/0001-03',
          contato: 'Central de Atendimento',
          telefone: '3003-0100',
          email: 'faleconosco@correios.com.br',
          endereco: { rua: 'SCN Quadra 01 Bloco E', numero: 's/n', complemento: 'Ed. Sede', bairro: 'Asa Norte', cidade: 'Brasília', estado: 'DF', cep: '70711-900' },
          servicosOferecidos: ['SEDEX', 'PAC', 'SEDEX 10'],
          tabelaFrete: 'https://www.correios.com.br/precos-e-prazos/servicos-nacionais/sedex',
          ativa: true
        },
        {
          id: 'transp-2',
          nome: 'Jadlog',
          cnpj: '04.884.082/0001-35',
          contato: 'SAC',
          telefone: '0800 728 1212',
          email: 'contato@jadlog.com.br',
          endereco: { rua: 'Av. Jornalista Paulo Zingg', numero: '1301', complemento: '', bairro: 'Jaraguá', cidade: 'São Paulo', estado: 'SP', cep: '05157-030' },
          servicosOferecidos: ['.Package', '.Com', 'Express'],
          tabelaFrete: 'https://www.jadlog.com.br/jadlog/servicos',
          ativa: true
        },
        {
          id: 'transp-3',
          nome: 'Loggi',
          cnpj: '18.070.189/0001-84',
          contato: 'Suporte',
          telefone: '(11) 4020-1460',
          email: 'ajuda@loggi.com',
          endereco: { rua: 'Cardeal Arcoverde', numero: '2365', complemento: '5º andar', bairro: 'Pinheiros', cidade: 'São Paulo', estado: 'SP', cep: '05407-003' },
          servicosOferecidos: ['Loggi Expresso', 'Loggi Envios'],
          tabelaFrete: 'https://www.loggi.com/envios/precos/',
          ativa: true
        }
      ];
      
      // Dados simulados de entregas
      const entregasSimuladas: Entrega[] = [
        {
          id: 'entrega-1',
          pedidoId: 'ped-001',
          clienteId: 'cli-001',
          dataEnvio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString(),
          dataPrevistaEntrega: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString(),
          dataEntregaReal: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString(),
          status: 'entregue',
          transportadoraId: 'transp-1',
          codigoRastreio: 'QB123456789BR',
          enderecoEntrega: { rua: 'Rua das Flores', numero: '123', complemento: 'Apto 45', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
          valorFrete: 25.50,
          pesoTotal: 0.8,
          volumeTotal: 0.01,
          observacoes: 'Entregar em horário comercial.',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 6).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString()
        },
        {
          id: 'entrega-2',
          pedidoId: 'ped-002',
          clienteId: 'cli-002',
          dataEnvio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString(),
          dataPrevistaEntrega: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 2).toISOString(),
          dataEntregaReal: null,
          status: 'em_transito',
          transportadoraId: 'transp-2',
          codigoRastreio: 'JD00987654321',
          enderecoEntrega: { rua: 'Av. Principal', numero: '456', complemento: null, bairro: 'Jardins', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '22000-000' },
          valorFrete: 35.00,
          pesoTotal: 1.2,
          volumeTotal: 0.02,
          observacoes: '',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 4).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString()
        },
        {
          id: 'entrega-3',
          pedidoId: 'ped-003',
          clienteId: 'cli-003',
          dataEnvio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString(),
          dataPrevistaEntrega: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 5).toISOString(),
          dataEntregaReal: null,
          status: 'pendente',
          transportadoraId: 'transp-3',
          codigoRastreio: null,
          enderecoEntrega: { rua: 'Alameda dos Anjos', numero: '789', complemento: 'Casa 2', bairro: 'Boa Vista', cidade: 'Curitiba', estado: 'PR', cep: '80000-000' },
          valorFrete: 18.90,
          pesoTotal: 0.5,
          volumeTotal: 0.008,
          observacoes: 'Cliente solicitou embalagem discreta.',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString()
        },
        {
          id: 'entrega-4',
          pedidoId: 'ped-004',
          clienteId: 'cli-003',
          dataEnvio: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 10).toISOString(),
          dataPrevistaEntrega: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7).toISOString(),
          dataEntregaReal: null,
          status: 'atrasado',
          transportadoraId: 'transp-1',
          codigoRastreio: 'QB987654321BR',
          enderecoEntrega: { rua: 'Alameda dos Anjos', numero: '789', complemento: 'Casa 2', bairro: 'Boa Vista', cidade: 'Curitiba', estado: 'PR', cep: '80000-000' },
          valorFrete: 45.00,
          pesoTotal: 5.0,
          volumeTotal: 0.1,
          observacoes: 'Pedido corporativo grande.',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 11).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString()
        }
      ];
      
      // Dados simulados de recebimentos
      const recebimentosSimulados: Recebimento[] = [
        {
          id: 'receb-1',
          fornecedorId: 'forn-001',
          notaFiscal: 'NF12345',
          dataRecebimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7).toISOString(),
          status: 'recebido',
          itens: [
            { produtoId: 'insumo-1', quantidadeEsperada: 100, quantidadeRecebida: 100, lote: 'LOTE-A1', validade: null },
            { produtoId: 'insumo-2', quantidadeEsperada: 50, quantidadeRecebida: 50, lote: 'LOTE-B2', validade: new Date(hoje.getFullYear() + 1, hoje.getMonth(), hoje.getDate()).toISOString() }
          ],
          transportadora: 'Transportadora XYZ',
          motorista: 'Carlos Silva',
          placaVeiculo: 'ABC-1234',
          observacoes: 'Tudo conforme o pedido.',
          conferidoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 8).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7).toISOString()
        },
        {
          id: 'receb-2',
          fornecedorId: 'forn-002',
          notaFiscal: 'NF67890',
          dataRecebimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString(),
          status: 'parcialmente_recebido',
          itens: [
            { produtoId: 'insumo-3', quantidadeEsperada: 200, quantidadeRecebida: 180, lote: 'LOTE-C3', validade: null },
            { produtoId: 'insumo-4', quantidadeEsperada: 100, quantidadeRecebida: 100, lote: 'LOTE-D4', validade: null }
          ],
          transportadora: null,
          motorista: null,
          placaVeiculo: null,
          observacoes: 'Faltaram 20 unidades do insumo-3. Fornecedor ciente.',
          conferidoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString()
        }
      ];
      
      setTransportadoras(transportadorasSimuladas);
      setEntregas(entregasSimuladas);
      setRecebimentos(recebimentosSimulados);
    };
    
    carregarDados();
  }, []);

  // Função para filtrar entregas
  const entregasFiltradas = entregas.filter(entrega => {
    // Filtro por status
    if (statusSelecionado !== 'todos' && entrega.status !== statusSelecionado) {
      return false;
    }
    
    // Filtro por período (data de envio)
    const dataEnvio = new Date(entrega.dataEnvio);
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    if (periodoSelecionado === 'hoje' && dataEnvio.getTime() < inicioHoje.getTime()) {
      return false;
    }
    
    if (periodoSelecionado === 'semana') {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - 7);
      if (dataEnvio.getTime() < inicioSemana.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'mes') {
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      if (dataEnvio.getTime() < inicioMes.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'trimestre') {
      const inicioTrimestre = new Date(hoje);
      inicioTrimestre.setMonth(hoje.getMonth() - 3);
      if (dataEnvio.getTime() < inicioTrimestre.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'ano') {
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);
      if (dataEnvio.getTime() < inicioAno.getTime()) {
        return false;
      }
    }
    
    // Filtro por termo de busca (pedido, cliente, rastreio)
    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      return (
        entrega.pedidoId.toLowerCase().includes(termoLower) ||
        entrega.clienteId.toLowerCase().includes(termoLower) ||
        (entrega.codigoRastreio && entrega.codigoRastreio.toLowerCase().includes(termoLower))
      );
    }
    
    return true;
  });

  // Função para formatar data
  const formatarData = (dataString: string | null): string => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Função para obter cor de status da entrega
  const getCorStatusEntrega = (status: Entrega['status']): string => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_transito': return 'bg-blue-100 text-blue-800';
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'atrasado': return 'bg-red-100 text-red-800';
      case 'falha_entrega': return 'bg-orange-100 text-orange-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter texto de status da entrega
  const getTextoStatusEntrega = (status: Entrega['status']): string => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_transito': return 'Em Trânsito';
      case 'entregue': return 'Entregue';
      case 'atrasado': return 'Atrasado';
      case 'falha_entrega': return 'Falha na Entrega';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  // Função para obter nome da transportadora
  const getNomeTransportadora = (transportadoraId: string): string => {
    const transportadora = transportadoras.find(t => t.id === transportadoraId);
    return transportadora ? transportadora.nome : 'Desconhecida';
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Logística</h1>
          <p className="text-gray-600">Gerencie entregas, recebimentos e transportadoras</p>
        </div>
        
        <div className="flex space-x-2">
          {abaSelecionada === 'entregas' && (
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter size={16} className="mr-1" />
              Filtros
            </button>
          )}
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
            onClick={() => {
              if (abaSelecionada === 'entregas') {
                setEntregaSelecionada(null);
                setMostrarFormEntrega(true);
              } else if (abaSelecionada === 'recebimentos') {
                // Lógica para novo recebimento
              } else if (abaSelecionada === 'transportadoras') {
                // Lógica para nova transportadora
              }
            }}
          >
            <Plus size={16} className="mr-1" />
            {abaSelecionada === 'entregas' ? 'Nova Entrega' : 
             abaSelecionada === 'recebimentos' ? 'Novo Recebimento' : 
             abaSelecionada === 'transportadoras' ? 'Nova Transportadora' : 'Novo'}
          </button>
        </div>
      </div>
      
      {/* Abas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'entregas'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('entregas')}
          >
            Entregas
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'recebimentos'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('recebimentos')}
          >
            Recebimentos
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'transportadoras'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('transportadoras')}
          >
            Transportadoras
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'configuracoes'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('configuracoes')}
          >
            Configurações
          </button>
        </nav>
      </div>
      
      {/* Filtros para Entregas */}
      {mostrarFiltros && abaSelecionada === 'entregas' && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="Pedido, Cliente ou Rastreio"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value)}
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendente</option>
                <option value="em_transito">Em Trânsito</option>
                <option value="entregue">Entregue</option>
                <option value="atrasado">Atrasado</option>
                <option value="falha_entrega">Falha na Entrega</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período (Envio)</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={periodoSelecionado}
                onChange={(e) => setPeriodoSelecionado(e.target.value as any)}
              >
                <option value="hoje">Hoje</option>
                <option value="semana">Últimos 7 dias</option>
                <option value="mes">Este mês</option>
                <option value="trimestre">Último trimestre</option>
                <option value="ano">Este ano</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Transportadora</label>
              <select className="w-full px-3 py-2 border rounded-md">
                <option value="todas">Todas</option>
                {transportadoras.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => {
                setTermoBusca('');
                setStatusSelecionado('todos');
                setPeriodoSelecionado('mes');
              }}
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
      
      {/* Conteúdo da aba Entregas */}
      {abaSelecionada === 'entregas' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">Lista de Entregas</h3>
              <div className="flex items-center bg-gray-100 rounded-md p-1">
                <button 
                  className={`p-1 rounded ${tipoVisualizacao === 'lista' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setTipoVisualizacao('lista')}
                >
                  <List size={18} />
                </button>
                <button 
                  className={`p-1 rounded ${tipoVisualizacao === 'mapa' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setTipoVisualizacao('mapa')}
                >
                  <MapPin size={18} />
                </button>
                <button 
                  className={`p-1 rounded ${tipoVisualizacao === 'kanban' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setTipoVisualizacao('kanban')}
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {entregasFiltradas.length} entregas encontradas
            </div>
          </div>
          
          {/* Visualização em Lista */}
          {tipoVisualizacao === 'lista' && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pedido / Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Destino
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transportadora / Rastreio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datas (Envio / Previsto)
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
                {entregasFiltradas.map(entrega => (
                  <tr key={entrega.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{entrega.pedidoId}</div>
                      <div className="text-xs text-gray-500">{entrega.clienteId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{entrega.enderecoEntrega.cidade} - {entrega.enderecoEntrega.estado}</div>
                      <div className="text-xs text-gray-500">{entrega.enderecoEntrega.cep}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getNomeTransportadora(entrega.transportadoraId)}</div>
                      <div className="text-xs text-blue-500 hover:underline cursor-pointer">{entrega.codigoRastreio || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatarData(entrega.dataEnvio)}</div>
                      <div className="text-xs text-gray-500">{formatarData(entrega.dataPrevistaEntrega)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatusEntrega(entrega.status)}`}>
                        {getTextoStatusEntrega(entrega.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => {
                          setEntregaSelecionada(entrega);
                          setMostrarDetalhesEntrega(true);
                        }}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setEntregaSelecionada(entrega);
                          setMostrarFormEntrega(true);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {/* Placeholder para outras visualizações */}
          {tipoVisualizacao === 'mapa' && (
            <div className="p-6 text-center text-gray-500">
              Visualização em Mapa (seria implementada aqui)
            </div>
          )}
          {tipoVisualizacao === 'kanban' && (
            <div className="p-6 text-center text-gray-500">
              Visualização em Kanban (seria implementada aqui)
            </div>
          )}
        </div>
      )}
      
      {/* Conteúdo da aba Recebimentos */}
      {abaSelecionada === 'recebimentos' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Lista de Recebimentos</h3>
          <div className="text-center text-gray-500">
            Funcionalidade de Recebimentos (seria implementada aqui)
          </div>
        </div>
      )}
      
      {/* Conteúdo da aba Transportadoras */}
      {abaSelecionada === 'transportadoras' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Lista de Transportadoras</h3>
          <div className="text-center text-gray-500">
            Gerenciamento de Transportadoras (seria implementado aqui)
          </div>
        </div>
      )}
      
      {/* Conteúdo da aba Configurações */}
      {abaSelecionada === 'configuracoes' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Configurações de Logística</h3>
          <div className="text-center text-gray-500">
            Configurações (seria implementado aqui)
          </div>
        </div>
      )}
      
      {/* Modal de Detalhes da Entrega */}
      {mostrarDetalhesEntrega && entregaSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-2 py-1 text-xs rounded-full mr-2 ${getCorStatusEntrega(entregaSelecionada.status)}`}>
                    {getTextoStatusEntrega(entregaSelecionada.status)}
                  </span>
                  <h2 className="text-2xl font-bold">Detalhes da Entrega #{entregaSelecionada.id.split('-')[1]}</h2>
                  <p className="text-sm text-gray-500">Pedido: {entregaSelecionada.pedidoId}</p>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarDetalhesEntrega(false)}
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              {/* Timeline de Rastreio (Simulado) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Rastreamento</h3>
                <div className="relative pl-6 border-l-2 border-gray-200">
                  {/* Evento 1 */}
                  <div className="mb-6">
                    <div className="absolute -left-2.5 top-1 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>
                    <p className="text-sm font-medium">Objeto entregue ao destinatário</p>
                    <p className="text-xs text-gray-500">{formatarData(entregaSelecionada.dataEntregaReal)} - {entregaSelecionada.enderecoEntrega.cidade}, {entregaSelecionada.enderecoEntrega.estado}</p>
                  </div>
                  {/* Evento 2 */}
                  <div className="mb-6">
                    <div className="absolute -left-2.5 top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                    <p className="text-sm font-medium">Objeto saiu para entrega ao destinatário</p>
                    <p className="text-xs text-gray-500">{formatarData(new Date(new Date(entregaSelecionada.dataEntregaReal!).setDate(new Date(entregaSelecionada.dataEntregaReal!).getDate() - 1)).toISOString())} - {entregaSelecionada.enderecoEntrega.cidade}, {entregaSelecionada.enderecoEntrega.estado}</p>
                  </div>
                  {/* Evento 3 */}
                  <div className="mb-6">
                    <div className="absolute -left-2.5 top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                    <p className="text-sm font-medium">Objeto em trânsito - por favor aguarde</p>
                    <p className="text-xs text-gray-500">{formatarData(new Date(new Date(entregaSelecionada.dataEnvio).setDate(new Date(entregaSelecionada.dataEnvio).getDate() + 1)).toISOString())} - Unidade de Tratamento, Origem {'>'} Destino</p>
                  </div>
                  {/* Evento 4 */}
                  <div>
                    <div className="absolute -left-2.5 top-1 w-5 h-5 bg-blue-500 rounded-full border-4 border-white"></div>
                    <p className="text-sm font-medium">Objeto postado</p>
                    <p className="text-xs text-gray-500">{formatarData(entregaSelecionada.dataEnvio)} - Agência dos Correios, Origem</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações da Entrega</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <p><span className="font-medium">Transportadora:</span> {getNomeTransportadora(entregaSelecionada.transportadoraId)}</p>
                    <p><span className="font-medium">Cód. Rastreio:</span> <span className="text-blue-600 hover:underline cursor-pointer">{entregaSelecionada.codigoRastreio || '-'}</span></p>
                    <p><span className="font-medium">Data de Envio:</span> {formatarData(entregaSelecionada.dataEnvio)}</p>
                    <p><span className="font-medium">Previsão:</span> {formatarData(entregaSelecionada.dataPrevistaEntrega)}</p>
                    <p><span className="font-medium">Entregue em:</span> {formatarData(entregaSelecionada.dataEntregaReal)}</p>
                    <p><span className="font-medium">Valor do Frete:</span> R$ {entregaSelecionada.valorFrete.toFixed(2)}</p>
                    <p><span className="font-medium">Peso:</span> {entregaSelecionada.pesoTotal} kg</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Endereço de Entrega</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-1">
                    <p>{entregaSelecionada.enderecoEntrega.rua}, {entregaSelecionada.enderecoEntrega.numero} {entregaSelecionada.enderecoEntrega.complemento || ''}</p>
                    <p>{entregaSelecionada.enderecoEntrega.bairro}</p>
                    <p>{entregaSelecionada.enderecoEntrega.cidade} - {entregaSelecionada.enderecoEntrega.estado}</p>
                    <p>CEP: {entregaSelecionada.enderecoEntrega.cep}</p>
                    <p className="pt-2"><span className="font-medium">Cliente:</span> {entregaSelecionada.clienteId}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Observações</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p>{entregaSelecionada.observacoes || 'Nenhuma observação.'}</p>
                </div>
              </div>
              
              <div className="border-t pt-4 mt-6 flex justify-end">
                <button 
                  className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
                  onClick={() => setMostrarDetalhesEntrega(false)}
                >
                  Fechar
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => {
                    setMostrarDetalhesEntrega(false);
                    setMostrarFormEntrega(true);
                  }}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Formulário de Entrega */}
      {mostrarFormEntrega && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {entregaSelecionada ? 'Editar Entrega' : 'Nova Entrega'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarFormEntrega(false)}
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  O formulário completo de criação/edição de entregas seria implementado aqui.
                </p>
                <p className="text-gray-600">
                  Incluiria campos para Pedido, Cliente, Endereço, Transportadora, Rastreio, Datas, etc.
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  onClick={() => setMostrarFormEntrega(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => setMostrarFormEntrega(false)}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogisticaModule;

