import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Tag, Edit, Trash2, FileText, Image, BarChart2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

// Tipos de dados
interface Produto {
  id: number;
  nome: string;
  codigo: string;
  categoria_id: number;
  descricao?: string;
  preco_venda: number;
  custo_producao?: number;
  tempo_producao?: number;
  estoque_minimo?: number;
  estoque_atual: number;
  status: 'ativo' | 'inativo' | 'descontinuado';
  imagem_url?: string;
  
  // Dados relacionados
  categoria?: {
    nome: string;
  };
}

const ProdutosPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    categoria: '',
    status: '',
    estoque: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  
  // Buscar produtos
  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const produtosSimulados: Produto[] = [
          {
            id: 1,
            nome: 'Bolsa Personalizada',
            codigo: 'BP-001',
            categoria_id: 1,
            descricao: 'Bolsa personalizada com bordado',
            preco_venda: 150.00,
            custo_producao: 75.00,
            tempo_producao: 120, // minutos
            estoque_minimo: 5,
            estoque_atual: 12,
            status: 'ativo',
            imagem_url: 'https://example.com/bolsa.jpg',
            categoria: { nome: 'Bolsas' }
          },
          {
            id: 2,
            nome: 'Necessaire Floral',
            codigo: 'NF-002',
            categoria_id: 2,
            descricao: 'Necessaire com estampa floral',
            preco_venda: 45.00,
            custo_producao: 20.00,
            tempo_producao: 60, // minutos
            estoque_minimo: 10,
            estoque_atual: 8,
            status: 'ativo',
            imagem_url: 'https://example.com/necessaire.jpg',
            categoria: { nome: 'Necessaires' }
          },
          {
            id: 3,
            nome: 'Mochila Infantil',
            codigo: 'MI-003',
            categoria_id: 3,
            descricao: 'Mochila infantil com tema de animais',
            preco_venda: 120.00,
            custo_producao: 60.00,
            tempo_producao: 180, // minutos
            estoque_minimo: 3,
            estoque_atual: 2,
            status: 'ativo',
            imagem_url: 'https://example.com/mochila.jpg',
            categoria: { nome: 'Mochilas' }
          },
          {
            id: 4,
            nome: 'Bolsa Térmica',
            codigo: 'BT-004',
            categoria_id: 1,
            descricao: 'Bolsa térmica para alimentos',
            preco_venda: 85.00,
            custo_producao: 40.00,
            tempo_producao: 90, // minutos
            estoque_minimo: 8,
            estoque_atual: 0,
            status: 'ativo',
            imagem_url: 'https://example.com/bolsa-termica.jpg',
            categoria: { nome: 'Bolsas' }
          },
          {
            id: 5,
            nome: 'Porta Documentos',
            codigo: 'PD-005',
            categoria_id: 4,
            descricao: 'Porta documentos de viagem',
            preco_venda: 65.00,
            custo_producao: 30.00,
            tempo_producao: 75, // minutos
            estoque_minimo: 5,
            estoque_atual: 7,
            status: 'ativo',
            imagem_url: 'https://example.com/porta-documentos.jpg',
            categoria: { nome: 'Acessórios' }
          },
          {
            id: 6,
            nome: 'Estojo Escolar',
            codigo: 'EE-006',
            categoria_id: 5,
            descricao: 'Estojo escolar com divisórias',
            preco_venda: 35.00,
            custo_producao: 15.00,
            tempo_producao: 45, // minutos
            estoque_minimo: 15,
            estoque_atual: 20,
            status: 'ativo',
            imagem_url: 'https://example.com/estojo.jpg',
            categoria: { nome: 'Escolar' }
          },
          {
            id: 7,
            nome: 'Bolsa de Praia',
            codigo: 'BP-007',
            categoria_id: 1,
            descricao: 'Bolsa de praia com estampa tropical',
            preco_venda: 95.00,
            custo_producao: 45.00,
            tempo_producao: 100, // minutos
            estoque_minimo: 5,
            estoque_atual: 3,
            status: 'ativo',
            imagem_url: 'https://example.com/bolsa-praia.jpg',
            categoria: { nome: 'Bolsas' }
          },
          {
            id: 8,
            nome: 'Kit Máscara e Necessaire',
            codigo: 'KM-008',
            categoria_id: 2,
            descricao: 'Kit com máscara de proteção e necessaire',
            preco_venda: 55.00,
            custo_producao: 25.00,
            tempo_producao: 80, // minutos
            estoque_minimo: 10,
            estoque_atual: 0,
            status: 'inativo',
            imagem_url: 'https://example.com/kit-mascara.jpg',
            categoria: { nome: 'Necessaires' }
          }
        ];
        
        setProdutos(produtosSimulados);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProdutos();
  }, []);
  
  // Filtrar produtos
  const produtosFiltered = produtos.filter(produto => {
    // Filtro por categoria
    if (filtro.categoria && produto.categoria_id.toString() !== filtro.categoria) {
      return false;
    }
    
    // Filtro por status
    if (filtro.status && produto.status !== filtro.status) {
      return false;
    }
    
    // Filtro por estoque
      if (filtro.estoque) {
        if (filtro.estoque === 'sem_estoque' && produto.estoque_atual > 0) {
          return false;
        } else if (
          filtro.estoque === 'estoque_baixo' &&
          (produto.estoque_atual >= (produto.estoque_minimo ?? 0) || produto.estoque_atual === 0)
        ) {
          return false;
        } else if (
          filtro.estoque === 'estoque_ok' &&
          (produto.estoque_atual < (produto.estoque_minimo ?? 0) || produto.estoque_atual === 0)
        ) {
          return false;
        }
      }
    
    // Filtro por busca (nome, código ou descrição)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const nomeMatch = produto.nome.toLowerCase().includes(termoBusca);
      const codigoMatch = produto.codigo.toLowerCase().includes(termoBusca);
      const descricaoMatch = produto.descricao?.toLowerCase().includes(termoBusca);
      
      if (!nomeMatch && !codigoMatch && !descricaoMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Formatar valor
  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };
  
  // Formatar tempo
  const formatarTempo = (minutos?: number) => {
    if (!minutos) return '-';
    
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${min}min`;
    }
    
    return `${min}min`;
  };
  
  // Atualizar status do produto
  const atualizarStatus = async (id: number, novoStatus: Produto['status']) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('produtos')
      //   .update({ status: novoStatus })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const produtosAtualizados = produtos.map(p => 
        p.id === id ? { ...p, status: novoStatus } : p
      );
      
      setProdutos(produtosAtualizados);
      
      console.log(`Produto ${id} atualizado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status do produto:', error);
    }
  };
  
  // Excluir produto
  const excluirProduto = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('produtos')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const produtosAtualizados = produtos.filter(p => p.id !== id);
      
      setProdutos(produtosAtualizados);
      
      console.log(`Produto ${id} excluído`);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Produtos</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar nome, código ou descrição..."
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
                Novo Produto
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <option value="1">Bolsas</option>
                    <option value="2">Necessaires</option>
                    <option value="3">Mochilas</option>
                    <option value="4">Acessórios</option>
                    <option value="5">Escolar</option>
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
                    <option value="descontinuado">Descontinuado</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estoque
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.estoque}
                    onChange={(e) => setFiltro(prev => ({ ...prev, estoque: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="sem_estoque">Sem estoque</option>
                    <option value="estoque_baixo">Estoque baixo</option>
                    <option value="estoque_ok">Estoque OK</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ categoria: '', status: '', estoque: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando produtos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltered.length === 0 ? (
              <div className="col-span-full bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                Nenhum produto encontrado
              </div>
            ) : (
              produtosFiltered.map((produto) => (
                <div key={produto.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 relative">
                    {produto.imagem_url ? (
                      <img 
                        src={produto.imagem_url} 
                        alt={produto.nome} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={48} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        produto.status === 'ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : produto.status === 'inativo'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {produto.status === 'ativo' ? 'Ativo' : produto.status === 'inativo' ? 'Inativo' : 'Descontinuado'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate" title={produto.nome}>
                          {produto.nome}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 truncate" title={produto.codigo}>
                          Código: {produto.codigo}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {produto.categoria?.nome}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Preço de Venda</p>
                        <p className="text-sm font-medium text-gray-900">{formatarValor(produto.preco_venda)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Custo de Produção</p>
                        <p className="text-sm font-medium text-gray-900">{produto.custo_producao ? formatarValor(produto.custo_producao) : '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tempo de Produção</p>
                        <p className="text-sm font-medium text-gray-900">{formatarTempo(produto.tempo_producao)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estoque Atual</p>
                        <p className={`text-sm font-medium ${
                          produto.estoque_atual === 0
                            ? 'text-red-600'
                            : produto.estoque_atual < (produto.estoque_minimo || 0)
                              ? 'text-yellow-600'
                              : 'text-green-600'
                        }`}>
                          {produto.estoque_atual} {produto.estoque_minimo && produto.estoque_atual < produto.estoque_minimo && '(Baixo)'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between">
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
                        <button
                          className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                          title="Estatísticas"
                        >
                          <BarChart2 size={14} />
                        </button>
                      </div>
                      
                      <div className="flex space-x-2">
                        {produto.status !== 'ativo' ? (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            onClick={() => atualizarStatus(produto.id, 'ativo')}
                            title="Ativar"
                          >
                            Ativar
                          </button>
                        ) : (
                          <button
                            className="inline-flex items-center px-2 py-1 border border-yellow-300 rounded-md text-xs font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            onClick={() => atualizarStatus(produto.id, 'inativo')}
                            title="Inativar"
                          >
                            Inativar
                          </button>
                        )}
                        
                        <button
                          className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
                              excluirProduto(produto.id);
                            }
                          }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProdutosPage;
