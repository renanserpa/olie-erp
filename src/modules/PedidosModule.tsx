import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Search, 
  ShoppingCart, Package, FileText, 
  ChevronDown, ChevronUp, AlertTriangle,
  Clock, Check, X, Paperclip, 
  CreditCard, Truck, User, Calendar
} from 'lucide-react';

// Interfaces para o módulo de Pedidos
interface Pedido {
  id: string;
  codigo: string;
  clienteId: string;
  cliente: Cliente;
  dataPedido: string;
  dataEntrega: string | null;
  status: StatusPedido;
  itens: ItemPedido[];
  valorTotal: number;
  valorFrete: number;
  formaPagamento: string;
  parcelas: number;
  observacoes: string;
  anexos: Anexo[];
  historico: HistoricoPedido[];
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
  produtoId: string;
  produto: ProdutoResumido;
  quantidade: number;
  valorUnitario: number;
  desconto: number;
  personalizacoes: PersonalizacaoItem[];
  componentesEspecificos: ComponenteEspecifico[];
  tempoProducaoEstimado: number;
  statusProducao: 'aguardando' | 'separacao' | 'corte' | 'bordado' | 'costura' | 'acabamento' | 'finalizado';
  observacoes: string;
}

interface ProdutoResumido {
  id: string;
  nome: string;
  referencia: string;
  imagemPrincipal: string;
  precoBase: number;
  tempoProducaoBase: number;
  possuiPersonalizacao: boolean;
}

interface PersonalizacaoItem {
  id: string;
  itemPedidoId: string;
  tipoPersonalizacao: string;
  nome: string;
  descricao: string;
  posicao: string;
  valorAdicional: number;
  tempoAdicional: number;
  arquivoCliente: string | null;
  arquivoProducao: string | null;
  observacoes: string;
}

interface ComponenteEspecifico {
  id: string;
  itemPedidoId: string;
  componenteId: string;
  componenteNome: string;
  insumoId: string;
  insumoNome: string;
  insumoOriginalId: string | null;
  quantidade: number;
  observacoes: string;
}

interface Anexo {
  id: string;
  pedidoId: string;
  nome: string;
  tipo: string;
  url: string;
  tamanhoKb: number;
  dataCriacao: string;
}

interface HistoricoPedido {
  id: string;
  pedidoId: string;
  data: string;
  statusAnterior: StatusPedido | null;
  statusNovo: StatusPedido | null;
  descricao: string;
  usuarioId: string;
  usuarioNome: string;
}

interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cpfCnpj: string;
  observacoes: string;
}

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
  tipo: string;
  posicao: string;
  obrigatorio: boolean;
  tempoProducaoMinutos: number;
}

interface OpcaoPersonalizacao {
  id: string;
  produtoId: string;
  tipo: string;
  nome: string;
  descricao: string;
  precoAdicional: number;
  tempoAdicionalMinutos: number;
  arquivoModelo: string;
  posicoesPossiveis: string[];
  restricoes: string;
}

interface EstoqueReserva {
  id: string;
  pedidoId: string;
  itemPedidoId: string;
  insumoId: string;
  quantidade: number;
  dataReserva: string;
  status: 'reservado' | 'consumido' | 'devolvido';
}

