import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Search, 
  DollarSign, CreditCard, Calendar, ArrowUpRight, ArrowDownRight,
  CheckCircle, XCircle, AlertTriangle, FileText, Download,
  ChevronDown, ChevronUp, MoreHorizontal, Eye, Clock,
  TrendingUp, TrendingDown, BarChart2, PieChart
} from 'lucide-react';

// Interfaces para o módulo Financeiro
interface Lancamento {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  formaPagamento: string | null;
  comprovante: string | null;
  recorrente: boolean;
  periodicidade: 'unica' | 'mensal' | 'trimestral' | 'anual' | null;
  parcelado: boolean;
  totalParcelas: number | null;
  parcelaAtual: number | null;
  pedidoId: string | null;
  fornecedorId: string | null;
  clienteId: string | null;
  observacoes: string;
  criadoPor: string;
  criadoEm: string;
  atualizadoEm: string;
}

interface Categoria {
  id: string;
  nome: string;
  tipo: 'receita' | 'despesa' | 'ambos';
  cor: string;
  orcamento: number | null;
}

interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'corrente' | 'poupanca' | 'investimento';
  saldoAtual: number;
  saldoInicial: number;
  dataAbertura: string;
  ativa: boolean;
}

interface MovimentacaoConta {
  id: string;
  contaId: string;
  tipo: 'entrada' | 'saida' | 'transferencia';
  valor: number;
  data: string;
  descricao: string;
  lancamentoId: string | null;
  contaDestinoId: string | null;
  saldoApos: number;
}

interface FormaPagamento {
  id: string;
  nome: string;
  tipo: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'transferencia' | 'boleto' | 'pix' | 'outro';
  prazoRecebimento: number; // em dias
  taxaOperacao: number; // percentual
  ativo: boolean;
}

interface ResumoFinanceiro {
  saldoTotal: number;
  receitasMes: number;
  despesasMes: number;
  receitasPendentes: number;
  despesasPendentes: number;
  contasAtrasadas: number;
}

