import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lhnfftajaanimavszbnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobmZmdGFqYWFuaW1hdnN6Ym5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTEyODMsImV4cCI6MjA2Mjg4NzI4M30.lJRjKPPzLNwRByFfa_XmtM20IPKqcn-4dddgNbuOUzU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas principais
export type Fornecedor = {
  id: number;
  nome: string;
  tipo_fornecedor: string;
  cnpj_cpf: string;
  ativo: boolean;
  nome_responsavel: string;
  email_contato: string;
  telefone_fixo: string;
  whatsapp: string;
  site_catalogo: string;
  forma_pagamento: string;
  prazo_entrega: number;
  insumos_fornecidos: string;
  componentes_fornecidos: string;
  created_at: string;
  updated_at: string;
};

export type Material = {
  id: number;
  nome: string;
  grupo_insumo: string;
  descricao: string;
  unidade_medida: string;
  estoque_minimo: number;
  ativo: boolean;
  cor: string;
  textura: string;
  quantidade_disponivel: number;
  created_at: string;
  updated_at: string;
};

export type MovimentacaoEstoque = {
  id: number;
  material_id: number;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  observacao: string;
  data: string;
  created_at: string;
  updated_at: string;
};

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpf_cnpj: string;
  data_nascimento: string;
  ativo: boolean;
  vip: boolean;
  indicado_por: number | null;
  etiquetas: string[];
  observacoes: string;
  created_at: string;
  updated_at: string;
};

export type Pedido = {
  id: number;
  cliente_id: number;
  data_pedido: string;
  data_entrega_prevista: string;
  status: string;
  valor_total: number;
  forma_pagamento: string;
  observacoes: string;
  created_at: string;
  updated_at: string;
};

export type ItemPedido = {
  id: number;
  pedido_id: number;
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  observacoes: string;
  created_at: string;
  updated_at: string;
};

// Funções utilitárias para operações CRUD

// Fornecedores
export const getFornecedores = async () => {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const getFornecedorById = async (id: number) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createFornecedor = async (fornecedor: Omit<Fornecedor, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .insert([fornecedor])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateFornecedor = async (id: number, fornecedor: Partial<Fornecedor>) => {
  const { data, error } = await supabase
    .from('fornecedores')
    .update(fornecedor)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteFornecedor = async (id: number) => {
  const { error } = await supabase
    .from('fornecedores')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Materiais (Estoque)
export const getMateriais = async () => {
  const { data, error } = await supabase
    .from('materiais')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const getMateriaisEstoqueCritico = async () => {
  const { data, error } = await supabase
    .from('materiais')
    .select('*')
    .lt('quantidade_disponivel', supabase.raw('estoque_minimo'))
    .eq('ativo', true)
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const getMaterialById = async (id: number) => {
  const { data, error } = await supabase
    .from('materiais')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createMaterial = async (material: Omit<Material, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('materiais')
    .insert([material])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateMaterial = async (id: number, material: Partial<Material>) => {
  const { data, error } = await supabase
    .from('materiais')
    .update(material)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteMaterial = async (id: number) => {
  const { error } = await supabase
    .from('materiais')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Movimentações de Estoque
export const createMovimentacaoEstoque = async (movimentacao: Omit<MovimentacaoEstoque, 'id' | 'created_at' | 'updated_at'>) => {
  // Iniciar uma transação para atualizar o estoque
  const { data: material, error: materialError } = await supabase
    .from('materiais')
    .select('quantidade_disponivel')
    .eq('id', movimentacao.material_id)
    .single();
  
  if (materialError) throw materialError;
  
  let novaQuantidade = material.quantidade_disponivel;
  
  if (movimentacao.tipo === 'entrada') {
    novaQuantidade += movimentacao.quantidade;
  } else if (movimentacao.tipo === 'saida') {
    novaQuantidade -= movimentacao.quantidade;
  } else if (movimentacao.tipo === 'ajuste') {
    novaQuantidade = movimentacao.quantidade;
  }
  
  // Atualizar o estoque do material
  const { error: updateError } = await supabase
    .from('materiais')
    .update({ quantidade_disponivel: novaQuantidade })
    .eq('id', movimentacao.material_id);
  
  if (updateError) throw updateError;
  
  // Registrar a movimentação
  const { data, error } = await supabase
    .from('movimentacoes_estoque')
    .insert([movimentacao])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getMovimentacoesByMaterial = async (materialId: number) => {
  const { data, error } = await supabase
    .from('movimentacoes_estoque')
    .select('*')
    .eq('material_id', materialId)
    .order('data', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Clientes
export const getClientes = async () => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('nome');
  
  if (error) throw error;
  return data;
};

export const getClienteById = async (id: number) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCliente = async (cliente: Omit<Cliente, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateCliente = async (id: number, cliente: Partial<Cliente>) => {
  const { data, error } = await supabase
    .from('clientes')
    .update(cliente)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteCliente = async (id: number) => {
  const { error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Pedidos
export const getPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      cliente:clientes(id, nome)
    `)
    .order('data_pedido', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getPedidoById = async (id: number) => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      cliente:clientes(id, nome, email, telefone),
      itens:itens_pedido(
        id, 
        quantidade, 
        valor_unitario, 
        valor_total, 
        observacoes,
        produto:produtos(id, nome, descricao)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPedido = async (
  pedido: Omit<Pedido, 'id' | 'created_at' | 'updated_at'>,
  itens: Omit<ItemPedido, 'id' | 'pedido_id' | 'created_at' | 'updated_at'>[]
) => {
  // Iniciar uma transação
  const { data, error } = await supabase
    .from('pedidos')
    .insert([pedido])
    .select();
  
  if (error) throw error;
  
  const pedidoId = data[0].id;
  
  // Adicionar os itens do pedido
  const itensComPedidoId = itens.map(item => ({
    ...item,
    pedido_id: pedidoId
  }));
  
  const { error: itensError } = await supabase
    .from('itens_pedido')
    .insert(itensComPedidoId);
  
  if (itensError) throw itensError;
  
  return data[0];
};

export const updatePedidoStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('pedidos')
    .update({ status })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deletePedido = async (id: number) => {
  // Primeiro excluir os itens do pedido
  const { error: itensError } = await supabase
    .from('itens_pedido')
    .delete()
    .eq('pedido_id', id);
  
  if (itensError) throw itensError;
  
  // Depois excluir o pedido
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Autenticação
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('perfis_usuario')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
};
