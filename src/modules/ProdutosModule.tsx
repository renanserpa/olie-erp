import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Search, 
  Tag, Package, Layers, FileText, 
  ChevronDown, ChevronUp, Image, 
  Scissors, PenTool, Shirt, ShoppingBag
} from 'lucide-react';

// Interfaces para o módulo de Produtos
interface Produto {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  categoria: string;
  tamanhosDisponiveis: string[];
  possuiPersonalizacao: boolean;
  imagemPrincipal: string;
  galeriaImagens: string[];
  precoBase: number;
  estaAtivo: boolean;
  notasInternas: string;
  referencia: string;
  peso: number;
  dimensoes: {
    largura: number;
    comprimento: number;
    altura: number;
  };
  composicao: ComponenteProduto[];
  personalizacoes: OpcaoPersonalizacao[];
}

interface ComponenteProduto {
  id: string;
  produtoId: string;
  insumoId: string;
  insumoNome: string;
  quantidade: number;
  unidade: string;
  tipo: string; // tecido, aviamento, embalagem, etc.
  posicao: string; // frente, costas, lateral, etc.
  obrigatorio: boolean;
  tempoProducaoMinutos: number;
}

interface OpcaoPersonalizacao {
  id: string;
  produtoId: string;
  tipo: string; // bordado, hotstamping, etc.
  nome: string;
  descricao: string;
  precoAdicional: number;
  tempoAdicionalMinutos: number;
  arquivoModelo: string;
  posicoesPossiveis: string[];
  restricoes: string;
}

interface Categoria {
  id: string;
  nome: string;
  slug: string;
  estaAtiva: boolean;
  imagemCapa: string;
  ordemExibicao: number;
  destaque: boolean;
  seoDescricao: string;
  seoTitulo: string;
}

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

