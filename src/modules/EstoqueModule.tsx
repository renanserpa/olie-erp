import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Search, 
  Package, Layers, FileText, 
  ChevronDown, ChevronUp, AlertTriangle,
  Truck, ShoppingBag, BarChart2, RefreshCw
} from 'lucide-react';

// Interfaces para o módulo de Estoque
interface Insumo {
  id: string;
  nome: string;
  tipo: string;
  unidadeMedida: string;
  cor: string;
  textura: string;
  frenteMarca: string;
  estaAtivo: boolean;
  precoUnitario: number;
  fornecedorPadrao: string;
  tempoProcessamentoMinutos: number;
}

interface EstoqueInsumo {
  id: string;
  insumoId: string;
  insumo: Insumo;
  quantidadeAtual: number;
  estoqueMinimo: number;
  estoqueMaximo: number;
  localizacao: string;
  ultimaAtualizacao: string;
  proximaCompra: string | null;
  observacoes: string;
}

interface MovimentacaoEstoque {
  id: string;
  insumoId: string;
  insumoNome: string;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  data: string;
  responsavel: string;
  origem: string;
  destino: string;
  observacao: string;
  pedidoId?: string;
  compraId?: string;
  producaoId?: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
  prazoEntregaDias: number;
  estaAtivo: boolean;
}

