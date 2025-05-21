-- Script SQL para criar todas as tabelas necessárias para o Olie ERP

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  perfil VARCHAR(50) NOT NULL, -- Admin, Producao, Compras, Financeiro, Logistica, RH
  status BOOLEAN DEFAULT TRUE,
  ultimo_acesso TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Notificações
CREATE TABLE IF NOT EXISTS notificacoes (
  id BIGSERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL, -- aviso, alerta, lembrete, tarefa
  mensagem TEXT NOT NULL,
  origem VARCHAR(50) NOT NULL, -- pedidos, estoque, producao, compras, financeiro, sistema
  data_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'nova', -- nova, lida, resolvida
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  prioridade VARCHAR(20) NOT NULL DEFAULT 'normal', -- baixa, normal, alta
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  tipo_fornecedor VARCHAR(100),
  cnpj_cpf VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE,
  nome_responsavel VARCHAR(255),
  email_contato VARCHAR(255),
  telefone_fixo VARCHAR(20),
  whatsapp VARCHAR(20),
  site_catalogo VARCHAR(255),
  forma_pagamento VARCHAR(100),
  prazo_entrega INTEGER,
  insumos_fornecidos TEXT,
  componentes_fornecidos TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Materiais (Estoque)
CREATE TABLE IF NOT EXISTS materiais (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  grupo_insumo VARCHAR(100),
  descricao TEXT,
  unidade_medida VARCHAR(50) NOT NULL,
  estoque_minimo DECIMAL(10, 2) DEFAULT 0,
  ativo BOOLEAN DEFAULT TRUE,
  cor VARCHAR(50),
  textura VARCHAR(100),
  quantidade_disponivel DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Movimentações de Estoque
CREATE TABLE IF NOT EXISTS movimentacoes_estoque (
  id BIGSERIAL PRIMARY KEY,
  material_id BIGINT NOT NULL REFERENCES materiais(id) ON DELETE RESTRICT,
  tipo VARCHAR(20) NOT NULL, -- entrada, saida, ajuste
  quantidade DECIMAL(10, 2) NOT NULL,
  observacao TEXT,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usuario_id UUID REFERENCES usuarios(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  cpf_cnpj VARCHAR(20),
  data_nascimento DATE,
  ativo BOOLEAN DEFAULT TRUE,
  vip BOOLEAN DEFAULT FALSE,
  indicado_por BIGINT REFERENCES clientes(id),
  etiquetas TEXT[], -- Array de strings para etiquetas
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS produtos (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50) UNIQUE,
  categoria VARCHAR(100),
  ativo BOOLEAN DEFAULT TRUE,
  descricao TEXT,
  valor_base DECIMAL(10, 2) NOT NULL,
  tamanhos TEXT[], -- Array de strings para tamanhos disponíveis
  cores TEXT[], -- Array de strings para cores/variações
  produto_composto BOOLEAN DEFAULT FALSE,
  personalizacoes TEXT[], -- Tipos de personalização disponíveis
  fontes TEXT[], -- Fontes permitidas
  componentes TEXT[], -- Componentes opcionais
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Composição de Produtos (para produtos compostos)
CREATE TABLE IF NOT EXISTS produtos_composicao (
  id BIGSERIAL PRIMARY KEY,
  produto_pai_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  produto_filho_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(produto_pai_id, produto_filho_id)
);

-- Tabela de Imagens de Produtos
CREATE TABLE IF NOT EXISTS produtos_imagens (
  id BIGSERIAL PRIMARY KEY,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  principal BOOLEAN DEFAULT FALSE,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
  data_entrega_prevista DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'Pendente', -- Pendente, Em produção, Finalizado, Entregue, Cancelado
  valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  valor_pago DECIMAL(10, 2) DEFAULT 0,
  forma_pagamento VARCHAR(50),
  status_pagamento VARCHAR(20) DEFAULT 'pendente', -- pago, pendente, parcial
  canal_venda VARCHAR(50),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS itens_pedido (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario DECIMAL(10, 2) NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  personalizacoes JSONB, -- Detalhes de personalização em formato JSON
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ordens de Produção
CREATE TABLE IF NOT EXISTS ordens_producao (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT,
  produto_id BIGINT NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
  cliente_id BIGINT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  prioridade VARCHAR(20) DEFAULT 'normal', -- baixa, normal, alta
  responsavel_id UUID REFERENCES usuarios(id),
  data_inicio DATE,
  data_entrega_prevista DATE,
  etapa_atual VARCHAR(50) DEFAULT 'Aguardando', -- Aguardando, Corte, Costura, Montagem, Revisão, Finalizado
  status VARCHAR(20) DEFAULT 'aberta', -- aberta, em andamento, finalizada, pausada, cancelada
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Etapas de Produção
CREATE TABLE IF NOT EXISTS etapas_producao (
  id BIGSERIAL PRIMARY KEY,
  ordem_id BIGINT NOT NULL REFERENCES ordens_producao(id) ON DELETE CASCADE,
  nome VARCHAR(100) NOT NULL,
  concluida BOOLEAN DEFAULT FALSE,
  data_inicio TIMESTAMP WITH TIME ZONE,
  data_fim TIMESTAMP WITH TIME ZONE,
  responsavel_id UUID REFERENCES usuarios(id),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Solicitações de Compra
CREATE TABLE IF NOT EXISTS solicitacoes_compra (
  id BIGSERIAL PRIMARY KEY,
  material_id BIGINT NOT NULL REFERENCES materiais(id) ON DELETE RESTRICT,
  quantidade DECIMAL(10, 2) NOT NULL,
  solicitante_id UUID NOT NULL REFERENCES usuarios(id),
  status VARCHAR(50) NOT NULL DEFAULT 'Solicitado', -- Solicitado, Aguardando aprovação, Aprovado, Recusado, Finalizado
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  urgencia VARCHAR(20) DEFAULT 'Normal', -- Normal, Urgente
  justificativa TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ordens de Compra
CREATE TABLE IF NOT EXISTS ordens_compra (
  id BIGSERIAL PRIMARY KEY,
  fornecedor_id BIGINT NOT NULL REFERENCES fornecedores(id) ON DELETE RESTRICT,
  solicitacao_id BIGINT REFERENCES solicitacoes_compra(id),
  data_ordem DATE NOT NULL DEFAULT CURRENT_DATE,
  forma_pagamento VARCHAR(50),
  prazo_entrega INTEGER,
  status VARCHAR(20) DEFAULT 'Aberta', -- Aberta, Em andamento, Recebida, Cancelada
  valor_total DECIMAL(10, 2) DEFAULT 0,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Itens da Ordem de Compra
CREATE TABLE IF NOT EXISTS itens_ordem_compra (
  id BIGSERIAL PRIMARY KEY,
  ordem_id BIGINT NOT NULL REFERENCES ordens_compra(id) ON DELETE CASCADE,
  material_id BIGINT NOT NULL REFERENCES materiais(id) ON DELETE RESTRICT,
  quantidade DECIMAL(10, 2) NOT NULL,
  valor_unitario DECIMAL(10, 2) NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Entregas (Logística)
CREATE TABLE IF NOT EXISTS entregas (
  id BIGSERIAL PRIMARY KEY,
  pedido_id BIGINT NOT NULL REFERENCES pedidos(id) ON DELETE RESTRICT,
  data_entrega DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'Aguardando', -- Aguardando, Em rota, Entregue, Recusada, Retornada
  responsavel_id UUID REFERENCES usuarios(id),
  rota VARCHAR(100),
  data_hora_saida TIMESTAMP WITH TIME ZONE,
  data_hora_chegada TIMESTAMP WITH TIME ZONE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Rotas de Entrega
CREATE TABLE IF NOT EXISTS rotas_entrega (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  pontos TEXT[], -- Array de strings para pontos/paradas
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Lançamentos Financeiros
CREATE TABLE IF NOT EXISTS lancamentos_financeiros (
  id BIGSERIAL PRIMARY KEY,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  descricao VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL, -- positivo para receitas, negativo para despesas
  forma_pagamento VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'Pendente', -- Pago, Pendente, Atrasado, Parcial
  relacionado_tipo VARCHAR(50), -- Pedido, Compra, Colaborador, etc.
  relacionado_id BIGINT, -- ID do registro relacionado
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias Financeiras
CREATE TABLE IF NOT EXISTS categorias_financeiras (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(20) NOT NULL, -- receita, despesa
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Formas de Pagamento
CREATE TABLE IF NOT EXISTS formas_pagamento (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Colaboradores (RH)
CREATE TABLE IF NOT EXISTS colaboradores (
  id BIGSERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  usuario_id UUID REFERENCES usuarios(id),
  status VARCHAR(20) DEFAULT 'Ativo', -- Ativo, Inativo
  data_admissao DATE,
  telefone VARCHAR(20),
  data_nascimento DATE,
  cpf VARCHAR(14),
  endereco TEXT,
  email VARCHAR(255),
  salario DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Férias e Licenças
CREATE TABLE IF NOT EXISTS ferias_licencas (
  id BIGSERIAL PRIMARY KEY,
  colaborador_id BIGINT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL, -- férias, licença
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'programado', -- programado, em andamento, concluído
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Controle de Ponto
CREATE TABLE IF NOT EXISTS controle_ponto (
  id BIGSERIAL PRIMARY KEY,
  colaborador_id BIGINT NOT NULL REFERENCES colaboradores(id) ON DELETE CASCADE,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  hora_entrada TIME,
  hora_saida TIME,
  horas_trabalhadas DECIMAL(5, 2),
  justificativa TEXT,
  ajuste_manual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações do Sistema
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
  id BIGSERIAL PRIMARY KEY,
  chave VARCHAR(100) NOT NULL UNIQUE,
  valor TEXT,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO configuracoes_sistema (chave, valor, descricao)
VALUES 
  ('nome_empresa', 'Ateliê Olie', 'Nome do ateliê/empresa'),
  ('email_contato', 'contato@atelieolie.com.br', 'E-mail de contato'),
  ('telefone_contato', '(00) 00000-0000', 'Telefone de contato'),
  ('estoque_minimo_padrao', '5', 'Quantidade mínima padrão para alertas de estoque'),
  ('tentativas_login', '3', 'Número máximo de tentativas de login');

-- Triggers para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Aplicar o trigger a todas as tabelas
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('
            CREATE TRIGGER update_updated_at_trigger
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t);
    END LOOP;
END;
$$;

-- Criar extensão para gerar UUIDs se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