// Componente principal do módulo de Produtos
const ProdutosModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [insumos, setInsumos] = useState<Insumo[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [filtros, setFiltros] = useState({
    termo: '',
    categoria: '',
    ativo: 'todos',
    personalizavel: 'todos'
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    // Simulação de carregamento de dados
    // Em um ambiente real, isso seria uma chamada à API
    const carregarDados = async () => {
      // Dados simulados
      const produtosSimulados: Produto[] = [
        {
          id: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
          nome: 'Necessaire Paris',
          slug: 'necessaire-paris',
          descricao: 'Necessaire elegante com acabamento premium',
          categoria: 'Acessórios',
          tamanhosDisponiveis: ['P', 'M', 'G'],
          possuiPersonalizacao: true,
          imagemPrincipal: '/assets/produtos/necessaire-paris.jpg',
          galeriaImagens: [
            '/assets/produtos/necessaire-paris-1.jpg',
            '/assets/produtos/necessaire-paris-2.jpg'
          ],
          precoBase: 89.90,
          estaAtivo: true,
          notasInternas: 'Produto com alta demanda',
          referencia: 'NEC-001',
          peso: 150,
          dimensoes: {
            largura: 20,
            comprimento: 30,
            altura: 10
          },
          composicao: [
            {
              id: 'comp-001',
              produtoId: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
              insumoId: 'ins-001',
              insumoNome: 'Tecido Oxford',
              quantidade: 0.5,
              unidade: 'm²',
              tipo: 'tecido',
              posicao: 'corpo',
              obrigatorio: true,
              tempoProducaoMinutos: 15
            },
            {
              id: 'comp-002',
              produtoId: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
              insumoId: 'ins-002',
              insumoNome: 'Zíper nº 5',
              quantidade: 1,
              unidade: 'unidade',
              tipo: 'aviamento',
              posicao: 'abertura',
              obrigatorio: true,
              tempoProducaoMinutos: 5
            },
            {
              id: 'comp-003',
              produtoId: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
              insumoId: 'ins-003',
              insumoNome: 'Forro impermeável',
              quantidade: 0.4,
              unidade: 'm²',
              tipo: 'tecido',
              posicao: 'forro',
              obrigatorio: true,
              tempoProducaoMinutos: 10
            }
          ],
          personalizacoes: [
            {
              id: 'pers-001',
              produtoId: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
              tipo: 'bordado',
              nome: 'Bordado de iniciais',
              descricao: 'Bordado de até 3 iniciais em fonte script',
              precoAdicional: 15.00,
              tempoAdicionalMinutos: 20,
              arquivoModelo: '/assets/personalizacoes/bordado-iniciais.jpg',
              posicoesPossiveis: ['frente', 'lateral'],
              restricoes: 'Máximo 3 caracteres'
            },
            {
              id: 'pers-002',
              produtoId: '9d4b9ddd-ce6d-4bd4-a8a5-2e5694bb9021',
              tipo: 'hotstamping',
              nome: 'Hot stamping dourado',
              descricao: 'Aplicação de hot stamping dourado',
              precoAdicional: 25.00,
              tempoAdicionalMinutos: 15,
              arquivoModelo: '/assets/personalizacoes/hotstamping-dourado.jpg',
              posicoesPossiveis: ['frente'],
              restricoes: 'Área máxima 5x5cm'
            }
          ]
        },
        {
          id: '8c3a7eee-df5c-4b93-b9a4-1f5683bb9022',
          nome: 'Bolsa Tote',
          slug: 'bolsa-tote',
          descricao: 'Bolsa tote versátil para o dia a dia',
          categoria: 'Bolsas',
          tamanhosDisponiveis: ['Único'],
          possuiPersonalizacao: true,
          imagemPrincipal: '/assets/produtos/bolsa-tote.jpg',
          galeriaImagens: [
            '/assets/produtos/bolsa-tote-1.jpg',
            '/assets/produtos/bolsa-tote-2.jpg'
          ],
          precoBase: 129.90,
          estaAtivo: true,
          notasInternas: 'Produto bestseller',
          referencia: 'BOL-001',
          peso: 350,
          dimensoes: {
            largura: 40,
            comprimento: 45,
            altura: 15
          },
          composicao: [
            {
              id: 'comp-004',
              produtoId: '8c3a7eee-df5c-4b93-b9a4-1f5683bb9022',
              insumoId: 'ins-004',
              insumoNome: 'Lona',
              quantidade: 1.2,
              unidade: 'm²',
              tipo: 'tecido',
              posicao: 'corpo',
              obrigatorio: true,
              tempoProducaoMinutos: 25
            },
            {
              id: 'comp-005',
              produtoId: '8c3a7eee-df5c-4b93-b9a4-1f5683bb9022',
              insumoId: 'ins-005',
              insumoNome: 'Alça de couro',
              quantidade: 2,
              unidade: 'unidade',
              tipo: 'aviamento',
              posicao: 'alças',
              obrigatorio: true,
              tempoProducaoMinutos: 15
            }
          ],
          personalizacoes: [
            {
              id: 'pers-003',
              produtoId: '8c3a7eee-df5c-4b93-b9a4-1f5683bb9022',
              tipo: 'bordado',
              nome: 'Bordado personalizado',
              descricao: 'Bordado de nome ou frase curta',
              precoAdicional: 20.00,
              tempoAdicionalMinutos: 30,
              arquivoModelo: '/assets/personalizacoes/bordado-nome.jpg',
              posicoesPossiveis: ['frente', 'lateral'],
              restricoes: 'Máximo 15 caracteres'
            }
          ]
        }
      ];

      const categoriasSimuladas: Categoria[] = [
        {
          id: 'cat-001',
          nome: 'Bolsas',
          slug: 'bolsas',
          estaAtiva: true,
          imagemCapa: '/assets/categorias/bolsas.jpg',
          ordemExibicao: 1,
          destaque: true,
          seoDescricao: 'Bolsas artesanais exclusivas',
          seoTitulo: 'Bolsas Artesanais | Ateliê Olie'
        },
        {
          id: 'cat-002',
          nome: 'Acessórios',
          slug: 'acessorios',
          estaAtiva: true,
          imagemCapa: '/assets/categorias/acessorios.jpg',
          ordemExibicao: 2,
          destaque: true,
          seoDescricao: 'Acessórios artesanais exclusivos',
          seoTitulo: 'Acessórios Artesanais | Ateliê Olie'
        },
        {
          id: 'cat-003',
          nome: 'Decoração',
          slug: 'decoracao',
          estaAtiva: true,
          imagemCapa: '/assets/categorias/decoracao.jpg',
          ordemExibicao: 3,
          destaque: false,
          seoDescricao: 'Itens de decoração artesanais',
          seoTitulo: 'Decoração Artesanal | Ateliê Olie'
        }
      ];

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
        }
      ];

      setProdutos(produtosSimulados);
      setCategorias(categoriasSimuladas);
      setInsumos(insumosSimulados);
    };

    carregarDados();
  }, []);

  // Função para filtrar produtos
  const produtosFiltrados = produtos.filter(produto => {
    const matchTermo = produto.nome.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      produto.descricao.toLowerCase().includes(filtros.termo.toLowerCase());
    
    const matchCategoria = filtros.categoria === '' || produto.categoria === filtros.categoria;
    
    const matchAtivo = filtros.ativo === 'todos' || 
                      (filtros.ativo === 'ativos' && produto.estaAtivo) || 
                      (filtros.ativo === 'inativos' && !produto.estaAtivo);
    
    const matchPersonalizavel = filtros.personalizavel === 'todos' || 
                              (filtros.personalizavel === 'sim' && produto.possuiPersonalizacao) || 
                              (filtros.personalizavel === 'nao' && !produto.possuiPersonalizacao);
    
    return matchTermo && matchCategoria && matchAtivo && matchPersonalizavel;
  });

  // Função para calcular tempo total de produção
  const calcularTempoProducao = (produto: Produto): number => {
    const tempoComponentes = produto.composicao.reduce((total, comp) => total + comp.tempoProducaoMinutos, 0);
    // Assumindo que personalizações são opcionais, não somamos ao tempo base
    return tempoComponentes;
  };

  // Função para calcular custo de materiais
  const calcularCustoMateriais = (produto: Produto): number => {
    return produto.composicao.reduce((total, comp) => {
      const insumo = insumos.find(i => i.id === comp.insumoId);
      if (insumo) {
        return total + (insumo.precoUnitario * comp.quantidade);
      }
      return total;
    }, 0);
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Produtos</h1>
          <p className="text-gray-600">Gerencie o catálogo de produtos do ateliê</p>
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
              setProdutoSelecionado(null);
              setModoEdicao(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Novo Produto
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
                  placeholder="Nome ou descrição"
                  value={filtros.termo}
                  onChange={(e) => setFiltros({...filtros, termo: e.target.value})}
                />
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.categoria}
                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
              >
                <option value="">Todas</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.ativo}
                onChange={(e) => setFiltros({...filtros, ativo: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="ativos">Ativos</option>
                <option value="inativos">Inativos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Personalização</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.personalizavel}
                onChange={(e) => setFiltros({...filtros, personalizavel: e.target.value})}
              >
                <option value="todos">Todos</option>
                <option value="sim">Personalizáveis</option>
                <option value="nao">Não personalizáveis</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => setFiltros({termo: '', categoria: '', ativo: 'todos', personalizavel: 'todos'})}
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
                Produto
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço Base
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo Produção
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personalização
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
            {produtosFiltrados.map(produto => (
              <tr key={produto.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      <img 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={produto.imagemPrincipal || '/assets/placeholder.jpg'} 
                        alt={produto.nome} 
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                      <div className="text-sm text-gray-500">Ref: {produto.referencia}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {produto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {produto.precoBase.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calcularTempoProducao(produto)} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {produto.possuiPersonalizacao ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Sim
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Não
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {produto.estaAtivo ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Inativo
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setModoEdicao(false);
                    }}
                  >
                    Detalhes
                  </button>
                  <button 
                    className="text-yellow-600 hover:text-yellow-900 mr-3"
                    onClick={() => {
                      setProdutoSelecionado(produto);
                      setModoEdicao(true);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => {
                      // Lógica para excluir produto
                      if (confirm(`Deseja realmente excluir o produto "${produto.nome}"?`)) {
                        setProdutos(produtos.filter(p => p.id !== produto.id));
                      }
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {produtosFiltrados.length === 0 && (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tente ajustar os filtros ou criar um novo produto.
            </p>
            <div className="mt-6">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                onClick={() => {
                  setProdutoSelecionado(null);
                  setModoEdicao(true);
                }}
              >
                Criar Novo Produto
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Detalhes do Produto */}
      {produtoSelecionado && !modoEdicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{produtoSelecionado.nome}</h2>
                  <p className="text-gray-600">Ref: {produtoSelecionado.referencia}</p>
                </div>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setProdutoSelecionado(null)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img 
                    src={produtoSelecionado.imagemPrincipal || '/assets/placeholder.jpg'} 
                    alt={produtoSelecionado.nome}
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="flex mt-2 space-x-2 overflow-x-auto">
                    {produtoSelecionado.galeriaImagens.map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`${produtoSelecionado.nome} - ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-md cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500">Categoria:</span>
                        <p>{produtoSelecionado.categoria}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Preço Base:</span>
                        <p>R$ {produtoSelecionado.precoBase.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p>{produtoSelecionado.estaAtivo ? 'Ativo' : 'Inativo'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Personalização:</span>
                        <p>{produtoSelecionado.possuiPersonalizacao ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Dimensões e Peso</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-sm text-gray-500">Largura:</span>
                        <p>{produtoSelecionado.dimensoes.largura} cm</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Comprimento:</span>
                        <p>{produtoSelecionado.dimensoes.comprimento} cm</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Altura:</span>
                        <p>{produtoSelecionado.dimensoes.altura} cm</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Peso:</span>
                        <p>{produtoSelecionado.peso} g</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Tamanhos Disponíveis</h3>
                    <div className="flex flex-wrap gap-2">
                      {produtoSelecionado.tamanhosDisponiveis.map((tamanho, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                        >
                          {tamanho}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                    <p className="text-gray-700">{produtoSelecionado.descricao}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Composição do Produto</h3>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insumo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo (min)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {produtoSelecionado.composicao.map(comp => (
                        <tr key={comp.id}>
                          <td className="px-6 py-4 text-sm">{comp.insumoNome}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{comp.tipo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{comp.quantidade} {comp.unidade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{comp.posicao}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{comp.tempoProducaoMinutos}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={3} className="px-6 py-3 text-sm font-medium text-gray-900">Custo total de materiais:</td>
                        <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900">
                          R$ {calcularCustoMateriais(produtoSelecionado).toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-6 py-3 text-sm font-medium text-gray-900">Tempo total de produção:</td>
                        <td colSpan={2} className="px-6 py-3 text-sm font-medium text-gray-900">
                          {calcularTempoProducao(produtoSelecionado)} minutos
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              
              {produtoSelecionado.possuiPersonalizacao && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Opções de Personalização</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {produtoSelecionado.personalizacoes.map(pers => (
                      <div key={pers.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{pers.nome}</h4>
                            <p className="text-sm text-gray-600">{pers.descricao}</p>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {pers.tipo}
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Preço adicional:</span>
                            <p>R$ {pers.precoAdicional.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Tempo adicional:</span>
                            <p>{pers.tempoAdicionalMinutos} min</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Posições possíveis:</span>
                            <p>{pers.posicoesPossiveis.join(', ')}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Restrições:</span>
                            <p>{pers.restricoes}</p>
                          </div>
                        </div>
                        {pers.arquivoModelo && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-500">Modelo:</span>
                            <div className="mt-1">
                              <img 
                                src={pers.arquivoModelo} 
                                alt={`Modelo de ${pers.nome}`}
                                className="h-16 w-auto object-contain"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <button className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  Voltar para Lista
                </button>
                
                <div className="space-x-2">
                  <button className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                    Duplicar Produto
                  </button>
                  <button 
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    onClick={() => setModoEdicao(true)}
                  >
                    Editar Produto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edição/Criação de Produto */}
      {modoEdicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold">
                  {produtoSelecionado ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button 
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    setModoEdicao(false);
                    setProdutoSelecionado(null);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome do Produto</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Nome do produto"
                      value={produtoSelecionado?.nome || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Referência</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="Código de referência"
                      value={produtoSelecionado?.referencia || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Categoria</label>
                    <select 
                      className="w-full px-3 py-2 border rounded-md"
                      value={produtoSelecionado?.categoria || ''}
                      // onChange seria implementado em um ambiente real
                    >
                      <option value="">Selecione uma categoria</option>
                      {categorias.map(cat => (
                        <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Preço Base (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.00"
                      value={produtoSelecionado?.precoBase || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Descrição</label>
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md"
                      rows={3}
                      placeholder="Descrição detalhada do produto"
                      value={produtoSelecionado?.descricao || ''}
                      // onChange seria implementado em um ambiente real
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tamanhos Disponíveis</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['PP', 'P', 'M', 'G', 'GG', 'Único'].map((tamanho) => (
                        <label key={tamanho} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-4 w-4 text-primary"
                            checked={produtoSelecionado?.tamanhosDisponiveis.includes(tamanho) || false}
                            // onChange seria implementado em um ambiente real
                          />
                          <span className="ml-2">{tamanho}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <div className="flex items-center mt-2">
                      <label className="inline-flex items-center mr-4">
                        <input 
                          type="radio" 
                          className="form-radio h-4 w-4 text-primary"
                          checked={produtoSelecionado?.estaAtivo || false}
                          // onChange seria implementado em um ambiente real
                        />
                        <span className="ml-2">Ativo</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          className="form-radio h-4 w-4 text-primary"
                          checked={produtoSelecionado ? !produtoSelecionado.estaAtivo : false}
                          // onChange seria implementado em um ambiente real
                        />
                        <span className="ml-2">Inativo</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Dimensões e Peso</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Largura (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.0"
                      value={produtoSelecionado?.dimensoes.largura || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Comprimento (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.0"
                      value={produtoSelecionado?.dimensoes.comprimento || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Altura (cm)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0.0"
                      value={produtoSelecionado?.dimensoes.altura || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Peso (g)</label>
                    <input 
                      type="number" 
                      step="1"
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="0"
                      value={produtoSelecionado?.peso || ''}
                      // onChange seria implementado em um ambiente real
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Composição do Produto</h3>
                  <button className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center text-sm">
                    <Plus size={14} className="mr-1" />
                    Adicionar Insumo
                  </button>
                </div>
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insumo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posição</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tempo (min)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(produtoSelecionado?.composicao || []).map((comp, index) => (
                        <tr key={comp.id || index}>
                          <td className="px-6 py-4 text-sm">
                            <select 
                              className="w-full px-2 py-1 border rounded-md"
                              value={comp.insumoId}
                              // onChange seria implementado em um ambiente real
                            >
                              <option value="">Selecione um insumo</option>
                              {insumos.map(insumo => (
                                <option key={insumo.id} value={insumo.id}>{insumo.nome}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border rounded-md"
                              placeholder="Tipo"
                              value={comp.tipo}
                              // onChange seria implementado em um ambiente real
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <input 
                                type="number" 
                                step="0.01"
                                className="w-20 px-2 py-1 border rounded-md"
                                placeholder="0.00"
                                value={comp.quantidade}
                                // onChange seria implementado em um ambiente real
                              />
                              <select 
                                className="ml-2 px-2 py-1 border rounded-md"
                                value={comp.unidade}
                                // onChange seria implementado em um ambiente real
                              >
                                <option value="m²">m²</option>
                                <option value="m">m</option>
                                <option value="unidade">unidade</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                              </select>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input 
                              type="text" 
                              className="w-full px-2 py-1 border rounded-md"
                              placeholder="Posição"
                              value={comp.posicao}
                              // onChange seria implementado em um ambiente real
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input 
                              type="number" 
                              className="w-full px-2 py-1 border rounded-md"
                              placeholder="0"
                              value={comp.tempoProducaoMinutos}
                              // onChange seria implementado em um ambiente real
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button className="text-red-600 hover:text-red-900">
                              Remover
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <label className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-4 w-4 text-primary"
                      checked={produtoSelecionado?.possuiPersonalizacao || false}
                      // onChange seria implementado em um ambiente real
                    />
                    <span className="ml-2 text-lg font-semibold">Possui Personalização</span>
                  </label>
                </div>
                
                {(produtoSelecionado?.possuiPersonalizacao) && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Opções de Personalização</h3>
                      <button className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 flex items-center text-sm">
                        <Plus size={14} className="mr-1" />
                        Adicionar Opção
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {(produtoSelecionado?.personalizacoes || []).map((pers, index) => (
                        <div key={pers.id || index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">Opção de Personalização {index + 1}</h4>
                            <button className="text-red-600 hover:text-red-900 text-sm">
                              Remover
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Nome</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Nome da personalização"
                                value={pers.nome}
                                // onChange seria implementado em um ambiente real
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Tipo</label>
                              <select 
                                className="w-full px-3 py-2 border rounded-md"
                                value={pers.tipo}
                                // onChange seria implementado em um ambiente real
                              >
                                <option value="bordado">Bordado</option>
                                <option value="hotstamping">Hot Stamping</option>
                                <option value="gravacao">Gravação</option>
                                <option value="pintura">Pintura</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Preço Adicional (R$)</label>
                              <input 
                                type="number" 
                                step="0.01"
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="0.00"
                                value={pers.precoAdicional}
                                // onChange seria implementado em um ambiente real
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Tempo Adicional (min)</label>
                              <input 
                                type="number" 
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="0"
                                value={pers.tempoAdicionalMinutos}
                                // onChange seria implementado em um ambiente real
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Descrição</label>
                              <textarea 
                                className="w-full px-3 py-2 border rounded-md"
                                rows={2}
                                placeholder="Descrição da personalização"
                                value={pers.descricao}
                                // onChange seria implementado em um ambiente real
                              ></textarea>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Posições Possíveis</label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {['frente', 'costas', 'lateral', 'interior'].map((pos) => (
                                  <label key={pos} className="inline-flex items-center">
                                    <input 
                                      type="checkbox" 
                                      className="form-checkbox h-4 w-4 text-primary"
                                      checked={pers.posicoesPossiveis.includes(pos)}
                                      // onChange seria implementado em um ambiente real
                                    />
                                    <span className="ml-2">{pos}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Restrições</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="Restrições da personalização"
                                value={pers.restricoes}
                                // onChange seria implementado em um ambiente real
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium mb-1">Arquivo Modelo</label>
                              <div className="flex items-center">
                                <input 
                                  type="text" 
                                  className="w-full px-3 py-2 border rounded-md"
                                  placeholder="Caminho do arquivo"
                                  value={pers.arquivoModelo}
                                  // onChange seria implementado em um ambiente real
                                />
                                <button className="ml-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200">
                                  Procurar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button 
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  onClick={() => {
                    setModoEdicao(false);
                    setProdutoSelecionado(null);
                  }}
                >
                  Cancelar
                </button>
                
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                  {produtoSelecionado ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutosModule;