// Componente principal do módulo de Pedidos
const PedidosModule: React.FC = () => {
  // Estados para gerenciar os dados
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState(false);
  const [filtros, setFiltros] = useState({
    termo: '',
    status: 'todos',
    periodo: '30dias',
    cliente: '',
    prioridade: 'todos'
  });
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [reservasEstoque, setReservasEstoque] = useState<EstoqueReserva[]>([]);

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
          endereco: {
            rua: 'Rua das Flores',
            numero: '123',
            complemento: 'Apto 45',
            bairro: 'Jardim Primavera',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01234-567'
          },
          cpfCnpj: '123.456.789-00',
          observacoes: 'Cliente VIP'
        },
        {
          id: 'cli-002',
          nome: 'João Oliveira',
          email: 'joao.oliveira@email.com',
          telefone: '(11) 91234-5678',
          endereco: {
            rua: 'Avenida Principal',
            numero: '456',
            complemento: 'Casa',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '04567-890'
          },
          cpfCnpj: '987.654.321-00',
          observacoes: ''
        },
        {
          id: 'cli-003',
          nome: 'Ana Pereira',
          email: 'ana.pereira@email.com',
          telefone: '(11) 97777-8888',
          endereco: {
            rua: 'Rua do Comércio',
            numero: '789',
            complemento: 'Sala 12',
            bairro: 'Vila Nova',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '05678-901'
          },
          cpfCnpj: '456.789.123-00',
          observacoes: 'Prefere entrega no período da tarde'
        }
      ];

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

      // Gerar pedidos simulados
      const pedidosSimulados: Pedido[] = [];
      const statusOptions: StatusPedido[] = ['novo', 'analise', 'aprovado', 'producao', 'pronto', 'enviado', 'entregue', 'cancelado'];
      const prioridadeOptions = ['baixa', 'normal', 'alta', 'urgente'];
      
      // Gerar 10 pedidos aleatórios
      for (let i = 1; i <= 10; i++) {
        const cliente = clientesSimulados[Math.floor(Math.random() * clientesSimulados.length)];
        const dataPedido = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
        const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        const prioridade = prioridadeOptions[Math.floor(Math.random() * prioridadeOptions.length)] as 'baixa' | 'normal' | 'alta' | 'urgente';
        
        // Gerar itens do pedido
        const itens: ItemPedido[] = [];
        const numItens = Math.floor(Math.random() * 3) + 1; // 1 a 3 itens por pedido
        
        for (let j = 0; j < numItens; j++) {
          const produto = produtosSimulados[Math.floor(Math.random() * produtosSimulados.length)];
          const quantidade = Math.floor(Math.random() * 3) + 1; // 1 a 3 unidades
          const valorUnitario = produto.precoBase;
          const desconto = Math.random() > 0.7 ? Math.floor(Math.random() * 10) + 5 : 0; // 0% ou 5-15% de desconto
          
          // Personalizações do item
          const personalizacoes: PersonalizacaoItem[] = [];
          if (produto.possuiPersonalizacao && Math.random() > 0.3) {
            const opcaoPersonalizacao = produto.personalizacoes[Math.floor(Math.random() * produto.personalizacoes.length)];
            personalizacoes.push({
              id: `pers-item-${i}-${j}-1`,
              itemPedidoId: `item-${i}-${j}`,
              tipoPersonalizacao: opcaoPersonalizacao.tipo,
              nome: opcaoPersonalizacao.nome,
              descricao: `${opcaoPersonalizacao.descricao} - Personalização para cliente ${cliente.nome}`,
              posicao: opcaoPersonalizacao.posicoesPossiveis[0],
              valorAdicional: opcaoPersonalizacao.precoAdicional,
              tempoAdicional: opcaoPersonalizacao.tempoAdicionalMinutos,
              arquivoCliente: Math.random() > 0.5 ? `/assets/uploads/cliente-${i}-${j}.jpg` : null,
              arquivoProducao: Math.random() > 0.7 ? `/assets/producao/arquivo-${i}-${j}.dst` : null,
              observacoes: Math.random() > 0.7 ? 'Verificar posicionamento com cliente' : ''
            });
          }
          
          // Componentes específicos (alterações na composição padrão)
          const componentesEspecificos: ComponenteEspecifico[] = [];
          if (Math.random() > 0.7) {
            const componente = produto.composicao[Math.floor(Math.random() * produto.composicao.length)];
            componentesEspecificos.push({
              id: `comp-esp-${i}-${j}-1`,
              itemPedidoId: `item-${i}-${j}`,
              componenteId: componente.id,
              componenteNome: componente.tipo,
              insumoId: `ins-alt-${Math.floor(Math.random() * 10) + 1}`,
              insumoNome: `${componente.insumoNome} (Alternativo)`,
              insumoOriginalId: componente.insumoId,
              quantidade: componente.quantidade,
              observacoes: 'Substituição solicitada pelo cliente'
            });
          }
          
          // Status de produção baseado no status do pedido
          let statusProducao: 'aguardando' | 'separacao' | 'corte' | 'bordado' | 'costura' | 'acabamento' | 'finalizado' = 'aguardando';
          if (status === 'producao') {
            const statusProducaoOptions = ['separacao', 'corte', 'bordado', 'costura', 'acabamento'];
            statusProducao = statusProducaoOptions[Math.floor(Math.random() * statusProducaoOptions.length)] as any;
          } else if (status === 'pronto' || status === 'enviado' || status === 'entregue') {
            statusProducao = 'finalizado';
          }
          
          // Tempo de produção estimado
          const tempoBase = produto.composicao.reduce((total, comp) => total + comp.tempoProducaoMinutos, 0);
          const tempoPersonalizacoes = personalizacoes.reduce((total, pers) => total + pers.tempoAdicional, 0);
          const tempoProducaoEstimado = tempoBase + tempoPersonalizacoes;
          
          itens.push({
            id: `item-${i}-${j}`,
            pedidoId: `ped-${i.toString().padStart(3, '0')}`,
            produtoId: produto.id,
            produto: {
              id: produto.id,
              nome: produto.nome,
              referencia: produto.referencia,
              imagemPrincipal: produto.imagemPrincipal,
              precoBase: produto.precoBase,
              tempoProducaoBase: tempoBase,
              possuiPersonalizacao: produto.possuiPersonalizacao
            },
            quantidade,
            valorUnitario,
            desconto,
            personalizacoes,
            componentesEspecificos,
            tempoProducaoEstimado,
            statusProducao,
            observacoes: Math.random() > 0.8 ? 'Verificar detalhes com cliente antes de produzir' : ''
          });
        }
        
        // Calcular valor total
        const valorItens = itens.reduce((total, item) => {
          const valorItem = item.quantidade * (item.valorUnitario - item.desconto);
          const valorPersonalizacoes = item.personalizacoes.reduce((t, p) => t + p.valorAdicional, 0) * item.quantidade;
          return total + valorItem + valorPersonalizacoes;
        }, 0);
        
        const valorFrete = Math.floor(Math.random() * 30) + 10; // Frete entre 10 e 40 reais
        const valorTotal = valorItens + valorFrete;
        
        // Gerar histórico do pedido
        const historico: HistoricoPedido[] = [];
        const dataBase = new Date(dataPedido);
        
        // Sempre adiciona o registro de criação
        historico.push({
          id: `hist-${i}-1`,
          pedidoId: `ped-${i.toString().padStart(3, '0')}`,
          data: dataBase.toISOString(),
          statusAnterior: null,
          statusNovo: 'novo',
          descricao: 'Pedido criado',
          usuarioId: 'usr-001',
          usuarioNome: 'Sistema'
        });
        
        // Adicionar histórico baseado no status atual
        const statusIndex = statusOptions.indexOf(status);
        for (let k = 1; k <= statusIndex; k++) {
          const diasDepois = Math.floor(Math.random() * 3) + 1; // 1 a 3 dias entre mudanças de status
          dataBase.setDate(dataBase.getDate() + diasDepois);
          
          historico.push({
            id: `hist-${i}-${k+1}`,
            pedidoId: `ped-${i.toString().padStart(3, '0')}`,
            data: new Date(dataBase).toISOString(),
            statusAnterior: statusOptions[k-1],
            statusNovo: statusOptions[k],
            descricao: `Status alterado para ${statusOptions[k]}`,
            usuarioId: 'usr-001',
            usuarioNome: 'Sistema'
          });
        }
        
        // Ordenar histórico por data
        historico.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
        
        // Calcular data de entrega (se aplicável)
        let dataEntrega = null;
        if (status === 'aprovado' || status === 'producao') {
          const diasParaEntrega = Math.floor(Math.random() * 15) + 5; // 5 a 20 dias para entrega
          const dataEntregaObj = new Date(dataPedido);
          dataEntregaObj.setDate(dataEntregaObj.getDate() + diasParaEntrega);
          dataEntrega = dataEntregaObj.toISOString();
        } else if (status === 'pronto' || status === 'enviado' || status === 'entregue') {
          const ultimoHistorico = historico[historico.length - 1];
          dataEntrega = ultimoHistorico.data;
        }
        
        // Anexos do pedido
        const anexos: Anexo[] = [];
        if (Math.random() > 0.5) {
          anexos.push({
            id: `anx-${i}-1`,
            pedidoId: `ped-${i.toString().padStart(3, '0')}`,
            nome: 'Comprovante de pagamento',
            tipo: 'pdf',
            url: `/assets/anexos/comprovante-${i}.pdf`,
            tamanhoKb: Math.floor(Math.random() * 1000) + 100,
            dataCriacao: dataPedido.toISOString()
          });
        }
        
        if (Math.random() > 0.7) {
          anexos.push({
            id: `anx-${i}-2`,
            pedidoId: `ped-${i.toString().padStart(3, '0')}`,
            nome: 'Referência de personalização',
            tipo: 'jpg',
            url: `/assets/anexos/referencia-${i}.jpg`,
            tamanhoKb: Math.floor(Math.random() * 2000) + 500,
            dataCriacao: dataPedido.toISOString()
          });
        }
        
        // Adicionar pedido à lista
        pedidosSimulados.push({
          id: `ped-${i.toString().padStart(3, '0')}`,
          codigo: `P${new Date().getFullYear()}${i.toString().padStart(4, '0')}`,
          clienteId: cliente.id,
          cliente,
          dataPedido: dataPedido.toISOString(),
          dataEntrega,
          status,
          itens,
          valorTotal,
          valorFrete,
          formaPagamento: Math.random() > 0.5 ? 'Cartão de Crédito' : 'Pix',
          parcelas: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 2 : 1,
          observacoes: Math.random() > 0.7 ? 'Entregar em horário comercial' : '',
          anexos,
          historico,
          prioridade
        });
      }
      
      // Ordenar pedidos por data (mais recentes primeiro)
      pedidosSimulados.sort((a, b) => new Date(b.dataPedido).getTime() - new Date(a.dataPedido).getTime());
      
      // Gerar reservas de estoque para pedidos em produção
      const reservasEstoqueSimuladas: EstoqueReserva[] = [];
      
      pedidosSimulados.forEach(pedido => {
        if (pedido.status === 'aprovado' || pedido.status === 'producao') {
          pedido.itens.forEach(item => {
            const produto = produtosSimulados.find(p => p.id === item.produtoId);
            if (produto) {
              produto.composicao.forEach(comp => {
                // Verificar se há componente específico que substitui este
                const componenteEspecifico = item.componentesEspecificos.find(ce => ce.componenteId === comp.id);
                const insumoId = componenteEspecifico ? componenteEspecifico.insumoId : comp.insumoId;
                
                reservasEstoqueSimuladas.push({
                  id: `res-${pedido.id}-${item.id}-${comp.id}`,
                  pedidoId: pedido.id,
                  itemPedidoId: item.id,
                  insumoId,
                  quantidade: comp.quantidade * item.quantidade,
                  dataReserva: pedido.dataPedido,
                  status: item.statusProducao === 'finalizado' ? 'consumido' : 'reservado'
                });
              });
            }
          });
        }
      });

      setClientes(clientesSimulados);
      setProdutos(produtosSimulados);
      setPedidos(pedidosSimulados);
      setReservasEstoque(reservasEstoqueSimuladas);
    };

    carregarDados();
  }, []);

  // Função para filtrar pedidos
  const pedidosFiltrados = pedidos.filter(pedido => {
    const matchTermo = pedido.codigo.toLowerCase().includes(filtros.termo.toLowerCase()) || 
                      pedido.cliente.nome.toLowerCase().includes(filtros.termo.toLowerCase());
    
    const matchStatus = filtros.status === 'todos' || pedido.status === filtros.status;
    
    // Filtro de período
    const dataAtual = new Date();
    const dataPedido = new Date(pedido.dataPedido);
    let matchPeriodo = true;
    
    if (filtros.periodo === '7dias') {
      const dataLimite = new Date(dataAtual);
      dataLimite.setDate(dataLimite.getDate() - 7);
      matchPeriodo = dataPedido >= dataLimite;
    } else if (filtros.periodo === '30dias') {
      const dataLimite = new Date(dataAtual);
      dataLimite.setDate(dataLimite.getDate() - 30);
      matchPeriodo = dataPedido >= dataLimite;
    } else if (filtros.periodo === '90dias') {
      const dataLimite = new Date(dataAtual);
      dataLimite.setDate(dataLimite.getDate() - 90);
      matchPeriodo = dataPedido >= dataLimite;
    }
    
    const matchCliente = filtros.cliente === '' || pedido.clienteId === filtros.cliente;
    
    const matchPrioridade = filtros.prioridade === 'todos' || pedido.prioridade === filtros.prioridade;
    
    return matchTermo && matchStatus && matchPeriodo && matchCliente && matchPrioridade;
  });

  // Função para formatar data
  const formatarData = (dataString: string | null): string => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Função para calcular tempo total de produção de um pedido
  const calcularTempoTotalProducao = (pedido: Pedido): number => {
    return pedido.itens.reduce((total, item) => {
      return total + (item.tempoProducaoEstimado * item.quantidade);
    }, 0);
  };

  // Função para obter cor de status
  const getCorStatus = (status: StatusPedido): string => {
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

  // Função para verificar disponibilidade de insumos
  const verificarDisponibilidadeInsumos = (pedido: Pedido): boolean => {
    // Em um ambiente real, isso verificaria o estoque atual
    // Para simulação, retornamos um valor aleatório
    return Math.random() > 0.2; // 80% de chance de ter disponibilidade
  };

  // Função para atualizar status do pedido
  const atualizarStatusPedido = (pedido: Pedido, novoStatus: StatusPedido) => {
    // Em um ambiente real, isso seria uma chamada à API
    const novoHistorico: HistoricoPedido = {
      id: `hist-${Date.now()}`,
      pedidoId: pedido.id,
      data: new Date().toISOString(),
      statusAnterior: pedido.status,
      statusNovo: novoStatus,
      descricao: `Status alterado para ${novoStatus}`,
      usuarioId: 'usr-001',
      usuarioNome: 'Usuário Atual'
    };

    // Atualizar pedido
    setPedidos(prev => prev.map(p => {
      if (p.id === pedido.id) {
        return {
          ...p,
          status: novoStatus,
          historico: [...p.historico, novoHistorico]
        };
      }
      return p;
    }));

    // Atualizar reservas de estoque se necessário
    if (novoStatus === 'aprovado') {
      // Criar reservas de estoque para os insumos
      const novasReservas: EstoqueReserva[] = [];
      
      pedido.itens.forEach(item => {
        const produto = produtos.find(p => p.id === item.produtoId);
        if (produto) {
          produto.composicao.forEach(comp => {
            // Verificar se há componente específico que substitui este
            const componenteEspecifico = item.componentesEspecificos.find(ce => ce.componenteId === comp.id);
            const insumoId = componenteEspecifico ? componenteEspecifico.insumoId : comp.insumoId;
            
            novasReservas.push({
              id: `res-${pedido.id}-${item.id}-${comp.id}-${Date.now()}`,
              pedidoId: pedido.id,
              itemPedidoId: item.id,
              insumoId,
              quantidade: comp.quantidade * item.quantidade,
              dataReserva: new Date().toISOString(),
              status: 'reservado'
            });
          });
        }
      });
      
      setReservasEstoque(prev => [...prev, ...novasReservas]);
    } else if (novoStatus === 'cancelado') {
      // Liberar reservas de estoque
      setReservasEstoque(prev => prev.map(reserva => {
        if (reserva.pedidoId === pedido.id && reserva.status === 'reservado') {
          return {
            ...reserva,
            status: 'devolvido'
          };
        }
        return reserva;
      }));
    } else if (novoStatus === 'entregue') {
      // Marcar reservas como consumidas
      setReservasEstoque(prev => prev.map(reserva => {
        if (reserva.pedidoId === pedido.id && reserva.status === 'reservado') {
          return {
            ...reserva,
            status: 'consumido'
          };
        }
        return reserva;
      }));
    }
  };

  // Renderização do componente
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pedidos</h1>
          <p className="text-gray-600">Gerencie os pedidos do ateliê</p>
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
              setPedidoSelecionado(null);
              setModoEdicao(true);
            }}
          >
            <Plus size={16} className="mr-1" />
            Novo Pedido
          </button>
        </div>
      </div>
      
      {mostrarFiltros && (
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <div className="relative">
                <input 
                  type="text" 
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="Código ou cliente"
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
                <option value="novo">Novo</option>
                <option value="analise">Em Análise</option>
                <option value="aprovado">Aprovado</option>
                <option value="producao">Em Produção</option>
                <option value="pronto">Pronto</option>
                <option value="enviado">Enviado</option>
                <option value="entregue">Entregue</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Período</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.periodo}
                onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
              >
                <option value="7dias">Últimos 7 dias</option>
                <option value="30dias">Últimos 30 dias</option>
                <option value="90dias">Últimos 90 dias</option>
                <option value="todos">Todos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cliente</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.cliente}
                onChange={(e) => setFiltros({...filtros, cliente: e.target.value})}
              >
                <option value="">Todos</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prioridade</label>
              <select 
                className="w-full px-3 py-2 border rounded-md"
                value={filtros.prioridade}
                onChange={(e) => setFiltros({...filtros, prioridade: e.target.value as any})}
              >
                <option value="todos">Todas</option>
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <button 
              className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 mr-2"
              onClick={() => setFiltros({termo: '', status: 'todos', periodo: '30dias', cliente: '', prioridade: 'todos'})}
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
                Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioridade
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tempo Produção
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pedidosFiltrados.map(pedido => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{pedido.codigo}</div>
                  <div className="text-sm text-gray-500">{pedido.itens.length} {pedido.itens.length === 1 ? 'item' : 'itens'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{pedido.cliente.nome}</div>
                  <div className="text-sm text-gray-500">{pedido.cliente.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatarData(pedido.dataPedido)}</div>
                  {pedido.dataEntrega && (
                    <div className="text-sm text-gray-500">
                      Entrega: {formatarData(pedido.dataEntrega)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {pedido.valorTotal.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(pedido.status)}`}>
                    {pedido.status === 'novo' && 'Novo'}
                    {pedido.status === 'analise' && 'Em Análise'}
                    {pedido.status === 'aprovado' && 'Aprovado'}
                    {pedido.status === 'producao' && 'Em Produção'}
                    {pedido.status === 'pronto' && 'Pronto'}
                    {pedido.status === 'enviado' && 'Enviado'}
                    {pedido.status === 'entregue' && 'Entregue'}
                    {pedido.status === 'cancelado' && 'Cancelado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorPrioridade(pedido.prioridade)}`}>
                    {pedido.prioridade === 'baixa' && 'Baixa'}
                    {pedido.prioridade === 'normal' && 'Normal'}
                    {pedido.prioridade === 'alta' && 'Alta'}
                    {pedido.prioridade === 'urgente' && 'Urgente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {calcularTempoTotalProducao(pedido)} min
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                    onClick={() => {
                      setPedidoSelecionado(pedido);
                      setModoVisualizacao(true);
                    }}
                  >
                    Detalhes
                  </button>
                  <button 
                    className="text-green-600 hover:text-green-900"
                    onClick={() => {
                      setPedidoSelecionado(pedido);
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
      
      {/* Modal de Visualização de Pedido */}
      {modoVisualizacao && pedidoSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Pedido {pedidoSelecionado.codigo}</h2>
                  <p className="text-gray-600">
                    {formatarData(pedidoSelecionado.dataPedido)} - 
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorStatus(pedidoSelecionado.status)}`}>
                      {pedidoSelecionado.status === 'novo' && 'Novo'}
                      {pedidoSelecionado.status === 'analise' && 'Em Análise'}
                      {pedidoSelecionado.status === 'aprovado' && 'Aprovado'}
                      {pedidoSelecionado.status === 'producao' && 'Em Produção'}
                      {pedidoSelecionado.status === 'pronto' && 'Pronto'}
                      {pedidoSelecionado.status === 'enviado' && 'Enviado'}
                      {pedidoSelecionado.status === 'entregue' && 'Entregue'}
                      {pedidoSelecionado.status === 'cancelado' && 'Cancelado'}
                    </span>
                  </p>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setModoVisualizacao(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações do Cliente</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="font-medium">{pedidoSelecionado.cliente.nome}</p>
                    <p>{pedidoSelecionado.cliente.email}</p>
                    <p>{pedidoSelecionado.cliente.telefone}</p>
                    <p className="mt-2">
                      {pedidoSelecionado.cliente.endereco.rua}, {pedidoSelecionado.cliente.endereco.numero}
                      {pedidoSelecionado.cliente.endereco.complemento && ` - ${pedidoSelecionado.cliente.endereco.complemento}`}
                    </p>
                    <p>
                      {pedidoSelecionado.cliente.endereco.bairro}, {pedidoSelecionado.cliente.endereco.cidade} - {pedidoSelecionado.cliente.endereco.estado}
                    </p>
                    <p>{pedidoSelecionado.cliente.endereco.cep}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Informações do Pedido</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between mb-1">
                      <span>Data do Pedido:</span>
                      <span>{formatarData(pedidoSelecionado.dataPedido)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Previsão de Entrega:</span>
                      <span>{formatarData(pedidoSelecionado.dataEntrega)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Forma de Pagamento:</span>
                      <span>{pedidoSelecionado.formaPagamento}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Parcelas:</span>
                      <span>{pedidoSelecionado.parcelas}x</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Prioridade:</span>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCorPrioridade(pedidoSelecionado.prioridade)}`}>
                        {pedidoSelecionado.prioridade === 'baixa' && 'Baixa'}
                        {pedidoSelecionado.prioridade === 'normal' && 'Normal'}
                        {pedidoSelecionado.prioridade === 'alta' && 'Alta'}
                        {pedidoSelecionado.prioridade === 'urgente' && 'Urgente'}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Tempo Total de Produção:</span>
                      <span>{calcularTempoTotalProducao(pedidoSelecionado)} minutos</span>
                    </div>
                    <div className="flex justify-between font-semibold mt-2">
                      <span>Valor Total:</span>
                      <span>R$ {pedidoSelecionado.valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Itens do Pedido</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                {pedidoSelecionado.itens.map((item, index) => (
                  <div key={item.id} className={`${index > 0 ? 'border-t border-gray-200 pt-4 mt-4' : ''}`}>
                    <div className="flex items-start">
                      <div className="h-16 w-16 flex-shrink-0 mr-4">
                        <img 
                          className="h-16 w-16 rounded-md object-cover" 
                          src={item.produto.imagemPrincipal || '/assets/placeholder.jpg'} 
                          alt={item.produto.nome} 
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{item.produto.nome}</p>
                            <p className="text-sm text-gray-500">Ref: {item.produto.referencia}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">R$ {(item.valorUnitario * item.quantidade).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">{item.quantidade} x R$ {item.valorUnitario.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        {/* Status de produção */}
                        <div className="mt-2">
                          <span className="text-sm text-gray-600 mr-2">Status de Produção:</span>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {item.statusProducao === 'aguardando' && 'Aguardando'}
                            {item.statusProducao === 'separacao' && 'Separação'}
                            {item.statusProducao === 'corte' && 'Corte'}
                            {item.statusProducao === 'bordado' && 'Bordado'}
                            {item.statusProducao === 'costura' && 'Costura'}
                            {item.statusProducao === 'acabamento' && 'Acabamento'}
                            {item.statusProducao === 'finalizado' && 'Finalizado'}
                          </span>
                        </div>
                        
                        {/* Personalizações */}
                        {item.personalizacoes.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Personalizações:</p>
                            {item.personalizacoes.map(pers => (
                              <div key={pers.id} className="ml-2 text-sm">
                                <p>
                                  <span className="font-medium">{pers.nome}</span> - 
                                  <span className="text-gray-600"> {pers.descricao}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                  Posição: {pers.posicao} | 
                                  Valor: R$ {pers.valorAdicional.toFixed(2)} | 
                                  Tempo: {pers.tempoAdicional} min
                                </p>
                                {pers.arquivoCliente && (
                                  <p className="text-xs text-blue-600 flex items-center mt-1">
                                    <Paperclip size={12} className="mr-1" />
                                    Arquivo do cliente anexado
                                  </p>
                                )}
                                {pers.arquivoProducao && (
                                  <p className="text-xs text-green-600 flex items-center mt-1">
                                    <Paperclip size={12} className="mr-1" />
                                    Arquivo de produção disponível
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Componentes específicos */}
                        {item.componentesEspecificos.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Materiais específicos:</p>
                            {item.componentesEspecificos.map(comp => (
                              <div key={comp.id} className="ml-2 text-sm">
                                <p>
                                  <span className="font-medium">{comp.componenteNome}</span>: 
                                  <span className="text-gray-600"> {comp.insumoNome}</span>
                                </p>
                                {comp.observacoes && (
                                  <p className="text-xs text-gray-500">{comp.observacoes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Observações do item */}
                        {item.observacoes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Observações:</p>
                            <p className="text-sm text-gray-600 ml-2">{item.observacoes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Anexos */}
              {pedidoSelecionado.anexos.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Anexos</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {pedidoSelecionado.anexos.map(anexo => (
                      <div key={anexo.id} className="flex items-center mb-2 last:mb-0">
                        <Paperclip size={16} className="mr-2 text-gray-500" />
                        <div>
                          <p className="font-medium">{anexo.nome}</p>
                          <p className="text-xs text-gray-500">
                            {anexo.tipo.toUpperCase()} - {(anexo.tamanhoKb / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button className="ml-auto text-blue-600 hover:text-blue-800 text-sm">
                          Visualizar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Histórico */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Histórico</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {pedidoSelecionado.historico.map(hist => (
                    <div key={hist.id} className="mb-3 last:mb-0">
                      <div className="flex justify-between">
                        <p className="font-medium">{hist.descricao}</p>
                        <p className="text-sm text-gray-500">{formatarData(hist.data)}</p>
                      </div>
                      <p className="text-sm text-gray-600">Por: {hist.usuarioNome}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Ações */}
              <div className="flex justify-between">
                <div>
                  {pedidoSelecionado.status !== 'cancelado' && (
                    <button 
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                      onClick={() => {
                        if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
                          atualizarStatusPedido(pedidoSelecionado, 'cancelado');
                          setModoVisualizacao(false);
                        }
                      }}
                    >
                      Cancelar Pedido
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  {/* Botões de transição de status */}
                  {pedidoSelecionado.status === 'novo' && (
                    <button 
                      className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado, 'analise');
                        setModoVisualizacao(false);
                      }}
                    >
                      Iniciar Análise
                    </button>
                  )}
                  
                  {pedidoSelecionado.status === 'analise' && (
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      onClick={() => {
                        if (verificarDisponibilidadeInsumos(pedidoSelecionado)) {
                          atualizarStatusPedido(pedidoSelecionado, 'aprovado');
                          setModoVisualizacao(false);
                        } else {
                          alert('Não há insumos suficientes em estoque para este pedido.');
                        }
                      }}
                    >
                      Aprovar Pedido
                    </button>
                  )}
                  
                  {pedidoSelecionado.status === 'aprovado' && (
                    <button 
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado, 'producao');
                        setModoVisualizacao(false);
                      }}
                    >
                      Iniciar Produção
                    </button>
                  )}
                  
                  {pedidoSelecionado.status === 'producao' && (
                    <button 
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado, 'pronto');
                        setModoVisualizacao(false);
                      }}
                    >
                      Marcar como Pronto
                    </button>
                  )}
                  
                  {pedidoSelecionado.status === 'pronto' && (
                    <button 
                      className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado, 'enviado');
                        setModoVisualizacao(false);
                      }}
                    >
                      Marcar como Enviado
                    </button>
                  )}
                  
                  {pedidoSelecionado.status === 'enviado' && (
                    <button 
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      onClick={() => {
                        atualizarStatusPedido(pedidoSelecionado, 'entregue');
                        setModoVisualizacao(false);
                      }}
                    >
                      Confirmar Entrega
                    </button>
                  )}
                  
                  <button 
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    onClick={() => setModoVisualizacao(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Edição/Criação de Pedido seria implementado aqui */}
      {/* Por questões de complexidade, não está sendo incluído neste exemplo */}
      {modoEdicao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {pedidoSelecionado ? `Editar Pedido ${pedidoSelecionado.codigo}` : 'Novo Pedido'}
                  </h2>
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setModoEdicao(false)}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  O formulário completo de criação/edição de pedidos seria implementado aqui.
                </p>
                <p className="text-gray-600">
                  Devido à complexidade, este exemplo mostra apenas a visualização de pedidos.
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

export default PedidosModule;