// Componente principal do módulo Financeiro
const FinanceiroModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [contas, setContas] = useState<ContaBancaria[]>([]);
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  
  const [abaSelecionada, setAbaSelecionada] = useState<'lancamentos' | 'contas' | 'relatorios'>('lancamentos');
  const [tipoLancamentoSelecionado, setTipoLancamentoSelecionado] = useState<'todos' | 'receitas' | 'despesas'>('todos');
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'hoje' | 'semana' | 'mes' | 'trimestre' | 'ano'>('mes');
  const [statusSelecionado, setStatusSelecionado] = useState<'todos' | 'pendente' | 'pago' | 'atrasado' | 'cancelado'>('todos');
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [mostrarFormLancamento, setMostrarFormLancamento] = useState(false);
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<Lancamento | null>(null);
  const [mostrarDetalhesLancamento, setMostrarDetalhesLancamento] = useState(false);
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, isso seria uma chamada à API
    const carregarDados = async () => {
      // Dados simulados de categorias
      const categoriasSimuladas: Categoria[] = [
        {
          id: 'cat-1',
          nome: 'Vendas',
          tipo: 'receita',
          cor: '#34A853',
          orcamento: null
        },
        {
          id: 'cat-2',
          nome: 'Serviços',
          tipo: 'receita',
          cor: '#4285F4',
          orcamento: null
        },
        {
          id: 'cat-3',
          nome: 'Matéria-prima',
          tipo: 'despesa',
          cor: '#EA4335',
          orcamento: 5000
        },
        {
          id: 'cat-4',
          nome: 'Salários',
          tipo: 'despesa',
          cor: '#FBBC05',
          orcamento: 8000
        },
        {
          id: 'cat-5',
          nome: 'Aluguel',
          tipo: 'despesa',
          cor: '#8E44AD',
          orcamento: 2500
        },
        {
          id: 'cat-6',
          nome: 'Equipamentos',
          tipo: 'despesa',
          cor: '#D81B60',
          orcamento: 1000
        },
        {
          id: 'cat-7',
          nome: 'Impostos',
          tipo: 'despesa',
          cor: '#F4511E',
          orcamento: 3000
        },
        {
          id: 'cat-8',
          nome: 'Utilidades',
          tipo: 'despesa',
          cor: '#0097A7',
          orcamento: 1200
        }
      ];
      
      // Dados simulados de contas bancárias
      const contasSimuladas: ContaBancaria[] = [
        {
          id: 'conta-1',
          nome: 'Conta Principal',
          banco: 'Banco do Brasil',
          agencia: '1234',
          conta: '56789-0',
          tipo: 'corrente',
          saldoAtual: 15780.45,
          saldoInicial: 10000,
          dataAbertura: new Date(2023, 0, 15).toISOString(),
          ativa: true
        },
        {
          id: 'conta-2',
          nome: 'Poupança',
          banco: 'Caixa Econômica',
          agencia: '5678',
          conta: '12345-6',
          tipo: 'poupanca',
          saldoAtual: 8500.20,
          saldoInicial: 5000,
          dataAbertura: new Date(2023, 2, 10).toISOString(),
          ativa: true
        },
        {
          id: 'conta-3',
          nome: 'Investimentos',
          banco: 'Nubank',
          agencia: '0001',
          conta: '98765-4',
          tipo: 'investimento',
          saldoAtual: 25000,
          saldoInicial: 20000,
          dataAbertura: new Date(2023, 5, 22).toISOString(),
          ativa: true
        }
      ];
      
      // Dados simulados de formas de pagamento
      const formasPagamentoSimuladas: FormaPagamento[] = [
        {
          id: 'forma-1',
          nome: 'Dinheiro',
          tipo: 'dinheiro',
          prazoRecebimento: 0,
          taxaOperacao: 0,
          ativo: true
        },
        {
          id: 'forma-2',
          nome: 'Cartão de Crédito',
          tipo: 'cartao_credito',
          prazoRecebimento: 30,
          taxaOperacao: 3.5,
          ativo: true
        },
        {
          id: 'forma-3',
          nome: 'Cartão de Débito',
          tipo: 'cartao_debito',
          prazoRecebimento: 2,
          taxaOperacao: 2.0,
          ativo: true
        },
        {
          id: 'forma-4',
          nome: 'Transferência Bancária',
          tipo: 'transferencia',
          prazoRecebimento: 1,
          taxaOperacao: 0,
          ativo: true
        },
        {
          id: 'forma-5',
          nome: 'Boleto',
          tipo: 'boleto',
          prazoRecebimento: 3,
          taxaOperacao: 1.5,
          ativo: true
        },
        {
          id: 'forma-6',
          nome: 'PIX',
          tipo: 'pix',
          prazoRecebimento: 0,
          taxaOperacao: 0,
          ativo: true
        }
      ];
      
      // Dados simulados de lançamentos
      const hoje = new Date();
      const lancamentosSimulados: Lancamento[] = [
        {
          id: 'lanc-1',
          tipo: 'receita',
          categoria: 'cat-1',
          descricao: 'Venda Pedido #P20250001',
          valor: 350.90,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString(),
          dataPagamento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString(),
          status: 'pago',
          formaPagamento: 'forma-2',
          comprovante: 'comprovante_p20250001.pdf',
          recorrente: false,
          periodicidade: 'unica',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: 'ped-001',
          fornecedorId: null,
          clienteId: 'cli-001',
          observacoes: '',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString()
        },
        {
          id: 'lanc-2',
          tipo: 'receita',
          categoria: 'cat-1',
          descricao: 'Venda Pedido #P20250002',
          valor: 129.90,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 10).toISOString(),
          dataPagamento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 9).toISOString(),
          status: 'pago',
          formaPagamento: 'forma-6',
          comprovante: 'comprovante_p20250002.pdf',
          recorrente: false,
          periodicidade: 'unica',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: 'ped-002',
          fornecedorId: null,
          clienteId: 'cli-002',
          observacoes: '',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 10).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 9).toISOString()
        },
        {
          id: 'lanc-3',
          tipo: 'despesa',
          categoria: 'cat-3',
          descricao: 'Compra de Tecidos',
          valor: 1250.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString(),
          dataPagamento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString(),
          status: 'pago',
          formaPagamento: 'forma-4',
          comprovante: 'comprovante_tecidos.pdf',
          recorrente: false,
          periodicidade: 'unica',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: null,
          fornecedorId: 'forn-001',
          clienteId: null,
          observacoes: 'Compra de tecidos para estoque',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 7).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString()
        },
        {
          id: 'lanc-4',
          tipo: 'despesa',
          categoria: 'cat-5',
          descricao: 'Aluguel do Ateliê',
          valor: 2500.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 10).toISOString(),
          dataPagamento: new Date(hoje.getFullYear(), hoje.getMonth(), 9).toISOString(),
          status: 'pago',
          formaPagamento: 'forma-4',
          comprovante: 'comprovante_aluguel.pdf',
          recorrente: true,
          periodicidade: 'mensal',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: null,
          fornecedorId: null,
          clienteId: null,
          observacoes: '',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), 5).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), 9).toISOString()
        },
        {
          id: 'lanc-5',
          tipo: 'despesa',
          categoria: 'cat-4',
          descricao: 'Salários Equipe',
          valor: 7800.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 5).toISOString(),
          dataPagamento: null,
          status: 'pendente',
          formaPagamento: null,
          comprovante: null,
          recorrente: true,
          periodicidade: 'mensal',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: null,
          fornecedorId: null,
          clienteId: null,
          observacoes: 'Pagamento de salários do mês',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), 25).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), 25).toISOString()
        },
        {
          id: 'lanc-6',
          tipo: 'receita',
          categoria: 'cat-1',
          descricao: 'Venda Pedido #P20250003',
          valor: 450.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 10).toISOString(),
          dataPagamento: null,
          status: 'pendente',
          formaPagamento: null,
          comprovante: null,
          recorrente: false,
          periodicidade: 'unica',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: 'ped-003',
          fornecedorId: null,
          clienteId: 'cli-003',
          observacoes: 'Aguardando finalização da produção',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString()
        },
        {
          id: 'lanc-7',
          tipo: 'despesa',
          categoria: 'cat-7',
          descricao: 'Impostos Trimestrais',
          valor: 3200.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 2).toISOString(),
          dataPagamento: null,
          status: 'atrasado',
          formaPagamento: null,
          comprovante: null,
          recorrente: true,
          periodicidade: 'trimestral',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: null,
          fornecedorId: null,
          clienteId: null,
          observacoes: 'Impostos do trimestre',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 15).toISOString()
        },
        {
          id: 'lanc-8',
          tipo: 'despesa',
          categoria: 'cat-6',
          descricao: 'Máquina de Costura Industrial',
          valor: 4500.00,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 15).toISOString(),
          dataPagamento: null,
          status: 'pendente',
          formaPagamento: null,
          comprovante: null,
          recorrente: false,
          periodicidade: 'unica',
          parcelado: true,
          totalParcelas: 10,
          parcelaAtual: 1,
          pedidoId: null,
          fornecedorId: 'forn-002',
          clienteId: null,
          observacoes: 'Primeira parcela da máquina de costura',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 5).toISOString()
        },
        {
          id: 'lanc-9',
          tipo: 'receita',
          categoria: 'cat-1',
          descricao: 'Venda Pedido #P20250004',
          valor: 5890.75,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 15).toISOString(),
          dataPagamento: null,
          status: 'pendente',
          formaPagamento: null,
          comprovante: null,
          recorrente: false,
          periodicidade: 'unica',
          parcelado: true,
          totalParcelas: 3,
          parcelaAtual: 1,
          pedidoId: 'ped-004',
          fornecedorId: null,
          clienteId: 'cli-003',
          observacoes: 'Pedido corporativo - primeira parcela',
          criadoPor: 'user-1',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 3).toISOString()
        },
        {
          id: 'lanc-10',
          tipo: 'despesa',
          categoria: 'cat-8',
          descricao: 'Conta de Energia',
          valor: 450.30,
          dataVencimento: new Date(hoje.getFullYear(), hoje.getMonth(), 20).toISOString(),
          dataPagamento: null,
          status: 'pendente',
          formaPagamento: null,
          comprovante: null,
          recorrente: true,
          periodicidade: 'mensal',
          parcelado: false,
          totalParcelas: null,
          parcelaAtual: null,
          pedidoId: null,
          fornecedorId: null,
          clienteId: null,
          observacoes: '',
          criadoPor: 'user-2',
          criadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString(),
          atualizadoEm: new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - 1).toISOString()
        }
      ];
      
      // Dados simulados de resumo financeiro
      const resumoSimulado: ResumoFinanceiro = {
        saldoTotal: contasSimuladas.reduce((total, conta) => total + conta.saldoAtual, 0),
        receitasMes: lancamentosSimulados
          .filter(l => l.tipo === 'receita' && l.status === 'pago' && new Date(l.dataPagamento!).getMonth() === hoje.getMonth())
          .reduce((total, l) => total + l.valor, 0),
        despesasMes: lancamentosSimulados
          .filter(l => l.tipo === 'despesa' && l.status === 'pago' && new Date(l.dataPagamento!).getMonth() === hoje.getMonth())
          .reduce((total, l) => total + l.valor, 0),
        receitasPendentes: lancamentosSimulados
          .filter(l => l.tipo === 'receita' && l.status === 'pendente')
          .reduce((total, l) => total + l.valor, 0),
        despesasPendentes: lancamentosSimulados
          .filter(l => l.tipo === 'despesa' && l.status === 'pendente')
          .reduce((total, l) => total + l.valor, 0),
        contasAtrasadas: lancamentosSimulados.filter(l => l.status === 'atrasado').length
      };
      
      // Atualizar os estados com os dados simulados
      setCategorias(categoriasSimuladas);
      setContas(contasSimuladas);
      setFormasPagamento(formasPagamentoSimuladas);
      setLancamentos(lancamentosSimulados);
      setResumo(resumoSimulado);
    };
    
    carregarDados();
  }, []);

  // Função para filtrar lançamentos
  const lancamentosFiltrados = lancamentos.filter(lancamento => {
    // Filtro por tipo de lançamento
    if (tipoLancamentoSelecionado !== 'todos' && 
        (tipoLancamentoSelecionado === 'receitas' ? lancamento.tipo !== 'receita' : lancamento.tipo !== 'despesa')) {
      return false;
    }
    
    // Filtro por status
    if (statusSelecionado !== 'todos' && lancamento.status !== statusSelecionado) {
      return false;
    }
    
    // Filtro por período
    const dataLancamento = lancamento.dataPagamento 
      ? new Date(lancamento.dataPagamento) 
      : new Date(lancamento.dataVencimento);
    
    const hoje = new Date();
    const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    
    if (periodoSelecionado === 'hoje' && dataLancamento.getTime() < inicioHoje.getTime()) {
      return false;
    }
    
    if (periodoSelecionado === 'semana') {
      const inicioSemana = new Date(hoje);
      inicioSemana.setDate(hoje.getDate() - 7);
      if (dataLancamento.getTime() < inicioSemana.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'mes') {
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      if (dataLancamento.getTime() < inicioMes.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'trimestre') {
      const inicioTrimestre = new Date(hoje);
      inicioTrimestre.setMonth(hoje.getMonth() - 3);
      if (dataLancamento.getTime() < inicioTrimestre.getTime()) {
        return false;
      }
    }
    
    if (periodoSelecionado === 'ano') {
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);
      if (dataLancamento.getTime() < inicioAno.getTime()) {
        return false;
      }
    }
    
    // Filtro por termo de busca
    if (termoBusca) {
      const termoLower = termoBusca.toLowerCase();
      return (
        lancamento.descricao.toLowerCase().includes(termoLower) ||
        (lancamento.observacoes && lancamento.observacoes.toLowerCase().includes(termoLower))
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

  // Função para formatar valor monetário
  const formatarValor = (valor: number): string => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Função para obter cor de status
  const getCorStatus = (status: 'pendente' | 'pago' | 'atrasado' | 'cancelado'): string => {
    switch (status) {
      case 'pendente': return 'bg-blue-100 text-blue-800';
      case 'pago': return 'bg-green-100 text-green-800';
      case 'atrasado': return 'bg-red-100 text-red-800';
      case 'cancelado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter cor de tipo de lançamento
  const getCorTipo = (tipo: 'receita' | 'despesa'): string => {
    return tipo === 'receita' ? 'text-green-600' : 'text-red-600';
  };

  // Função para obter ícone de tipo de lançamento
  const getIconeTipo = (tipo: 'receita' | 'despesa') => {
    return tipo === 'receita' ? ArrowUpRight : ArrowDownRight;
  };

  // Função para obter nome da categoria
  const getNomeCategoria = (categoriaId: string): string => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nome : 'Sem categoria';
  };

  // Função para obter cor da categoria
  const getCorCategoria = (categoriaId: string): string => {
    const categoria = categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.cor : '#CCCCCC';
  };

  // Função para obter nome da forma de pagamento
  const getNomeFormaPagamento = (formaPagamentoId: string | null): string => {
    if (!formaPagamentoId) return '-';
    const formaPagamento = formasPagamento.find(f => f.id === formaPagamentoId);
    return formaPagamento ? formaPagamento.nome : 'Desconhecida';
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-gray-600">Gerencie receitas, despesas e fluxo de caixa</p>
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
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
            onClick={() => {
              setLancamentoSelecionado(null);
              setMostrarFormLancamento(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Novo Lançamento
          </button>
        </div>
      </div>
      
      {/* Resumo Financeiro */}
      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Saldo Total</h3>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold">{formatarValor(resumo.saldoTotal)}</p>
                <p className="text-sm text-gray-500">Saldo em todas as contas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Receitas vs Despesas (Mês)</h3>
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                  <ArrowUpRight size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatarValor(resumo.receitasMes)}</p>
                  <p className="text-xs text-gray-500">Receitas</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-red-100 text-red-600 mr-2">
                  <ArrowDownRight size={20} />
                </div>
                <div>
                  <p className="text-xl font-bold">{formatarValor(resumo.despesasMes)}</p>
                  <p className="text-xs text-gray-500">Despesas</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${resumo.receitasMes >= resumo.despesasMes ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} mr-2`}>
                  {resumo.receitasMes >= resumo.despesasMes ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="text-xl font-bold">{formatarValor(resumo.receitasMes - resumo.despesasMes)}</p>
                  <p className="text-xs text-gray-500">Saldo</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Pendências</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-50 p-2 rounded-md text-center">
                <p className="text-xl font-bold text-blue-600">{formatarValor(resumo.receitasPendentes)}</p>
                <p className="text-xs text-gray-500">A Receber</p>
              </div>
              
              <div className="bg-orange-50 p-2 rounded-md text-center">
                <p className="text-xl font-bold text-orange-600">{formatarValor(resumo.despesasPendentes)}</p>
                <p className="text-xs text-gray-500">A Pagar</p>
              </div>
              
              <div className="bg-red-50 p-2 rounded-md text-center">
                <p className="text-xl font-bold text-red-600">{resumo.contasAtrasadas}</p>
                <p className="text-xs text-gray-500">Atrasadas</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Abas */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'lancamentos'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('lancamentos')}
          >
            Lançamentos
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'contas'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('contas')}
          >
            Contas Bancárias
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              abaSelecionada === 'relatorios'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setAbaSelecionada('relatorios')}
          >
            Relatórios
          </button>
        </nav>
      </div>
      
      {/* Filtros */}
      {mostrarFiltros && abaSelecionada === 'lancamentos' && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="Descrição ou observações"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={tipoLancamentoSelecionado}
                onChange={(e) => setTipoLancamentoSelecionado(e.target.value as any)}
              >
                <option value="todos">Todos</option>
                <option value="receitas">Receitas</option>
                <option value="despesas">Despesas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e.target.value as any)}
              >
                <option value="todos">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="pago">Pagos</option>
                <option value="atrasado">Atrasados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
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
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => {
                setTermoBusca('');
                setTipoLancamentoSelecionado('todos');
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
      
      {/* Conteúdo da aba Lançamentos */}
      {abaSelecionada === 'lancamentos' && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 rounded-md text-sm ${tipoLancamentoSelecionado === 'todos' ? 'bg-gray-200' : 'bg-gray-100'}`}
                onClick={() => setTipoLancamentoSelecionado('todos')}
              >
                Todos
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${tipoLancamentoSelecionado === 'receitas' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                onClick={() => setTipoLancamentoSelecionado('receitas')}
              >
                Receitas
              </button>
              <button 
                className={`px-3 py-1 rounded-md text-sm ${tipoLancamentoSelecionado === 'despesas' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
                onClick={() => setTipoLancamentoSelecionado('despesas')}
              >
                Despesas
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {lancamentosFiltrados.length} lançamentos encontrados
            </div>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
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
              {lancamentosFiltrados.map(lancamento => {
                const IconeTipo = getIconeTipo(lancamento.tipo);
                return (
                  <tr key={lancamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${lancamento.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
                          <IconeTipo size={16} className={getCorTipo(lancamento.tipo)} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{lancamento.descricao}</div>
                          {lancamento.recorrente && (
                            <div className="text-xs text-gray-500 flex items-center">
                              <Clock size={12} className="mr-1" />
                              {lancamento.periodicidade === 'mensal' ? 'Mensal' : 
                               lancamento.periodicidade === 'trimestral' ? 'Trimestral' : 
                               lancamento.periodicidade === 'anual' ? 'Anual' : 'Recorrente'}
                            </div>
                          )}
                          {lancamento.parcelado && (
                            <div className="text-xs text-gray-500">
                              Parcela {lancamento.parcelaAtual}/{lancamento.totalParcelas}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCorCategoria(lancamento.categoria) }}></div>
                        <span className="text-sm text-gray-900">{getNomeCategoria(lancamento.categoria)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getCorTipo(lancamento.tipo)}`}>
                        {formatarValor(lancamento.valor)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatarData(lancamento.dataVencimento)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(lancamento.status)}`}>
                        {lancamento.status === 'pendente' ? 'Pendente' : 
                         lancamento.status === 'pago' ? 'Pago' : 
                         lancamento.status === 'atrasado' ? 'Atrasado' : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => {
                          setLancamentoSelecionado(lancamento);
                          setMostrarDetalhesLancamento(true);
                        }}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setLancamentoSelecionado(lancamento);
                          setMostrarFormLancamento(true);
                        }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Conteúdo da aba Contas Bancárias */}
      {abaSelecionada === 'contas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Contas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contas Bancárias</h3>
                <button className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark text-sm flex items-center">
                  <Plus size={14} className="mr-1" />
                  Nova Conta
                </button>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conta
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banco
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Atual
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contas.map(conta => (
                    <tr key={conta.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{conta.nome}</div>
                        <div className="text-xs text-gray-500">{conta.agencia} / {conta.conta}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conta.banco}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {conta.tipo === 'corrente' ? 'Conta Corrente' : 
                         conta.tipo === 'poupanca' ? 'Poupança' : 'Investimento'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatarValor(conta.saldoAtual)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                          Extrato
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Resumo e Ações Rápidas */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="text-lg font-semibold mb-4">Resumo de Contas</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                  <span className="font-medium">Saldo Total</span>
                  <span className="font-bold">{formatarValor(contas.reduce((total, conta) => total + conta.saldoAtual, 0))}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                  <span className="font-medium">Maior Saldo</span>
                  <div className="text-right">
                    <div className="font-bold">{formatarValor(Math.max(...contas.map(c => c.saldoAtual)))}</div>
                    <div className="text-xs text-gray-500">
                      {contas.reduce((max, conta) => conta.saldoAtual > max.saldoAtual ? conta : max, contas[0]).nome}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-md">
                  <span className="font-medium">Total em Investimentos</span>
                  <span className="font-bold">
                    {formatarValor(contas.filter(c => c.tipo === 'investimento').reduce((total, conta) => total + conta.saldoAtual, 0))}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 flex items-center">
                  <Plus size={16} className="mr-2" />
                  Registrar Transferência
                </button>
                <button className="w-full px-4 py-2 bg-green-100 text-green-800 rounded-md hover:bg-green-200 flex items-center">
                  <ArrowUpRight size={16} className="mr-2" />
                  Registrar Depósito
                </button>
                <button className="w-full px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 flex items-center">
                  <ArrowDownRight size={16} className="mr-2" />
                  Registrar Saque
                </button>
                <button className="w-full px-4 py-2 bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Conciliação Bancária
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conteúdo da aba Relatórios */}
      {abaSelecionada === 'relatorios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relatórios Disponíveis */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Relatórios Disponíveis</h3>
            <div className="space-y-3">
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                  <BarChart2 size={20} className="text-blue-500 mr-3" />
                  <div>
                    <p className="font-medium">Fluxo de Caixa</p>
                    <p className="text-xs text-gray-500">Entradas e saídas por período</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                  <PieChart size={20} className="text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Despesas por Categoria</p>
                    <p className="text-xs text-gray-500">Distribuição de gastos</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                  <TrendingUp size={20} className="text-purple-500 mr-3" />
                  <div>
                    <p className="font-medium">Projeção Financeira</p>
                    <p className="text-xs text-gray-500">Previsão para os próximos meses</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                  <AlertTriangle size={20} className="text-orange-500 mr-3" />
                  <div>
                    <p className="font-medium">Contas a Vencer</p>
                    <p className="text-xs text-gray-500">Próximos 30 dias</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
              
              <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer flex justify-between items-center">
                <div className="flex items-center">
                  <DollarSign size={20} className="text-red-500 mr-3" />
                  <div>
                    <p className="font-medium">Lucratividade</p>
                    <p className="text-xs text-gray-500">Análise de receitas e despesas</p>
                  </div>
                </div>
                <Download size={16} className="text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Gráfico de Exemplo */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Receitas vs Despesas</h3>
              <select className="px-2 py-1 border rounded-md text-sm">
                <option value="mes">Este Mês</option>
                <option value="trimestre">Último Trimestre</option>
                <option value="ano">Este Ano</option>
              </select>
            </div>
            
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
              <p className="text-gray-500">Gráfico de barras comparativo seria exibido aqui</p>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-md">
                <p className="text-sm text-gray-500">Total de Receitas</p>
                <p className="text-xl font-bold text-green-600">{formatarValor(resumo?.receitasMes || 0)}</p>
              </div>
              
              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm text-gray-500">Total de Despesas</p>
                <p className="text-xl font-bold text-red-600">{formatarValor(resumo?.despesasMes || 0)}</p>
              </div>
            </div>
          </div>
          
          {/* Configurações de Relatórios */}
          <div className="bg-white rounded-lg shadow-sm p-4 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Configurações de Relatórios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Período Padrão</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="mes">Mensal</option>
                  <option value="trimestre">Trimestral</option>
                  <option value="ano">Anual</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Formato de Exportação</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Agendamento</label>
                <select className="w-full px-3 py-2 border rounded-md">
                  <option value="nenhum">Nenhum</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensal">Mensal</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Detalhes do Lançamento */}
      {mostrarDetalhesLancamento && lancamentoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center mb-1">
                    <span className={`px-2 py-1 text-xs rounded-full mr-2 ${getCorStatus(lancamentoSelecionado.status)}`}>
                      {lancamentoSelecionado.status === 'pendente' ? 'Pendente' : 
                       lancamentoSelecionado.status === 'pago' ? 'Pago' : 
                       lancamentoSelecionado.status === 'atrasado' ? 'Atrasado' : 'Cancelado'}
                    </span>
                    <span className={`text-sm ${getCorTipo(lancamentoSelecionado.tipo)}`}>
                      {lancamentoSelecionado.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{lancamentoSelecionado.descricao}</h2>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarDetalhesLancamento(false)}
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações Gerais</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Valor</p>
                        <p className={`text-xl font-bold ${getCorTipo(lancamentoSelecionado.tipo)}`}>
                          {formatarValor(lancamentoSelecionado.valor)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Categoria</p>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: getCorCategoria(lancamentoSelecionado.categoria) }}></div>
                          <p className="font-medium">{getNomeCategoria(lancamentoSelecionado.categoria)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Vencimento</p>
                        <p className="font-medium">{formatarData(lancamentoSelecionado.dataVencimento)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data de Pagamento</p>
                        <p className="font-medium">{formatarData(lancamentoSelecionado.dataPagamento)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Forma de Pagamento</p>
                        <p className="font-medium">{getNomeFormaPagamento(lancamentoSelecionado.formaPagamento)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Comprovante</p>
                        <p className="font-medium">
                          {lancamentoSelecionado.comprovante ? (
                            <button className="text-blue-600 hover:text-blue-800 flex items-center">
                              <Eye size={14} className="mr-1" />
                              Visualizar
                            </button>
                          ) : 'Não disponível'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Detalhes Adicionais</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {lancamentoSelecionado.recorrente && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Recorrência</p>
                        <p className="font-medium flex items-center">
                          <Clock size={16} className="mr-1 text-blue-500" />
                          {lancamentoSelecionado.periodicidade === 'mensal' ? 'Mensal' : 
                           lancamentoSelecionado.periodicidade === 'trimestral' ? 'Trimestral' : 
                           lancamentoSelecionado.periodicidade === 'anual' ? 'Anual' : 'Recorrente'}
                        </p>
                      </div>
                    )}
                    
                    {lancamentoSelecionado.parcelado && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Parcelamento</p>
                        <p className="font-medium">
                          Parcela {lancamentoSelecionado.parcelaAtual} de {lancamentoSelecionado.totalParcelas}
                        </p>
                      </div>
                    )}
                    
                    {lancamentoSelecionado.pedidoId && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Pedido Relacionado</p>
                        <p className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          #{lancamentoSelecionado.pedidoId}
                        </p>
                      </div>
                    )}
                    
                    {lancamentoSelecionado.fornecedorId && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Fornecedor</p>
                        <p className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {lancamentoSelecionado.fornecedorId}
                        </p>
                      </div>
                    )}
                    
                    {lancamentoSelecionado.clienteId && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-500">Cliente</p>
                        <p className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                          {lancamentoSelecionado.clienteId}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Observações</p>
                      <p className="font-medium">
                        {lancamentoSelecionado.observacoes || 'Nenhuma observação'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <div>
                    Criado por: {lancamentoSelecionado.criadoPor === 'user-1' ? 'Financeiro' : 'Administrador'} em {formatarData(lancamentoSelecionado.criadoEm)}
                  </div>
                  <div>
                    Última atualização: {formatarData(lancamentoSelecionado.atualizadoEm)}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {lancamentoSelecionado.status === 'pendente' && (
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 mr-2 flex items-center">
                      <CheckCircle size={16} className="mr-1" />
                      Marcar como Pago
                    </button>
                  )}
                  
                  {lancamentoSelecionado.status !== 'cancelado' && (
                    <button className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 mr-2 flex items-center">
                      <XCircle size={16} className="mr-1" />
                      Cancelar
                    </button>
                  )}
                  
                  <button 
                    className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
                    onClick={() => setMostrarDetalhesLancamento(false)}
                  >
                    Fechar
                  </button>
                  
                  <button 
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    onClick={() => {
                      setMostrarDetalhesLancamento(false);
                      setMostrarFormLancamento(true);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Formulário de Lançamento */}
      {mostrarFormLancamento && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {lancamentoSelecionado ? 'Editar Lançamento' : 'Novo Lançamento'}
                </h2>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setMostrarFormLancamento(false)}
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  O formulário completo de criação/edição de lançamentos seria implementado aqui.
                </p>
                <p className="text-gray-600">
                  Devido à complexidade, este exemplo mostra apenas a visualização de lançamentos.
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  onClick={() => setMostrarFormLancamento(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => setMostrarFormLancamento(false)}
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

export default FinanceiroModule;
