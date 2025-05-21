import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { FormSection, MaskedInput } from '../components/FormComponents';
import Toggle from '../components/Toggle';
import { supabase } from '../utils/supabase';

// Schema de validação para o formulário de pedido
const pedidoSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente é obrigatório'),
  data_pedido: z.string().min(1, 'Data do pedido é obrigatória'),
  data_entrega_prevista: z.string().min(1, 'Data de entrega prevista é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  forma_pagamento: z.string().min(1, 'Forma de pagamento é obrigatória'),
  prioridade: z.string().min(1, 'Prioridade é obrigatória'),
  observacoes: z.string().optional(),
  itens: z.array(
    z.object({
      produto_id: z.string().min(1, 'Produto é obrigatório'),
      quantidade: z.number().min(1, 'Quantidade deve ser maior que zero'),
      valor_unitario: z.number().min(0.01, 'Valor unitário deve ser maior que zero'),
      observacoes: z.string().optional()
    })
  ).min(1, 'Adicione pelo menos um item ao pedido')
});

type PedidoFormData = z.infer<typeof pedidoSchema>;

// Dados simulados para os selects
const clientes = [
  { value: '1', label: 'Maria Silva' },
  { value: '2', label: 'João Pereira' },
  { value: '3', label: 'Ana Oliveira' },
  { value: '4', label: 'Carlos Santos' },
  { value: '5', label: 'Fernanda Lima' }
];

const produtos = [
  { value: '1', label: 'Vestido Personalizado', preco: 450.00 },
  { value: '2', label: 'Conjunto Infantil', preco: 320.00 },
  { value: '3', label: 'Bolsa Artesanal', preco: 280.00 },
  { value: '4', label: 'Toalha Bordada', preco: 150.00 },
  { value: '5', label: 'Almofada Decorativa', preco: 120.00 }
];

const statusOptions = [
  { value: 'Aguardando Pagamento', label: 'Aguardando Pagamento' },
  { value: 'Em Produção', label: 'Em Produção' },
  { value: 'Concluído', label: 'Concluído' },
  { value: 'Entregue', label: 'Entregue' },
  { value: 'Cancelado', label: 'Cancelado' }
];

const formasPagamento = [
  { value: 'Cartão de Crédito', label: 'Cartão de Crédito' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Transferência', label: 'Transferência' },
  { value: 'Boleto', label: 'Boleto' }
];

const prioridades = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Baixa', label: 'Baixa' }
];

const PedidoFormPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [itens, setItens] = React.useState<Array<{
    id: string;
    produto_id: string;
    produto_nome: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    observacoes: string;
  }>>([]);
  
  const [valorTotal, setValorTotal] = React.useState(0);
  const [produtoSelecionado, setProdutoSelecionado] = React.useState('');
  const [quantidade, setQuantidade] = React.useState(1);
  const [valorUnitario, setValorUnitario] = React.useState(0);
  const [observacaoItem, setObservacaoItem] = React.useState('');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      data_pedido: new Date().toISOString().split('T')[0],
      status: 'Aguardando Pagamento',
      prioridade: 'Normal',
      itens: []
    }
  });
  
  // Atualiza o valor unitário quando o produto é selecionado
  React.useEffect(() => {
    if (produtoSelecionado) {
      const produto = produtos.find(p => p.value === produtoSelecionado);
      if (produto) {
        setValorUnitario(produto.preco);
      }
    } else {
      setValorUnitario(0);
    }
  }, [produtoSelecionado]);
  
  // Adiciona um item à lista
  const adicionarItem = () => {
    if (!produtoSelecionado || quantidade <= 0 || valorUnitario <= 0) {
      return;
    }
    
    const produto = produtos.find(p => p.value === produtoSelecionado);
    if (!produto) return;
    
    const novoItem = {
      id: Date.now().toString(),
      produto_id: produtoSelecionado,
      produto_nome: produto.label,
      quantidade,
      valor_unitario: valorUnitario,
      valor_total: quantidade * valorUnitario,
      observacoes: observacaoItem
    };
    
    const novosItens = [...itens, novoItem];
    setItens(novosItens);
    
    // Atualiza o valor total
    const novoValorTotal = novosItens.reduce((total, item) => total + item.valor_total, 0);
    setValorTotal(novoValorTotal);
    
    // Atualiza o campo itens do formulário
    setValue('itens', novosItens.map(item => ({
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      observacoes: item.observacoes
    })));
    
    // Limpa os campos
    setProdutoSelecionado('');
    setQuantidade(1);
    setValorUnitario(0);
    setObservacaoItem('');
  };
  
  // Remove um item da lista
  const removerItem = (id: string) => {
    const novosItens = itens.filter(item => item.id !== id);
    setItens(novosItens);
    
    // Atualiza o valor total
    const novoValorTotal = novosItens.reduce((total, item) => total + item.valor_total, 0);
    setValorTotal(novoValorTotal);
    
    // Atualiza o campo itens do formulário
    setValue('itens', novosItens.map(item => ({
      produto_id: item.produto_id,
      quantidade: item.quantidade,
      valor_unitario: item.valor_unitario,
      observacoes: item.observacoes
    })));
  };
  
  const onSubmit = async (data: PedidoFormData) => {
    console.log(data);
    
    try {
      // Aqui seria a integração com o Supabase
      // const { data: novoPedido, error } = await supabase
      //   .from('pedidos')
      //   .insert([{
      //     cliente_id: data.cliente_id,
      //     data_pedido: data.data_pedido,
      //     data_entrega_prevista: data.data_entrega_prevista,
      //     status: data.status,
      //     valor_total: valorTotal,
      //     forma_pagamento: data.forma_pagamento,
      //     prioridade: data.prioridade,
      //     observacoes: data.observacoes
      //   }])
      //   .select();
      
      // if (error) throw error;
      
      // const pedidoId = novoPedido[0].id;
      
      // // Inserir os itens do pedido
      // const itensParaInserir = data.itens.map(item => ({
      //   pedido_id: pedidoId,
      //   produto_id: item.produto_id,
      //   quantidade: item.quantidade,
      //   valor_unitario: item.valor_unitario,
      //   valor_total: item.quantidade * item.valor_unitario,
      //   observacoes: item.observacoes
      // }));
      
      // const { error: erroItens } = await supabase
      //   .from('itens_pedido')
      //   .insert(itensParaInserir);
      
      // if (erroItens) throw erroItens;
      
      alert('Pedido cadastrado com sucesso!');
      // Redirecionar para a lista de pedidos
      // window.location.href = '/pedidos';
    } catch (error) {
      console.error('Erro ao cadastrar pedido:', error);
      alert('Erro ao cadastrar pedido. Verifique o console para mais detalhes.');
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-text mb-6">Novo Pedido</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormSection title="Informações do Pedido">
              <Select
                label="Cliente"
                options={clientes}
                {...register('cliente_id')}
                error={errors.cliente_id?.message}
                searchable
                required
              />
              
              <Input
                label="Data do Pedido"
                type="date"
                {...register('data_pedido')}
                error={errors.data_pedido?.message}
                required
              />
              
              <Input
                label="Data de Entrega Prevista"
                type="date"
                {...register('data_entrega_prevista')}
                error={errors.data_entrega_prevista?.message}
                required
              />
              
              <Select
                label="Status"
                options={statusOptions}
                {...register('status')}
                error={errors.status?.message}
                required
              />
              
              <Select
                label="Forma de Pagamento"
                options={formasPagamento}
                {...register('forma_pagamento')}
                error={errors.forma_pagamento?.message}
                required
              />
              
              <Select
                label="Prioridade"
                options={prioridades}
                {...register('prioridade')}
                error={errors.prioridade?.message}
                required
              />
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-text mb-1">
                  Observações
                </label>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                  rows={3}
                  {...register('observacoes')}
                ></textarea>
              </div>
            </FormSection>
            
            <FormSection title="Itens do Pedido">
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="md:col-span-2">
                  <Select
                    label="Produto"
                    options={produtos}
                    value={produtoSelecionado}
                    onChange={(e) => setProdutoSelecionado(e.target.value)}
                    searchable
                  />
                </div>
                
                <div>
                  <Input
                    label="Quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    min={1}
                  />
                </div>
                
                <div>
                  <Input
                    label="Valor Unitário (R$)"
                    type="number"
                    value={valorUnitario}
                    onChange={(e) => setValorUnitario(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={adicionarItem}
                    disabled={!produtoSelecionado || quantidade <= 0 || valorUnitario <= 0}
                  >
                    Adicionar Item
                  </Button>
                </div>
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-text mb-1">
                  Observações do Item
                </label>
                <textarea
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                  rows={2}
                  value={observacaoItem}
                  onChange={(e) => setObservacaoItem(e.target.value)}
                ></textarea>
              </div>
              
              {/* Lista de itens */}
              <div className="col-span-2 mt-4">
                {itens.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    Nenhum item adicionado ao pedido
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produto
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor Unitário
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor Total
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {itens.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text">
                              {item.produto_nome}
                              {item.observacoes && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Obs: {item.observacoes}
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                              {item.quantidade}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-500">
                              {item.valor_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-text">
                              {item.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                              <button
                                type="button"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removerItem(item.id)}
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="px-4 py-3 text-right text-sm font-bold text-text">
                            Valor Total do Pedido:
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-text">
                            {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}
                
                {errors.itens && (
                  <p className="mt-2 text-sm text-red-600">{errors.itens.message}</p>
                )}
              </div>
            </FormSection>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Pedido
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PedidoFormPage;