// Componente principal do módulo de Estoque
const EstoqueModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [estoque, setEstoque] = useState<EstoqueInsumo[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoque[]>([]);
  const [insumoSelecionado, setInsumoSelecionado] = useState<EstoqueInsumo | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoMovimentacao, setModoMovimentacao] = useState(false);
  const [tipoMovimentacao, setTipoMovimentacao] = useState<'entrada' | 'saida' | 'ajuste'>('entrada');
  const [filtros, setFiltros] = useState({
    termo: '',
    tipo: '',
    status: 'todos',
    fornecedor: ''
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [abaSelecionada, setAbaSelecionada] = useState<'estoque' | 'movimentacoes'>('estoque');

  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, isso seria uma chamada à API
    const carregarDados = async () => {
      // Dados simulados
      const insumosSimulados: Insumo[] = [
        {
          id: 'ins-001',
          nome: 'Tecido Oxford',
          tipo: 'tecido',
          unidadeMedida: 'm²',
          cor: 'Preto',
          textura: 'Lisa',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 25.00,
          fornecedorPadrao: 'Tecidos Premium Ltda',
          tempoProcessamentoMinutos: 5
        },
        {
          id: 'ins-002',
          nome: 'Zíper nº 5',
          tipo: 'aviamento',
          unidadeMedida: 'unidade',
          cor: 'Dourado',
          textura: '',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 3.50,
          fornecedorPadrao: 'Aviamentos Express',
          tempoProcessamentoMinutos: 2
        },
        {
          id: 'ins-003',
          nome: 'Forro impermeável',
          tipo: 'tecido',
          unidadeMedida: 'm²',
          cor: 'Cinza',
          textura: 'Lisa',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 18.00,
          fornecedorPadrao: 'Tecidos Premium Ltda',
          tempoProcessamentoMinutos: 5
        },
        {
          id: 'ins-004',
          nome: 'Lona',
          tipo: 'tecido',
          unidadeMedida: 'm²',
          cor: 'Bege',
          textura: 'Canvas',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 30.00,
          fornecedorPadrao: 'Tecidos Premium Ltda',
          tempoProcessamentoMinutos: 8
        },
        {
          id: 'ins-005',
          nome: 'Alça de couro',
          tipo: 'aviamento',
          unidadeMedida: 'unidade',
          cor: 'Marrom',
          textura: 'Couro',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 12.00,
          fornecedorPadrao: 'Couros Naturais',
          tempoProcessamentoMinutos: 10
        },
        {
          id: 'ins-006',
          nome: 'Linha para bordado',
          tipo: 'aviamento',
          unidadeMedida: 'unidade',
          cor: 'Variadas',
          textura: '',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 8.50,
          fornecedorPadrao: 'Aviamentos Express',
          tempoProcessamentoMinutos: 1
        },
        {
          id: 'ins-007',
          nome: 'Caixa para presente',
          tipo: 'embalagem',
          unidadeMedida: 'unidade',
          cor: 'Kraft',
          textura: 'Papel',
          frenteMarca: 'Premium',
          estaAtivo: true,
          precoUnitario: 4.20,
          fornecedorPadrao: 'Embalagens Especiais',
          tempoProcessamentoMinutos: 2
        }
      ];

      const estoqueSimulado: EstoqueInsumo[] = insumosSimulados.map(insumo => ({
        id: `est-${insumo.id}`,
        insumoId: insumo.id,
        insumo: insumo,
        quantidadeAtual: Math.floor(Math.random() * 100) + 10,
        estoqueMinimo: 20,
        estoqueMaximo: 200,
        localizacao: `Prateleira ${Math.floor(Math.random() * 10) + 1}`,
        ultimaAtualizacao: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
        proximaCompra: Math.random() > 0.5 ? new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString() : null,
        observacoes: Math.random() > 0.7 ? 'Verificar qualidade no próximo recebimento' : ''
      }));

      const fornecedoresSimulados: Fornecedor[] = [
        {
          id: 'forn-001',
          nome: 'Tecidos Premium Ltda',
          contato: 'Maria Silva',
          telefone: '(11) 98765-4321',
          email: 'contato@tecidospremium.com.br',
          prazoEntregaDias: 5,
          estaAtivo: true
        },
        {
          id: 'forn-002',
          nome: 'Aviamentos Express',
          contato: 'João Oliveira',
          telefone: '(11) 91234-5678',
          email: 'vendas@aviamentosexpress.com.br',
          prazoEntregaDias: 3,
          estaAtivo: true
        },
        {
          id: 'forn-003',
          nome: 'Couros Naturais',
          contato: 'Ana Pereira',
          telefone: '(11) 97777-8888',
          email: 'contato@courosnaturais.com.br',
          prazoEntregaDias: 7,
          estaAtivo: true
        },
        {
          id: 'forn-004',
          nome: 'Embalagens Especiais',
          contato: 'Carlos Santos',
          telefone: '(11) 95555-6666',
          email: 'vendas@embalagensespeciais.com.br',
          prazoEntregaDias: 4,
          estaAtivo: true
        }
      ];

      const movimentacoesSimuladas: MovimentacaoEstoque[] = [];
      
      // Gerar algumas movimentações aleatórias para cada insumo
      insumosSimulados.forEach(insumo => {
        // Entradas
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
          movimentacoesSimuladas.push({
            id: `mov-ent-${insumo.id}-${i}`,
            insumoId: insumo.id,
            insumoNome: insumo.nome,
            tipo: 'entrada',
            quantidade: Math.floor(Math.random() * 50) + 10,
            data: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            responsavel: 'Sistema',
            origem: 'Compra',
            destino: 'Estoque',
            observacao: 'Recebimento de fornecedor',
            compraId: `comp-${Math.floor(Math.random() * 1000)}`
          });
        }
        
        // Saídas
        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
          movimentacoesSimuladas.push({
            id: `mov-sai-${insumo.id}-${i}`,
            insumoId: insumo.id,
            insumoNome: insumo.nome,
            tipo: 'saida',
            quantidade: Math.floor(Math.random() * 10) + 1,
            data: new Date(Date.now() - Math.floor(Math.random() * 20) * 24 * 60 * 60 * 1000).toISOString(),
            responsavel: 'Sistema',
            origem: 'Estoque',
            destino: 'Produção',
            observacao: 'Consumo para produção',
            producaoId: `prod-${Math.floor(Math.random() * 1000)}`
          });
        }
        
        // Ajustes (menos frequentes)
        if (Math.random() > 0.7) {
          movimentacoesSimuladas.push({
            id: `mov-ajt-${insumo.id}`,
            insumoId: insumo.id,
            insumoNome: insumo.nome,
            tipo: 'ajuste',
            quantidade: Math.floor(Math.random() * 5) * (Math.random() > 0.5 ? 1 : -1),
            data: new Date(Date.now() - Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000).toISOString(),
            responsavel: 'Admin',
            origem: 'Inventário',
            destino: 'Estoque',
            observacao: 'Ajuste de inventário'
          });
        }
      });
      
      // Ordenar movimentações por data (mais recentes primeiro)
      movimentacoesSimuladas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      setInsumos(insumosSimulados);
      setEstoque(estoqueSimulado);
      setFornecedores(fornecedoresSimulados);
      setMovimentacoes(movimentacoesSimuladas);
    };

    carregarDados();
  }, []);

  // Função para filtrar estoque
  const estoqueFiltrado = estoque.filter(item => {
    const matchTermo = item.insumo.nome.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      item.insumo.cor.toLowerCase().includes(filtros.termo.toLowerCase());
    
    const matchTipo = filtros.tipo === '' || item.insumo.tipo === filtros.tipo;
    
    const matchStatus = filtros.status === 'todos' || 
                      (filtros.status === 'abaixo_minimo' && item.quantidadeAtual < item.estoqueMinimo) || 
                      (filtros.status === 'normal' && item.quantidadeAtual >= item.estoqueMinimo);
    
    const matchFornecedor = filtros.fornecedor === '' || item.insumo.fornecedorPadrao === filtros.fornecedor;
    
    return matchTermo && matchTipo && matchStatus && matchFornecedor;
  });

  // Função para filtrar movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    const matchTermo = mov.insumoNome.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      mov.observacao.toLowerCase().includes(filtros.termo.toLowerCase());
    
    return matchTermo;
  });

  // Função para verificar status do estoque
  const getStatusEstoque = (item: EstoqueInsumo): 'critico' | 'baixo' | 'normal' | 'excesso' => {
    if (item.quantidadeAtual <= 0) return 'critico';
    if (item.quantidadeAtual < item.estoqueMinimo) return 'baixo';
    if (item.quantidadeAtual > item.estoqueMaximo) return 'excesso';
    return 'normal';
  };

  // Função para formatar data
  const formatarData = (dataString: string): string => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Função para registrar movimentação
  const registrarMovimentacao = (tipo: 'entrada' | 'saida' | 'ajuste', quantidade: number, insumoId: string, observacao: string) => {
    // Em um ambiente real, isso seria uma chamada à API
    const insumo = insumos.find(i => i.id === insumoId);
    if (!insumo) return;

    const novaMovimentacao: MovimentacaoEstoque = {
      id: `mov-${Date.now()}`,
      insumoId,
      insumoNome: insumo.nome,
      tipo,
      quantidade,
      data: new Date().toISOString(),
      responsavel: 'Usuário',
      origem: tipo === 'entrada' ? 'Fornecedor' : 'Estoque',
      destino: tipo === 'saida' ? 'Produção' : 'Estoque',
      observacao
    };

    // Atualizar estoque
    setEstoque(prev => prev.map(item => {
      if (item.insumoId === insumoId) {
        let novaQuantidade = item.quantidadeAtual;
        if (tipo === 'entrada') novaQuantidade += quantidade;
        else if (tipo === 'saida') novaQuantidade -= quantidade;
        else if (tipo === 'ajuste') novaQuantidade += quantidade; // pode ser positivo ou negativo

        return {
          ...item,
          quantidadeAtual: novaQuantidade,
          ultimaAtualizacao: new Date().toISOString()
        };
      }
      return item;
    }));

    // Adicionar movimentação
    setMovimentacoes(prev => [novaMovimentacao, ...prev]);

    // Fechar modal
    setModoMovimentacao(false);
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Estoque de Insumos</h1>
          <p className="text-gray-600">Gerencie o estoque de materiais do ateliê</p>
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
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            onClick={() => {
              setInsumoSelecionado(null);
              setTipoMovimentacao('entrada');
              setModoMovimentacao(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Entrada
          </button>
          <button 
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex items-center"
            onClick={() => {
              setInsumoSelecionado(null);
              setTipoMovimentacao('saida');
              setModoMovimentacao(true);
            }}
          >
            <Truck size={16} className="mr-1" />
            Saída
          </button>
          <button 
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center"
            onClick={() => {
              setInsumoSelecionado(null);
              setModoEdicao(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Novo Insumo
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
                  placeholder="Nome ou cor"
                  value={filtros.termo}
                  onChange={(e) => setFiltros({...filtros, termo: e.target.value})}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.tipo}
                onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="tecido">Tecido</option>
                <option value="aviamento">Aviamento</option>
                <option value="embalagem">Embalagem</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="abaixo_minimo">Abaixo do mínimo</option>
                <option value="normal">Normal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fornecedor</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.fornecedor}
                onChange={(e) => setFiltros({...filtros, fornecedor: e.target.value})}
              >
                <option value="">Todos</option>
                {fornecedores.map(f => (
                  <option key={f.id} value={f.nome}>{f.nome}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => setFiltros({termo: '', tipo: '', status: 'todos', fornecedor: ''})}
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
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-6 py-3 font-medium text-sm ${abaSelecionada === 'estoque' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setAbaSelecionada('estoque')}
            >
              Estoque Atual
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm ${abaSelecionada === 'movimentacoes' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setAbaSelecionada('movimentacoes')}
            >
              Movimentações
            </button>
          </div>
        </div>
        
        {abaSelecionada === 'estoque' ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insumo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade Atual
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque Mínimo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
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
              {estoqueFiltrado.map(item => {
                const status = getStatusEstoque(item);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 flex-shrink-0 mr-3">
                          <div 
                            className="h-8 w-8 rounded-full" 
                            style={{backgroundColor: item.insumo.cor !== 'Variadas' ? item.insumo.cor.toLowerCase() : '#ccc'}}
                          ></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.insumo.nome}</div>
                          <div className="text-sm text-gray-500">{item.insumo.cor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.insumo.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantidadeAtual} {item.insumo.unidadeMedida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.estoqueMinimo} {item.insumo.unidadeMedida}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.localizacao}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {status === 'critico' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Crítico
                        </span>
                      )}
                      {status === 'baixo' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Baixo
                        </span>
                      )}
                      {status === 'normal' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Normal
                        </span>
                      )}
                      {status === 'excesso' && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Excesso
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => {
                          setInsumoSelecionado(item);
                          setTipoMovimentacao('entrada');
                          setModoMovimentacao(true);
                        }}
                      >
                        Entrada
                      </button>
                      <button 
                        className="text-orange-600 hover:text-orange-900 mr-3"
                        onClick={() => {
                          setInsumoSelecionado(item);
                          setTipoMovimentacao('saida');
                          setModoMovimentacao(true);
                        }}
                      >
                        Saída
                      </button>
                      <button 
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        onClick={() => {
                          setInsumoSelecionado(item);
                          setModoEdicao(false);
                        }}
                      >
                        Detalhes
                      </button>
                      <button 
                        className="text-yellow-600 hover:text-yellow-900"
                        onClick={() => {
                          setInsumoSelecionado(item);
                          setModoEdicao(true);
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
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insumo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantidade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem/Destino
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observação
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimentacoesFiltradas.map(mov => (
                <tr key={mov.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatarData(mov.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {mov.insumoNome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mov.tipo === 'entrada' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Entrada
                      </span>
                    )}
                    {mov.tipo === 'saida' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        Saída
                      </span>
                    )}
                    {mov.tipo === 'ajuste' && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Ajuste
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mov.tipo === 'ajuste' && mov.quantidade < 0 ? '-' : '+'}{Math.abs(mov.quantidade)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mov.tipo === 'entrada' ? mov.origem : mov.destino}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mov.responsavel}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {mov.observacao}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        {(abaSelecionada === 'estoque' && estoqueFiltrado.length === 0) && (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum item encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou cadastrar novos insumos.
            </p>
            <div className="mt-6">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={() => {
                  setInsumoSelecionado(null);
                  setModoEdicao(true);
                }}
              >
                Cadastrar Novo Insumo
              </button>
            </div>
          </div>
        )}
        
        {(abaSelecionada === 'movimentacoes' && movimentacoesFiltradas.length === 0) && (
          <div className="text-center py-10">
            <RefreshCw size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Nenhuma movimentação encontrada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou registrar novas movimentações.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={() => {
                  setInsumoSelecionado(null);
                  setTipoMovimentacao('entrada');
                  setModoMovimentacao(true);
                }}
              >
                Registrar Entrada
              </button>
              <button
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                onClick={() => {
                  setInsumoSelecionado(null);
                  setTipoMovimentacao('saida');
                  setModoMovimentacao(true);
                }}
              >
                Registrar Saída
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Resumo do Estoque</h3>
            <BarChart2 size={20} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total de Insumos:</span>
              <span className="font-semibold">{estoque.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Abaixo do Mínimo:</span>
              <span className="font-semibold text-yellow-600">
                {estoque.filter(item => item.quantidadeAtual < item.estoqueMinimo).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Em Estoque Crítico:</span>
              <span className="font-semibold text-red-600">
                {estoque.filter(item => item.quantidadeAtual <= 0).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Total em Estoque:</span>
              <span className="font-semibold">
                R$ {estoque.reduce((total, item) => total + (item.quantidadeAtual * item.insumo.precoUnitario), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Insumos Críticos</h3>
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div className="space-y-3">
            {estoque
              .filter(item => item.quantidadeAtual < item.estoqueMinimo)
              .slice(0, 5)
              .map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="h-6 w-6 rounded-full mr-2" 
                      style={{backgroundColor: item.insumo.cor !== 'Variadas' ? item.insumo.cor.toLowerCase() : '#ccc'}}
                    ></div>
                    <span className="text-sm">{item.insumo.nome}</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm ${item.quantidadeAtual <= 0 ? 'text-red-600 font-semibold' : 'text-yellow-600'}`}>
                      {item.quantidadeAtual} / {item.estoqueMinimo}
                    </span>
                    <button 
                      className="ml-2 p-1 text-green-600 hover:text-green-900"
                      onClick={() => {
                        setInsumoSelecionado(item);
                        setTipoMovimentacao('entrada');
                        setModoMovimentacao(true);
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            
            {estoque.filter(item => item.quantidadeAtual < item.estoqueMinimo).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nenhum insumo crítico no momento
              </div>
            )}
            
            {estoque.filter(item => item.quantidadeAtual < item.estoqueMinimo).length > 5 && (
              <div className="text-center mt-2">
                <button className="text-sm text-primary hover:text-primary-dark">
                  Ver todos ({estoque.filter(item => item.quantidadeAtual < item.estoqueMinimo).length})
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Últimas Movimentações</h3>
            <RefreshCw size={20} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {movimentacoes.slice(0, 5).map(mov => (
              <div key={mov.id} className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    {mov.tipo === 'entrada' && <Plus size={14} className="text-green-600 mr-1" />}
                    {mov.tipo === 'saida' && <Truck size={14} className="text-orange-600 mr-1" />}
                    {mov.tipo === 'ajuste' && <RefreshCw size={14} className="text-blue-600 mr-1" />}
                    <span className="text-sm font-medium">{mov.insumoNome}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatarData(mov.data)}</span>
                </div>
                <div>
                  <span className={`text-sm ${
                    mov.tipo === 'entrada' ? 'text-green-600' : 
                    mov.tipo === 'saida' ? 'text-orange-600' : 'text-blue-600'
                  }`}>
                    {mov.tipo === 'entrada' ? '+' : 
                     mov.tipo === 'saida' ? '-' : 
                     mov.quantidade >= 0 ? '+' : '-'}
                    {Math.abs(mov.quantidade)}
                  </span>
                </div>
              </div>
            ))}
            
            {movimentacoes.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Nenhuma movimentação registrada
              </div>
            )}
            
            {movimentacoes.length > 5 && (
              <div className="text-center mt-2">
                <button 
                  className="text-sm text-primary hover:text-primary-dark"
                  onClick={() => setAbaSelecionada('movimentacoes')}
                >
                  Ver todas ({movimentacoes.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Detalhes do Insumo */}
      {insumoSelecionado && !modoEdicao && !modoMovimentacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{insumoSelecionado.insumo.nome}</h2>
                  <p className="text-gray-600">{insumoSelecionado.insumo.tipo}</p>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setInsumoSelecionado(null)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center">
                    <div 
                      className="h-32 w-32 rounded-full mb-4" 
                      style={{backgroundColor: insumoSelecionado.insumo.cor !== 'Variadas' ? insumoSelecionado.insumo.cor.toLowerCase() : '#ccc'}}
                    ></div>
                    <h3 className="text-xl font-semibold">{insumoSelecionado.insumo.nome}</h3>
                    <p className="text-gray-600">{insumoSelecionado.insumo.cor} - {insumoSelecionado.insumo.textura}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Informações do Estoque</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500">Quantidade Atual:</span>
                        <p className="font-semibold">{insumoSelecionado.quantidadeAtual} {insumoSelecionado.insumo.unidadeMedida}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Estoque Mínimo:</span>
                        <p>{insumoSelecionado.estoqueMinimo} {insumoSelecionado.insumo.unidadeMedida}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Estoque Máximo:</span>
                        <p>{insumoSelecionado.estoqueMaximo} {insumoSelecionado.insumo.unidadeMedida}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Localização:</span>
                        <p>{insumoSelecionado.localizacao}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Última Atualização:</span>
                        <p>{formatarData(insumoSelecionado.ultimaAtualizacao)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p>
                          <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                            getStatusEstoque(insumoSelecionado) === 'critico' ? 'bg-red-100 text-red-800' :
                            getStatusEstoque(insumoSelecionado) === 'baixo' ? 'bg-yellow-100 text-yellow-800' :
                            getStatusEstoque(insumoSelecionado) === 'normal' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {getStatusEstoque(insumoSelecionado) === 'critico' ? 'Crítico' :
                             getStatusEstoque(insumoSelecionado) === 'baixo' ? 'Baixo' :
                             getStatusEstoque(insumoSelecionado) === 'normal' ? 'Normal' :
                             'Excesso'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Detalhes do Insumo</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500">Preço Unitário:</span>
                        <p>R$ {insumoSelecionado.insumo.precoUnitario.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Fornecedor Padrão:</span>
                        <p>{insumoSelecionado.insumo.fornecedorPadrao}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Tempo de Processamento:</span>
                        <p>{insumoSelecionado.insumo.tempoProcessamentoMinutos} min</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Frente da Marca:</span>
                        <p>{insumoSelecionado.insumo.frenteMarca}</p>
                      </div>
                    </div>
                  </div>
                  
                  {insumoSelecionado.observacoes && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Observações</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{insumoSelecionado.observacoes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Últimas Movimentações</h3>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem/Destino</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {movimentacoes
                        .filter(mov => mov.insumoId === insumoSelecionado.insumoId)
                        .slice(0, 5)
                        .map(mov => (
                          <tr key={mov.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(mov.data)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {mov.tipo === 'entrada' && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Entrada
                                </span>
                              )}
                              {mov.tipo === 'saida' && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                  Saída
                                </span>
                              )}
                              {mov.tipo === 'ajuste' && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Ajuste
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mov.tipo === 'ajuste' && mov.quantidade < 0 ? '-' : '+'}{Math.abs(mov.quantidade)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {mov.tipo === 'entrada' ? mov.origem : mov.destino}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{mov.observacao}</td>
                          </tr>
                        ))}
                      
                      {movimentacoes.filter(mov => mov.insumoId === insumoSelecionado.insumoId).length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                            Nenhuma movimentação registrada para este insumo
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => setInsumoSelecionado(null)}
                >
                  Voltar para Lista
                </button>
                
                <div className="space-x-2">
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    onClick={() => {
                      setTipoMovimentacao('entrada');
                      setModoMovimentacao(true);
                    }}
                  >
                    Registrar Entrada
                  </button>
                  <button 
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                    onClick={() => {
                      setTipoMovimentacao('saida');
                      setModoMovimentacao(true);
                    }}
                  >
                    Registrar Saída
                  </button>
                  <button 
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    onClick={() => setModoEdicao(true)}
                  >
                    Editar Insumo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edição/Criação de Insumo */}
      {modoEdicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {insumoSelecionado ? 'Editar Insumo' : 'Novo Insumo'}
                </h2>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setModoEdicao(false);
                    setInsumoSelecionado(null);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Informações do Insumo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Insumo</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Nome do insumo"
                      value={insumoSelecionado?.insumo.nome || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={insumoSelecionado?.insumo.tipo || ''}
                      // onChange seria implementado em um ambiente real
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="tecido">Tecido</option>
                      <option value="aviamento">Aviamento</option>
                      <option value="embalagem">Embalagem</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cor</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Cor do insumo"
                      value={insumoSelecionado?.insumo.cor || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Textura</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Textura do insumo"
                      value={insumoSelecionado?.insumo.textura || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Unidade de Medida</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={insumoSelecionado?.insumo.unidadeMedida || ''}
                      // onChange seria implementado em um ambiente real
                    >
                      <option value="m²">m²</option>
                      <option value="m">m</option>
                      <option value="unidade">unidade</option>
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço Unitário (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      value={insumoSelecionado?.insumo.precoUnitario || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fornecedor Padrão</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={insumoSelecionado?.insumo.fornecedorPadrao || ''}
                      // onChange seria implementado em um ambiente real
                    >
                      <option value="">Selecione um fornecedor</option>
                      {fornecedores.map(f => (
                        <option key={f.id} value={f.nome}>{f.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tempo de Processamento (min)</label>
                    <input 
                      type="number" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0"
                      value={insumoSelecionado?.insumo.tempoProcessamentoMinutos || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Frente da Marca</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Frente da marca"
                      value={insumoSelecionado?.insumo.frenteMarca || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <div className="flex items-center mt-2">
                      <label className="inline-flex items-center mr-4">
                        <input 
                          type="radio" 
                          className="form-radio h-4 w-4 text-primary"
                          checked={insumoSelecionado?.insumo.estaAtivo || false}
                          // onChange seria implementado em um ambiente real
                        />
                        <span className="ml-2">Ativo</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          className="form-radio h-4 w-4 text-primary"
                          checked={insumoSelecionado ? !insumoSelecionado.insumo.estaAtivo : false}
                          // onChange seria implementado em um ambiente real
                        />
                        <span className="ml-2">Inativo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Informações de Estoque</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Quantidade Atual</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      value={insumoSelecionado?.quantidadeAtual || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque Mínimo</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      value={insumoSelecionado?.estoqueMinimo || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Estoque Máximo</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      value={insumoSelecionado?.estoqueMaximo || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Localização</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Localização no estoque"
                      value={insumoSelecionado?.localizacao || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Observações</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      placeholder="Observações sobre o insumo"
                      value={insumoSelecionado?.observacoes || ''}
                      // onChange seria implementado em um ambiente real
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setModoEdicao(false);
                    setInsumoSelecionado(null);
                  }}
                >
                  Cancelar
                </button>
                
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  {insumoSelecionado ? 'Salvar Alterações' : 'Criar Insumo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Movimentação de Estoque */}
      {modoMovimentacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {tipoMovimentacao === 'entrada' ? 'Registrar Entrada' : 
                   tipoMovimentacao === 'saida' ? 'Registrar Saída' : 'Ajuste de Estoque'}
                </h2>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setModoMovimentacao(false);
                    if (!insumoSelecionado) setInsumoSelecionado(null);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Insumo</label>
                  <select 
                    className="w-full px-3 py-2 border rounded-md"
                    value={insumoSelecionado?.insumoId || ''}
                    // onChange seria implementado em um ambiente real
                    disabled={!!insumoSelecionado}
                  >
                    <option value="">Selecione um insumo</option>
                    {insumos.map(insumo => (
                      <option key={insumo.id} value={insumo.id}>{insumo.nome} - {insumo.cor}</option>
                    ))}
                  </select>
                </div>
                
                {insumoSelecionado && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Estoque Atual:</span>
                        <p className="font-semibold">{insumoSelecionado.quantidadeAtual} {insumoSelecionado.insumo.unidadeMedida}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Estoque Mínimo:</span>
                        <p>{insumoSelecionado.estoqueMinimo} {insumoSelecionado.insumo.unidadeMedida}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Tipo de Movimentação</label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-green-600"
                        checked={tipoMovimentacao === 'entrada'}
                        onChange={() => setTipoMovimentacao('entrada')}
                      />
                      <span className="ml-2">Entrada</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-orange-600"
                        checked={tipoMovimentacao === 'saida'}
                        onChange={() => setTipoMovimentacao('saida')}
                      />
                      <span className="ml-2">Saída</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        className="form-radio h-4 w-4 text-blue-600"
                        checked={tipoMovimentacao === 'ajuste'}
                        onChange={() => setTipoMovimentacao('ajuste')}
                      />
                      <span className="ml-2">Ajuste</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quantidade</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="0.00"
                    // value e onChange seriam implementados em um ambiente real
                  />
                </div>
                
                {tipoMovimentacao === 'entrada' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Origem</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      // value e onChange seriam implementados em um ambiente real
                    >
                      <option value="Fornecedor">Fornecedor</option>
                      <option value="Devolução">Devolução</option>
                      <option value="Transferência">Transferência</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                )}
                
                {tipoMovimentacao === 'saida' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Destino</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      // value e onChange seriam implementados em um ambiente real
                    >
                      <option value="Produção">Produção</option>
                      <option value="Amostra">Amostra</option>
                      <option value="Descarte">Descarte</option>
                      <option value="Transferência">Transferência</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Observação</label>
                  <textarea 
                    className="w-full px-3 py-2 border rounded-md"
                    rows={3}
                    placeholder="Observação sobre a movimentação"
                    // value e onChange seriam implementados em um ambiente real
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setModoMovimentacao(false);
                    if (!insumoSelecionado) setInsumoSelecionado(null);
                  }}
                >
                  Cancelar
                </button>
                
                <button 
                  className={`px-4 py-2 text-white rounded-md ${
                    tipoMovimentacao === 'entrada' ? 'bg-green-500 hover:bg-green-600' : 
                    tipoMovimentacao === 'saida' ? 'bg-orange-500 hover:bg-orange-600' : 
                    'bg-blue-500 hover:bg-blue-600'
                  }`}
                  onClick={() => {
                    // Simulação de registro de movimentação
                    if (insumoSelecionado) {
                      registrarMovimentacao(
                        tipoMovimentacao,
                        tipoMovimentacao === 'saida' ? 5 : 10, // Quantidade simulada
                        insumoSelecionado.insumoId,
                        'Movimentação registrada manualmente'
                      );
                    }
                  }}
                >
                  Registrar {tipoMovimentacao === 'entrada' ? 'Entrada' : tipoMovimentacao === 'saida' ? 'Saída' : 'Ajuste'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoqueModule;
