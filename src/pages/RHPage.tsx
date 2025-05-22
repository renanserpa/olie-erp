import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, Trash2, FileText, Calendar, Clock, User, Briefcase, DollarSign, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

// Tipos de dados
interface Funcionario {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  data_admissao: string;
  salario: number;
  status: 'ativo' | 'inativo' | 'ferias' | 'licenca';
  avatar_url?: string;
  endereco?: string;
  documentos?: {
    cpf: string;
    rg?: string;
    ctps?: string;
  };
  dados_bancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipo_conta: string;
  };
}

interface Ferias {
  id: number;
  funcionario_id: number;
  data_inicio: string;
  data_fim: string;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes?: string;
}

interface Ponto {
  id: number;
  funcionario_id: number;
  data: string;
  entrada: string;
  saida_almoco?: string;
  retorno_almoco?: string;
  saida?: string;
  horas_trabalhadas?: number;
  status: 'completo' | 'incompleto' | 'ausente' | 'justificado';
  justificativa?: string;
}

const RHPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [activeTab, setActiveTab] = useState<'funcionarios' | 'ferias' | 'ponto'>('funcionarios');
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    departamento: '',
    status: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Estados para cada tipo de dados
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [ferias, setFerias] = useState<Ferias[]>([]);
  const [pontos, setPontos] = useState<Ponto[]>([]);
  
  // Buscar dados
  useEffect(() => {
    const fetchDados = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        
        // Funcionários
        const funcionariosSimulados: Funcionario[] = [
          {
            id: 1,
            nome: 'Maria Oliveira',
            email: 'maria.oliveira@atelieolie.com.br',
            telefone: '(11) 98765-4321',
            cargo: 'Costureira Sênior',
            departamento: 'Produção',
            data_admissao: '2023-03-15',
            salario: 3200.00,
            status: 'ativo',
            avatar_url: 'https://example.com/avatars/maria.jpg',
            endereco: 'Rua das Flores, 123 - São Paulo/SP',
            documentos: {
              cpf: '123.456.789-00',
              rg: '12.345.678-9',
              ctps: '12345/001'
            },
            dados_bancarios: {
              banco: 'Banco do Brasil',
              agencia: '1234',
              conta: '56789-0',
              tipo_conta: 'Corrente'
            }
          },
          {
            id: 2,
            nome: 'João Silva',
            email: 'joao.silva@atelieolie.com.br',
            telefone: '(11) 91234-5678',
            cargo: 'Designer',
            departamento: 'Criação',
            data_admissao: '2022-08-10',
            salario: 3800.00,
            status: 'ativo',
            avatar_url: 'https://example.com/avatars/joao.jpg',
            endereco: 'Av. Paulista, 1000 - São Paulo/SP',
            documentos: {
              cpf: '987.654.321-00',
              rg: '98.765.432-1',
              ctps: '54321/001'
            },
            dados_bancarios: {
              banco: 'Itaú',
              agencia: '5678',
              conta: '12345-6',
              tipo_conta: 'Corrente'
            }
          },
          {
            id: 3,
            nome: 'Ana Santos',
            email: 'ana.santos@atelieolie.com.br',
            telefone: '(11) 99876-5432',
            cargo: 'Gerente de Produção',
            departamento: 'Produção',
            data_admissao: '2021-05-20',
            salario: 5500.00,
            status: 'ferias',
            avatar_url: 'https://example.com/avatars/ana.jpg',
            endereco: 'Rua Augusta, 500 - São Paulo/SP',
            documentos: {
              cpf: '456.789.123-00',
              rg: '45.678.912-3',
              ctps: '67890/001'
            },
            dados_bancarios: {
              banco: 'Santander',
              agencia: '9012',
              conta: '34567-8',
              tipo_conta: 'Corrente'
            }
          },
          {
            id: 4,
            nome: 'Carlos Ferreira',
            email: 'carlos.ferreira@atelieolie.com.br',
            telefone: '(11) 97654-3210',
            cargo: 'Auxiliar de Costura',
            departamento: 'Produção',
            data_admissao: '2024-01-10',
            salario: 2200.00,
            status: 'ativo',
            avatar_url: 'https://example.com/avatars/carlos.jpg',
            endereco: 'Rua Vergueiro, 300 - São Paulo/SP',
            documentos: {
              cpf: '789.123.456-00',
              rg: '78.912.345-6',
              ctps: '13579/001'
            },
            dados_bancarios: {
              banco: 'Caixa Econômica',
              agencia: '3456',
              conta: '78901-2',
              tipo_conta: 'Poupança'
            }
          },
          {
            id: 5,
            nome: 'Juliana Costa',
            email: 'juliana.costa@atelieolie.com.br',
            telefone: '(11) 95432-1098',
            cargo: 'Vendedora',
            departamento: 'Comercial',
            data_admissao: '2022-11-05',
            salario: 2800.00,
            status: 'licenca',
            avatar_url: 'https://example.com/avatars/juliana.jpg',
            endereco: 'Av. Rebouças, 800 - São Paulo/SP',
            documentos: {
              cpf: '321.654.987-00',
              rg: '32.165.498-7',
              ctps: '24680/001'
            },
            dados_bancarios: {
              banco: 'Bradesco',
              agencia: '7890',
              conta: '12345-6',
              tipo_conta: 'Corrente'
            }
          },
          {
            id: 6,
            nome: 'Roberto Almeida',
            email: 'roberto.almeida@atelieolie.com.br',
            telefone: '(11) 93210-9876',
            cargo: 'Cortador',
            departamento: 'Produção',
            data_admissao: '2023-07-15',
            salario: 2500.00,
            status: 'ativo',
            avatar_url: 'https://example.com/avatars/roberto.jpg',
            endereco: 'Rua Oscar Freire, 200 - São Paulo/SP',
            documentos: {
              cpf: '654.987.321-00',
              rg: '65.498.732-1',
              ctps: '97531/001'
            },
            dados_bancarios: {
              banco: 'Nubank',
              agencia: '0001',
              conta: '12345678-9',
              tipo_conta: 'Corrente'
            }
          }
        ];
        
        // Férias
        const feriasSimuladas: Ferias[] = [
          {
            id: 1,
            funcionario_id: 3,
            data_inicio: '2025-05-10',
            data_fim: '2025-05-30',
            status: 'em_andamento',
            observacoes: 'Férias regulamentares de 20 dias'
          },
          {
            id: 2,
            funcionario_id: 2,
            data_inicio: '2025-07-01',
            data_fim: '2025-07-30',
            status: 'agendada',
            observacoes: 'Férias completas de 30 dias'
          },
          {
            id: 3,
            funcionario_id: 1,
            data_inicio: '2025-09-15',
            data_fim: '2025-09-30',
            status: 'agendada',
            observacoes: 'Primeira parte das férias (15 dias)'
          },
          {
            id: 4,
            funcionario_id: 6,
            data_inicio: '2025-06-01',
            data_fim: '2025-06-15',
            status: 'agendada',
            observacoes: 'Férias parciais de 15 dias'
          },
          {
            id: 5,
            funcionario_id: 4,
            data_inicio: '2025-01-10',
            data_fim: '2025-01-24',
            status: 'concluida',
            observacoes: 'Férias de 15 dias'
          }
        ];
        
        // Pontos
        const pontosSimulados: Ponto[] = [
          {
            id: 1,
            funcionario_id: 1,
            data: '2025-05-19',
            entrada: '08:00',
            saida_almoco: '12:00',
            retorno_almoco: '13:00',
            saida: '17:00',
            horas_trabalhadas: 8,
            status: 'completo'
          },
          {
            id: 2,
            funcionario_id: 2,
            data: '2025-05-19',
            entrada: '08:15',
            saida_almoco: '12:00',
            retorno_almoco: '13:00',
            saida: '17:30',
            horas_trabalhadas: 8.25,
            status: 'completo'
          },
          {
            id: 3,
            funcionario_id: 4,
            data: '2025-05-19',
            entrada: '08:05',
            saida_almoco: '12:00',
            retorno_almoco: '13:10',
            saida: '17:15',
            horas_trabalhadas: 8,
            status: 'completo'
          },
          {
            id: 4,
            funcionario_id: 6,
            data: '2025-05-19',
            entrada: '08:00',
            saida_almoco: '12:00',
            retorno_almoco: '13:00',
            status: 'incompleto'
          },
          {
            id: 5,
            funcionario_id: 5,
            data: '2025-05-19',
            status: 'justificado',
            justificativa: 'Licença médica'
          }
        ];
        
        setFuncionarios(funcionariosSimulados);
        setFerias(feriasSimuladas);
        setPontos(pontosSimulados);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDados();
  }, []);
  
  // Filtrar funcionários
  const funcionariosFiltered = funcionarios.filter(funcionario => {
    // Filtro por departamento
    if (filtro.departamento && funcionario.departamento !== filtro.departamento) {
      return false;
    }
    
    // Filtro por status
    if (filtro.status && funcionario.status !== filtro.status) {
      return false;
    }
    
    // Filtro por busca (nome, email ou cargo)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const nomeMatch = funcionario.nome.toLowerCase().includes(termoBusca);
      const emailMatch = funcionario.email.toLowerCase().includes(termoBusca);
      const cargoMatch = funcionario.cargo.toLowerCase().includes(termoBusca);
      
      if (!nomeMatch && !emailMatch && !cargoMatch) {
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
  
  // Calcular tempo de empresa
  const calcularTempoEmpresa = (dataAdmissao: string) => {
    const admissao = new Date(dataAdmissao);
    const hoje = new Date();
    
    const diferencaMeses = (hoje.getFullYear() - admissao.getFullYear()) * 12 + 
                           (hoje.getMonth() - admissao.getMonth());
    
    const anos = Math.floor(diferencaMeses / 12);
    const meses = diferencaMeses % 12;
    
    if (anos > 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}${meses > 0 ? ` e ${meses} ${meses === 1 ? 'mês' : 'meses'}` : ''}`;
    }
    
    return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  };
  
  // Traduzir status
  const traduzirStatus = (status: Funcionario['status']) => {
    switch (status) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      case 'ferias':
        return 'Em Férias';
      case 'licenca':
        return 'Em Licença';
      default:
        return status;
    }
  };
  
  // Traduzir status de férias
  const traduzirStatusFerias = (status: Ferias['status']) => {
    switch (status) {
      case 'agendada':
        return 'Agendada';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluida':
        return 'Concluída';
      case 'cancelada':
        return 'Cancelada';
      default:
        return status;
    }
  };
  
  // Traduzir status de ponto
  const traduzirStatusPonto = (status: Ponto['status']) => {
    switch (status) {
      case 'completo':
        return 'Completo';
      case 'incompleto':
        return 'Incompleto';
      case 'ausente':
        return 'Ausente';
      case 'justificado':
        return 'Justificado';
      default:
        return status;
    }
  };
  
  // Renderizar avatar
  const renderAvatar = (funcionario: Funcionario) => {
    if (funcionario.avatar_url) {
      return (
        <img 
          src={funcionario.avatar_url} 
          alt={`Avatar de ${funcionario.nome}`} 
          className="h-10 w-10 rounded-full"
        />
      );
    }
    
    // Avatar com iniciais
    const iniciais = funcionario.nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return (
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
        {iniciais}
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Funcionários
  const renderTabFuncionarios = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                placeholder="Buscar nome, email ou cargo..."
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
          </div>
          
          <Button size="sm">
            <Plus size={18} className="mr-1" />
            Novo Funcionário
          </Button>
        </div>
        
        {/* Área de filtros */}
        {showFiltros && (
          <div className="p-4 bg-white rounded-md shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="Criação">Criação</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Administrativo">Administrativo</option>
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
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="ferias">Em Férias</option>
                  <option value="licenca">Em Licença</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                onClick={() => setFiltro({ departamento: '', status: '', busca: '' })}
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        )}
        
        {/* Lista de funcionários */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando funcionários...</div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {funcionariosFiltered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum funcionário encontrado
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {funcionariosFiltered.map((funcionario) => (
                  <li key={funcionario.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {renderAvatar(funcionario)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {funcionario.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {funcionario.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                            title="Editar"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                            title="Detalhes"
                          >
                            <FileText size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500 mr-6">
                            <Briefcase className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {funcionario.cargo}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 mr-6">
                            <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {funcionario.departamento}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            Admissão: {formatarData(funcionario.data_admissao)} ({calcularTempoEmpresa(funcionario.data_admissao)})
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm sm:mt-0">
                          <div className="flex items-center text-sm text-gray-500 mr-6">
                            <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {formatarValor(funcionario.salario)}
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            funcionario.status === 'ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : funcionario.status === 'ferias'
                                ? 'bg-blue-100 text-blue-800'
                                : funcionario.status === 'licenca'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {traduzirStatus(funcionario.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Férias
  const renderTabFerias = () => {
    // Encontrar funcionário pelo ID
    const encontrarFuncionario = (id: number) => {
      return funcionarios.find(f => f.id === id);
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Controle de Férias</h2>
          <Button size="sm">
            <Plus size={18} className="mr-1" />
            Agendar Férias
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando dados de férias...</div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {ferias.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Nenhum registro de férias encontrado
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {ferias.map((ferias) => {
                  const funcionario = encontrarFuncionario(ferias.funcionario_id);
                  
                  return (
                    <li key={ferias.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            {funcionario && renderAvatar(funcionario)}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {funcionario?.nome || `Funcionário ID ${ferias.funcionario_id}`}
                              </div>
                              <div className="text-sm text-gray-500">
                                {funcionario?.cargo} - {funcionario?.departamento}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ferias.status === 'agendada' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : ferias.status === 'em_andamento'
                                ? 'bg-blue-100 text-blue-800'
                                : ferias.status === 'concluida'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                          }`}>
                            {traduzirStatusFerias(ferias.status)}
                          </span>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="flex items-center text-sm text-gray-500 mr-6">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {formatarData(ferias.data_inicio)} a {formatarData(ferias.data_fim)}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {(() => {
                                const inicio = new Date(ferias.data_inicio);
                                const fim = new Date(ferias.data_fim);
                                const diffTime = Math.abs(fim.getTime() - inicio.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                return `${diffDays} dias`;
                              })()}
                            </div>
                          </div>
                          <div className="mt-2 flex space-x-2 sm:mt-0">
                            <button
                              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                              title="Editar"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                              title="Detalhes"
                            >
                              <FileText size={14} />
                            </button>
                          </div>
                        </div>
                        {ferias.observacoes && (
                          <div className="mt-2 text-sm text-gray-500">
                            <div className="font-medium">Observações:</div>
                            <div>{ferias.observacoes}</div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Ponto
  const renderTabPonto = () => {
    // Encontrar funcionário pelo ID
    const encontrarFuncionario = (id: number) => {
      return funcionarios.find(f => f.id === id);
    };
    
    // Formatar hora
    const formatarHora = (hora?: string) => {
      return hora || '-';
    };
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Registro de Ponto - {new Date().toLocaleDateString('pt-BR')}</h2>
          <Button size="sm">
            <Plus size={18} className="mr-1" />
            Registrar Ponto
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando registros de ponto...</div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funcionário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saída Almoço
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retorno Almoço
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saída
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pontos.map((ponto) => {
                  const funcionario = encontrarFuncionario(ponto.funcionario_id);
                  
                  return (
                    <tr key={ponto.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {funcionario && renderAvatar(funcionario)}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {funcionario?.nome || `Funcionário ID ${ponto.funcionario_id}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {funcionario?.cargo}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarHora(ponto.entrada)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarHora(ponto.saida_almoco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarHora(ponto.retorno_almoco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarHora(ponto.saida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ponto.horas_trabalhadas ? `${ponto.horas_trabalhadas}h` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ponto.status === 'completo' 
                            ? 'bg-green-100 text-green-800' 
                            : ponto.status === 'incompleto'
                              ? 'bg-yellow-100 text-yellow-800'
                              : ponto.status === 'justificado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                        }`}>
                          {traduzirStatusPonto(ponto.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          {ponto.status === 'incompleto' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Registrar Saída"
                            >
                              <Clock size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-text mb-6">Recursos Humanos</h1>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'funcionarios'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('funcionarios')}
              >
                <User size={16} className="inline mr-1" />
                Funcionários
              </button>
              <button
                className={`${
                  activeTab === 'ferias'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('ferias')}
              >
                <Calendar size={16} className="inline mr-1" />
                Férias
              </button>
              <button
                className={`${
                  activeTab === 'ponto'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('ponto')}
              >
                <Clock size={16} className="inline mr-1" />
                Ponto
              </button>
            </nav>
          </div>
          
          {/* Conteúdo da tab ativa */}
          {activeTab === 'funcionarios' && renderTabFuncionarios()}
          {activeTab === 'ferias' && renderTabFerias()}
          {activeTab === 'ponto' && renderTabPonto()}
        </div>
      </div>
    </div>
  );
};

export default RHPage;
