import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Search, 
  User, Phone, Mail, MapPin, FileText, 
  ChevronDown, ChevronUp, ShoppingBag, Clock,
  CreditCard, Tag, Heart
} from 'lucide-react';

// Interfaces para o módulo de Clientes
interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  dataCadastro: string;
  ultimaCompra: string | null;
  valorTotalCompras: number;
  statusCliente: 'ativo' | 'inativo' | 'bloqueado';
  observacoes: string;
  endereco: Endereco;
  enderecoEntrega: Endereco | null;
  contatos: Contato[];
  preferencias: Preferencia[];
  tags: string[];
}

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  principal: boolean;
}

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  cargo: string;
  principal: boolean;
}

interface Preferencia {
  id: string;
  tipo: string;
  valor: string;
  observacao: string;
}

interface HistoricoCliente {
  id: string;
  clienteId: string;
  data: string;
  tipo: 'pedido' | 'contato' | 'alteracao' | 'observacao';
  descricao: string;
  usuarioId: string;
  usuarioNome: string;
  referencia: string | null;
}

interface PedidoResumido {
  id: string;
  codigo: string;
  clienteId: string;
  dataPedido: string;
  status: string;
  valorTotal: number;
  itensQuantidade: number;
}

// Componente principal do módulo de Clientes
const ClientesModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'info' | 'pedidos' | 'historico'>('info');
  const [historicoCliente, setHistoricoCliente] = useState<HistoricoCliente[]>([]);
  const [pedidosCliente, setPedidosCliente] = useState<PedidoResumido[]>([]);
  const [filtros, setFiltros] = useState({
    termo: '',
    status: 'todos',
    tipo: 'todos',
    ordenacao: 'nome_asc'
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, isso seria uma chamada à API
    const carregarDados = async () => {
      // Dados simulados
      const clientesSimulados: Cliente[] = [
        {
          id: 'cli-001',
          nome: 'Maria Silva',
          email: 'maria.silva@email.com',
          telefone: '(11) 98765-4321',
          cpfCnpj: '123.456.789-00',
          tipo: 'pessoa_fisica',
          dataCadastro: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 180 dias atrás
          ultimaCompra: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 dias atrás
          valorTotalCompras: 1250.90,
          statusCliente: 'ativo',
          observacoes: 'Cliente VIP, prefere entregas no período da tarde',
          endereco: {
            cep: '01234-567',
            logradouro: 'Rua das Flores',
            numero: '123',
            complemento: 'Apto 45',
            bairro: 'Jardim Primavera',
            cidade: 'São Paulo',
            estado: 'SP',
            principal: true
          },
          enderecoEntrega: null,
          contatos: [
            {
              id: 'cont-001',
              nome: 'Maria Silva',
              telefone: '(11) 98765-4321',
              email: 'maria.silva@email.com',
              cargo: 'Principal',
              principal: true
            }
          ],
          preferencias: [
            {
              id: 'pref-001',
              tipo: 'Cor',
              valor: 'Azul',
              observacao: 'Prefere tons pastéis'
            },
            {
              id: 'pref-002',
              tipo: 'Material',
              valor: 'Algodão',
              observacao: 'Alérgica a materiais sintéticos'
            }
          ],
          tags: ['VIP', 'Fidelidade']
        },
        {
          id: 'cli-002',
          nome: 'João Oliveira',
          email: 'joao.oliveira@email.com',
          telefone: '(11) 91234-5678',
          cpfCnpj: '987.654.321-00',
          tipo: 'pessoa_fisica',
          dataCadastro: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 dias atrás
          ultimaCompra: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 dias atrás
          valorTotalCompras: 450.50,
          statusCliente: 'ativo',
          observacoes: '',
          endereco: {
            cep: '04567-890',
            logradouro: 'Avenida Principal',
            numero: '456',
            complemento: 'Casa',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            principal: true
          },
          enderecoEntrega: null,
          contatos: [
            {
              id: 'cont-002',
              nome: 'João Oliveira',
              telefone: '(11) 91234-5678',
              email: 'joao.oliveira@email.com',
              cargo: 'Principal',
              principal: true
            }
          ],
          preferencias: [],
          tags: ['Novo']
        },
        {
          id: 'cli-003',
          nome: 'Empresa ABC Ltda',
          email: 'contato@empresaabc.com.br',
          telefone: '(11) 3456-7890',
          cpfCnpj: '12.345.678/0001-90',
          tipo: 'pessoa_juridica',
          dataCadastro: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 ano atrás
          ultimaCompra: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
          valorTotalCompras: 5890.75,
          statusCliente: 'ativo',
          observacoes: 'Empresa parceira, pedidos corporativos',
          endereco: {
            cep: '05678-901',
            logradouro: 'Rua do Comércio',
            numero: '789',
            complemento: 'Sala 12',
            bairro: 'Vila Nova',
            cidade: 'São Paulo',
            estado: 'SP',
            principal: true
          },
          enderecoEntrega: {
            cep: '05679-000',
            logradouro: 'Rua da Entrega',
            numero: '100',
            complemento: 'Galpão 3',
            bairro: 'Vila Nova',
            cidade: 'São Paulo',
            estado: 'SP',
            principal: false
          },
          contatos: [
            {
              id: 'cont-003',
              nome: 'Ana Pereira',
              telefone: '(11) 97777-8888',
              email: 'ana.pereira@empresaabc.com.br',
              cargo: 'Gerente de Compras',
              principal: true
            },
            {
              id: 'cont-004',
              nome: 'Carlos Santos',
              telefone: '(11) 96666-5555',
              email: 'carlos.santos@empresaabc.com.br',
              cargo: 'Financeiro',
              principal: false
            }
          ],
          preferencias: [
            {
              id: 'pref-003',
              tipo: 'Entrega',
              valor: 'Expressa',
              observacao: 'Sempre solicita entrega expressa'
            }
          ],
          tags: ['Corporativo', 'VIP', 'Atacado']
        },
        {
          id: 'cli-004',
          nome: 'Ana Souza',
          email: 'ana.souza@email.com',
          telefone: '(11) 95555-4444',
          cpfCnpj: '111.222.333-44',
          tipo: 'pessoa_fisica',
          dataCadastro: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias atrás
          ultimaCompra: null,
          valorTotalCompras: 0,
          statusCliente: 'inativo',
          observacoes: 'Cliente cadastrado mas ainda sem compras',
          endereco: {
            cep: '06789-012',
            logradouro: 'Rua das Palmeiras',
            numero: '321',
            complemento: '',
            bairro: 'Jardim Europa',
            cidade: 'São Paulo',
            estado: 'SP',
            principal: true
          },
          enderecoEntrega: null,
          contatos: [
            {
              id: 'cont-005',
              nome: 'Ana Souza',
              telefone: '(11) 95555-4444',
              email: 'ana.souza@email.com',
              cargo: 'Principal',
              principal: true
            }
          ],
          preferencias: [],
          tags: ['Novo']
        }
      ];

      setClientes(clientesSimulados);
    };

    carregarDados();
  }, []);

  // Efeito para carregar histórico e pedidos quando um cliente é selecionado
  useEffect(() => {
    if (clienteSelecionado && modoVisualizacao) {
      // Simulação de carregamento de histórico
      const carregarHistorico = async () => {
        // Dados simulados
        const historicoSimulado: HistoricoCliente[] = [
          {
            id: `hist-${clienteSelecionado.id}-1`,
            clienteId: clienteSelecionado.id,
            data: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            tipo: 'pedido',
            descricao: 'Novo pedido realizado',
            usuarioId: 'usr-001',
            usuarioNome: 'Sistema',
            referencia: 'P2025001'
          },
          {
            id: `hist-${clienteSelecionado.id}-2`,
            clienteId: clienteSelecionado.id,
            data: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            tipo: 'contato',
            descricao: 'Cliente entrou em contato sobre status do pedido',
            usuarioId: 'usr-002',
            usuarioNome: 'Atendimento',
            referencia: null
          },
          {
            id: `hist-${clienteSelecionado.id}-3`,
            clienteId: clienteSelecionado.id,
            data: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            tipo: 'alteracao',
            descricao: 'Atualização de dados cadastrais',
            usuarioId: 'usr-001',
            usuarioNome: 'Sistema',
            referencia: null
          }
        ];

        // Ordenar histórico por data (mais recentes primeiro)
        historicoSimulado.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

        setHistoricoCliente(historicoSimulado);
      };

      // Simulação de carregamento de pedidos
      const carregarPedidos = async () => {
        // Dados simulados
        const pedidosSimulados: PedidoResumido[] = [
          {
            id: 'ped-001',
            codigo: 'P2025001',
            clienteId: clienteSelecionado.id,
            dataPedido: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'entregue',
            valorTotal: 350.90,
            itensQuantidade: 2
          },
          {
            id: 'ped-002',
            codigo: 'P2025010',
            clienteId: clienteSelecionado.id,
            dataPedido: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'entregue',
            valorTotal: 129.90,
            itensQuantidade: 1
          },
          {
            id: 'ped-003',
            codigo: 'P2025025',
            clienteId: clienteSelecionado.id,
            dataPedido: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'producao',
            valorTotal: 450.00,
            itensQuantidade: 3
          }
        ];

        // Ordenar pedidos por data (mais recentes primeiro)
        pedidosSimulados.sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime());

        setPedidosCliente(pedidosSimulados);
      };

      carregarHistorico();
      carregarPedidos();
    }
  }, [clienteSelecionado, modoVisualizacao]);

  // Função para filtrar clientes
  const clientesFiltrados = clientes.filter(cliente => {
    const matchTermo = cliente.nome.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      cliente.email.toLowerCase().includes(filtros.termo.toLowerCase()) ||
                      cliente.cpfCnpj.toLowerCase().includes(filtros.termo.toLowerCase());
    
    const matchStatus = filtros.status === 'todos' || cliente.statusCliente === filtros.status;
    
    const matchTipo = filtros.tipo === 'todos' || cliente.tipo === filtros.tipo;
    
    return matchTermo && matchStatus && matchTipo;
  });

  // Função para ordenar clientes
  const clientesOrdenados = [...clientesFiltrados].sort((a, b) => {
    switch (filtros.ordenacao) {
      case 'nome_asc':
        return a.nome.localeCompare(b.nome);
      case 'nome_desc':
        return b.nome.localeCompare(a.nome);
      case 'data_cadastro_asc':
        return new Date(a.dataCadastro).getTime() - new Date(b.dataCadastro).getTime();
      case 'data_cadastro_desc':
        return new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime();
      case 'valor_compras_asc':
        return a.valorTotalCompras - b.valorTotalCompras;
      case 'valor_compras_desc':
        return b.valorTotalCompras - a.valorTotalCompras;
      default:
        return a.nome.localeCompare(b.nome);
    }
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

  // Função para formatar CPF/CNPJ
  const formatarCpfCnpj = (cpfCnpj: string): string => {
    // Simplificado, em um ambiente real teria validação e formatação adequada
    return cpfCnpj;
  };

  // Função para obter cor de status
  const getCorStatus = (status: 'ativo' | 'inativo' | 'bloqueado'): string => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'bloqueado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter cor de tipo de cliente
  const getCorTipo = (tipo: 'pessoa_fisica' | 'pessoa_juridica'): string => {
    switch (tipo) {
      case 'pessoa_fisica': return 'bg-blue-100 text-blue-800';
      case 'pessoa_juridica': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Função para obter cor de status de pedido
  const getCorStatusPedido = (status: string): string => {
    switch (status) {
      case 'novo': return 'bg-blue-100 text-blue-800';
      case 'analise': return 'bg-purple-100 text-purple-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'producao': return 'bg-yellow-100 text-yellow-800';
      case 'pronto': return 'bg-indigo-100 text-indigo-800';
      case 'enviado': return 'bg-orange-100 text-orange-800';
      case 'entregue': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gerencie os clientes do ateliê</p>
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
              setClienteSelecionado(null);
              setModoEdicao(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Novo Cliente
          </button>
        </div>
      </div>
      
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="Nome, email ou CPF/CNPJ"
                  value={filtros.termo}
                  onChange={(e) => setFiltros({...filtros, termo: e.target.value})}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value as any})}
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="bloqueado">Bloqueados</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.tipo}
                onChange={(e) => setFiltros({...filtros, tipo: e.target.value as any})}
              >
                <option value="todos">Todos</option>
                <option value="pessoa_fisica">Pessoa Física</option>
                <option value="pessoa_juridica">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ordenação</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.ordenacao}
                onChange={(e) => setFiltros({...filtros, ordenacao: e.target.value})}
              >
                <option value="nome_asc">Nome (A-Z)</option>
                <option value="nome_desc">Nome (Z-A)</option>
                <option value="data_cadastro_asc">Data de Cadastro (Mais antigos)</option>
                <option value="data_cadastro_desc">Data de Cadastro (Mais recentes)</option>
                <option value="valor_compras_asc">Valor de Compras (Menor)</option>
                <option value="valor_compras_desc">Valor de Compras (Maior)</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => setFiltros({termo: '', status: 'todos', tipo: 'todos', ordenacao: 'nome_asc'})}
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
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contato
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cadastro
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Compra
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Compras
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
            {clientesOrdenados.map(cliente => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{cliente.nome}</div>
                      <div className="text-sm text-gray-500">{formatarCpfCnpj(cliente.cpfCnpj)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{cliente.email}</div>
                  <div className="text-sm text-gray-500">{cliente.telefone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorTipo(cliente.tipo)}`}>
                    {cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarData(cliente.dataCadastro)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarData(cliente.ultimaCompra)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatarValor(cliente.valorTotalCompras)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(cliente.statusCliente)}`}>
                    {cliente.statusCliente === 'ativo' ? 'Ativo' : cliente.statusCliente === 'inativo' ? 'Inativo' : 'Bloqueado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      setClienteSelecionado(cliente);
                      setModoVisualizacao(true);
                      setAbaSelecionada('info');
                    }}
                  >
                    Detalhes
                  </button>
                  <button 
                    className="text-green-600 hover:text-green-900"
                    onClick={() => {
                      setClienteSelecionado(cliente);
                      setModoEdicao(true);
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal de Visualização de Cliente */}
      {modoVisualizacao && clienteSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{clienteSelecionado.nome}</h2>
                  <p className="text-gray-600">
                    {clienteSelecionado.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'} - 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(clienteSelecionado.statusCliente)}`}>
                      {clienteSelecionado.statusCliente === 'ativo' ? 'Ativo' : clienteSelecionado.statusCliente === 'inativo' ? 'Inativo' : 'Bloqueado'}
                    </span>
                  </p>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setModoVisualizacao(false)}
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              
              {/* Abas */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      abaSelecionada === 'info'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setAbaSelecionada('info')}
                  >
                    Informações
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      abaSelecionada === 'pedidos'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setAbaSelecionada('pedidos')}
                  >
                    Pedidos
                  </button>
                  <button
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      abaSelecionada === 'historico'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setAbaSelecionada('historico')}
                  >
                    Histórico
                  </button>
                </nav>
              </div>
              
              {/* Conteúdo da aba Informações */}
              {abaSelecionada === 'info' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Dados Pessoais</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <User size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">Nome:</span>
                          <span className="ml-2">{clienteSelecionado.nome}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Mail size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">Email:</span>
                          <span className="ml-2">{clienteSelecionado.email}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <Phone size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">Telefone:</span>
                          <span className="ml-2">{clienteSelecionado.telefone}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          <CreditCard size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">CPF/CNPJ:</span>
                          <span className="ml-2">{formatarCpfCnpj(clienteSelecionado.cpfCnpj)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <span className="font-medium">Data de Cadastro:</span>
                          <span className="ml-2">{formatarData(clienteSelecionado.dataCadastro)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Endereço Principal</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-start mb-2">
                          <MapPin size={16} className="text-gray-500 mr-2 mt-1" />
                          <div>
                            <p>{clienteSelecionado.endereco.logradouro}, {clienteSelecionado.endereco.numero}</p>
                            {clienteSelecionado.endereco.complemento && (
                              <p>{clienteSelecionado.endereco.complemento}</p>
                            )}
                            <p>
                              {clienteSelecionado.endereco.bairro}, {clienteSelecionado.endereco.cidade} - {clienteSelecionado.endereco.estado}
                            </p>
                            <p>CEP: {clienteSelecionado.endereco.cep}</p>
                          </div>
                        </div>
                      </div>
                      
                      {clienteSelecionado.enderecoEntrega && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold mb-2">Endereço de Entrega</h3>
                          <div className="bg-gray-50 p-4 rounded-md">
                            <div className="flex items-start mb-2">
                              <Truck size={16} className="text-gray-500 mr-2 mt-1" />
                              <div>
                                <p>{clienteSelecionado.enderecoEntrega.logradouro}, {clienteSelecionado.enderecoEntrega.numero}</p>
                                {clienteSelecionado.enderecoEntrega.complemento && (
                                  <p>{clienteSelecionado.enderecoEntrega.complemento}</p>
                                )}
                                <p>
                                  {clienteSelecionado.enderecoEntrega.bairro}, {clienteSelecionado.enderecoEntrega.cidade} - {clienteSelecionado.enderecoEntrega.estado}
                                </p>
                                <p>CEP: {clienteSelecionado.enderecoEntrega.cep}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Contatos adicionais */}
                  {clienteSelecionado.contatos.length > 1 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Contatos Adicionais</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {clienteSelecionado.contatos.filter(c => !c.principal).map(contato => (
                          <div key={contato.id} className="mb-3 last:mb-0">
                            <div className="flex items-center">
                              <User size={16} className="text-gray-500 mr-2" />
                              <span className="font-medium">{contato.nome}</span>
                              <span className="ml-2 text-gray-500">({contato.cargo})</span>
                            </div>
                            <div className="ml-6 text-sm">
                              <p>Email: {contato.email}</p>
                              <p>Telefone: {contato.telefone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Preferências */}
                  {clienteSelecionado.preferencias.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Preferências</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {clienteSelecionado.preferencias.map(pref => (
                          <div key={pref.id} className="mb-3 last:mb-0">
                            <div className="flex items-center">
                              <Heart size={16} className="text-gray-500 mr-2" />
                              <span className="font-medium">{pref.tipo}:</span>
                              <span className="ml-2">{pref.valor}</span>
                            </div>
                            {pref.observacao && (
                              <p className="ml-6 text-sm text-gray-500">{pref.observacao}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Tags */}
                  {clienteSelecionado.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {clienteSelecionado.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center">
                            <Tag size={12} className="mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Observações */}
                  {clienteSelecionado.observacoes && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Observações</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p>{clienteSelecionado.observacoes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Conteúdo da aba Pedidos */}
              {abaSelecionada === 'pedidos' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Pedidos do Cliente</h3>
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center">
                      <Plus size={16} className="mr-1" />
                      Novo Pedido
                    </button>
                  </div>
                  
                  {pedidosCliente.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Código
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Data
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Itens
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
                          {pedidosCliente.map(pedido => (
                            <tr key={pedido.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {pedido.codigo}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatarData(pedido.dataPedido)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatarValor(pedido.valorTotal)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {pedido.itensQuantidade}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatusPedido(pedido.status)}`}>
                                  {pedido.status.charAt(0).toUpperCase() + pedido.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-indigo-600 hover:text-indigo-900">
                                  Detalhes
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-md text-center">
                      <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Este cliente ainda não possui pedidos.</p>
                      <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark inline-flex items-center mt-2">
                        <Plus size={16} className="mr-1" />
                        Criar Primeiro Pedido
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {/* Conteúdo da aba Histórico */}
              {abaSelecionada === 'historico' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Histórico do Cliente</h3>
                  
                  {historicoCliente.length > 0 ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      {historicoCliente.map(hist => (
                        <div key={hist.id} className="mb-4 pb-4 border-b border-gray-200 last:mb-0 last:pb-0 last:border-0">
                          <div className="flex justify-between">
                            <div className="flex items-start">
                              {hist.tipo === 'pedido' && <ShoppingBag size={16} className="text-blue-500 mr-2 mt-1" />}
                              {hist.tipo === 'contato' && <Phone size={16} className="text-green-500 mr-2 mt-1" />}
                              {hist.tipo === 'alteracao' && <Edit size={16} className="text-orange-500 mr-2 mt-1" />}
                              {hist.tipo === 'observacao' && <FileText size={16} className="text-purple-500 mr-2 mt-1" />}
                              <div>
                                <p className="font-medium">{hist.descricao}</p>
                                <p className="text-sm text-gray-500">Por: {hist.usuarioNome}</p>
                                {hist.referencia && (
                                  <p className="text-sm text-blue-600">Ref: {hist.referencia}</p>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-gray-500">{formatarData(hist.data)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 rounded-md text-center">
                      <Clock size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Nenhum registro de histórico encontrado.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Ações */}
              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  onClick={() => setModoVisualizacao(false)}
                >
                  Fechar
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => {
                    setModoVisualizacao(false);
                    setModoEdicao(true);
                  }}
                >
                  Editar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edição/Criação de Cliente */}
      {modoEdicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {clienteSelecionado ? `Editar Cliente: ${clienteSelecionado.nome}` : 'Novo Cliente'}
                  </h2>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setModoEdicao(false)}
                >
                  <ChevronDown size={24} />
                </button>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  O formulário completo de criação/edição de clientes seria implementado aqui.
                </p>
                <p className="text-gray-600">
                  Devido à complexidade, este exemplo mostra apenas a visualização de clientes.
                </p>
              </div>
              
              <div className="flex justify-end mt-6">
                <button 
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                  onClick={() => setModoEdicao(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  onClick={() => setModoEdicao(false)}
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

export default ClientesModule;
