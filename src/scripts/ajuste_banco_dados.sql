-- Script SQL para ajustar a estrutura do banco de dados do Olie ERP
-- Este script unifica tabelas duplicadas e padroniza a nomenclatura

-- =============================================
-- AJUSTES DE TABELAS DUPLICADAS
-- =============================================

-- 1. Verificar e unificar tabelas de clientes
DO $$
BEGIN
    -- Se existirem múltiplas tabelas de clientes, unificar
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cliente') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'clientes') THEN
        
        -- Criar tabela temporária para unificação
        CREATE TEMP TABLE temp_clientes AS 
        SELECT * FROM clientes WHERE id NOT IN (SELECT id FROM cliente);
        
        -- Inserir dados da tabela temporária na tabela principal
        INSERT INTO cliente 
        SELECT * FROM temp_clientes;
        
        -- Remover tabela duplicada
        DROP TABLE clientes;
        
        RAISE NOTICE 'Tabelas de clientes unificadas com sucesso!';
    END IF;
END $$;

-- 2. Verificar e unificar tabelas de fornecedores
DO $$
BEGIN
    -- Se existirem múltiplas tabelas de fornecedores, unificar
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fornecedor') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fornecedores') THEN
        
        -- Criar tabela temporária para unificação
        CREATE TEMP TABLE temp_fornecedores AS 
        SELECT * FROM fornecedores WHERE id NOT IN (SELECT id FROM fornecedor);
        
        -- Inserir dados da tabela temporária na tabela principal
        INSERT INTO fornecedor 
        SELECT * FROM temp_fornecedores;
        
        -- Remover tabela duplicada
        DROP TABLE fornecedores;
        
        RAISE NOTICE 'Tabelas de fornecedores unificadas com sucesso!';
    END IF;
END $$;

-- 3. Verificar e unificar tabelas de produtos
DO $$
BEGIN
    -- Se existirem múltiplas tabelas de produtos, unificar
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'produto') AND 
       EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'produtos') THEN
        
        -- Criar tabela temporária para unificação
        CREATE TEMP TABLE temp_produtos AS 
        SELECT * FROM produtos WHERE id NOT IN (SELECT id FROM produto);
        
        -- Inserir dados da tabela temporária na tabela principal
        INSERT INTO produto 
        SELECT * FROM temp_produtos;
        
        -- Remover tabela duplicada
        DROP TABLE produtos;
        
        RAISE NOTICE 'Tabelas de produtos unificadas com sucesso!';
    END IF;
END $$;

-- =============================================
-- PADRONIZAÇÃO DE NOMENCLATURA
-- =============================================

-- 1. Renomear tabelas para padrão singular
DO $$
DECLARE
    tabela_atual text;
    tabela_nova text;
    tabelas_para_renomear text[] := array['clientes', 'fornecedores', 'produtos', 'pedidos', 'usuarios', 'materiais'];
    tabelas_padronizadas text[] := array['cliente', 'fornecedor', 'produto', 'pedido', 'usuario', 'material'];
    i integer;
BEGIN
    FOR i IN 1..array_length(tabelas_para_renomear, 1) LOOP
        tabela_atual := tabelas_para_renomear[i];
        tabela_nova := tabelas_padronizadas[i];
        
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tabela_atual) AND 
           NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = tabela_nova) THEN
            EXECUTE 'ALTER TABLE ' || tabela_atual || ' RENAME TO ' || tabela_nova;
            RAISE NOTICE 'Tabela % renomeada para %', tabela_atual, tabela_nova;
        END IF;
    END LOOP;
END $$;

-- 2. Padronizar nomes de colunas comuns
DO $$
DECLARE
    tabela record;
    coluna record;
    colunas_para_padronizar text[] := array['nome_cliente', 'nome_fornecedor', 'nome_produto', 'nome_usuario'];
    colunas_padronizadas text[] := array['nome', 'nome', 'nome', 'nome'];
    i integer;
BEGIN
    FOR tabela IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        FOR i IN 1..array_length(colunas_para_padronizar, 1) LOOP
            IF EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = tabela.table_name 
                      AND column_name = colunas_para_padronizar[i]) THEN
                
                EXECUTE 'ALTER TABLE ' || tabela.table_name || ' RENAME COLUMN ' || 
                        colunas_para_padronizar[i] || ' TO ' || colunas_padronizadas[i];
                
                RAISE NOTICE 'Coluna % renomeada para % na tabela %', 
                            colunas_para_padronizar[i], colunas_padronizadas[i], tabela.table_name;
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- =============================================
-- CRIAÇÃO DE TABELAS FALTANTES
-- =============================================

-- 1. Tabela de Notificações (se não existir)
CREATE TABLE IF NOT EXISTS notificacao (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('aviso', 'alerta', 'lembrete', 'tarefa')),
    mensagem TEXT NOT NULL,
    origem VARCHAR(50) NOT NULL,
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'lida', 'resolvida')),
    usuario_id INTEGER REFERENCES usuario(id),
    prioridade VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta'))
);

-- 2. Tabela de Configurações (se não existir)
CREATE TABLE IF NOT EXISTS configuracao (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descricao TEXT,
    tipo VARCHAR(50) NOT NULL DEFAULT 'texto',
    categoria VARCHAR(50) NOT NULL DEFAULT 'geral',
    data_modificacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Logs do Sistema (se não existir)
CREATE TABLE IF NOT EXISTS log_sistema (
    id SERIAL PRIMARY KEY,
    acao VARCHAR(100) NOT NULL,
    tabela VARCHAR(100),
    registro_id INTEGER,
    dados JSONB,
    usuario_id INTEGER REFERENCES usuario(id),
    data_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(50)
);

-- =============================================
-- ADIÇÃO DE CAMPOS FALTANTES
-- =============================================

-- 1. Adicionar campos faltantes na tabela de usuários
DO $$
BEGIN
    -- Adicionar campo de perfil_id se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'usuario' 
                  AND column_name = 'perfil_id') THEN
        ALTER TABLE usuario ADD COLUMN perfil_id VARCHAR(50);
        RAISE NOTICE 'Campo perfil_id adicionado à tabela usuario';
    END IF;
    
    -- Adicionar campo de último acesso se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'usuario' 
                  AND column_name = 'ultimo_acesso') THEN
        ALTER TABLE usuario ADD COLUMN ultimo_acesso TIMESTAMP WITH TIME ZONE;
        RAISE NOTICE 'Campo ultimo_acesso adicionado à tabela usuario';
    END IF;
END $$;

-- 2. Adicionar campos faltantes na tabela de produtos
DO $$
BEGIN
    -- Adicionar campo de imagem_url se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'produto' 
                  AND column_name = 'imagem_url') THEN
        ALTER TABLE produto ADD COLUMN imagem_url VARCHAR(255);
        RAISE NOTICE 'Campo imagem_url adicionado à tabela produto';
    END IF;
    
    -- Adicionar campo de tempo_producao se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'produto' 
                  AND column_name = 'tempo_producao') THEN
        ALTER TABLE produto ADD COLUMN tempo_producao INTEGER;
        RAISE NOTICE 'Campo tempo_producao adicionado à tabela produto';
    END IF;
END $$;

-- =============================================
-- CRIAÇÃO DE ÍNDICES PARA OTIMIZAÇÃO
-- =============================================

-- 1. Índices para tabela de pedidos
DO $$
BEGIN
    -- Índice para cliente_id
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'pedido' 
                  AND indexname = 'idx_pedido_cliente_id') THEN
        CREATE INDEX idx_pedido_cliente_id ON pedido(cliente_id);
        RAISE NOTICE 'Índice idx_pedido_cliente_id criado';
    END IF;
    
    -- Índice para status
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'pedido' 
                  AND indexname = 'idx_pedido_status') THEN
        CREATE INDEX idx_pedido_status ON pedido(status);
        RAISE NOTICE 'Índice idx_pedido_status criado';
    END IF;
    
    -- Índice para data_pedido
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'pedido' 
                  AND indexname = 'idx_pedido_data') THEN
        CREATE INDEX idx_pedido_data ON pedido(data_pedido);
        RAISE NOTICE 'Índice idx_pedido_data criado';
    END IF;
END $$;

-- 2. Índices para tabela de produtos
DO $$
BEGIN
    -- Índice para categoria_id
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'produto' 
                  AND indexname = 'idx_produto_categoria_id') THEN
        CREATE INDEX idx_produto_categoria_id ON produto(categoria_id);
        RAISE NOTICE 'Índice idx_produto_categoria_id criado';
    END IF;
    
    -- Índice para nome (busca textual)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes 
                  WHERE tablename = 'produto' 
                  AND indexname = 'idx_produto_nome') THEN
        CREATE INDEX idx_produto_nome ON produto(nome);
        RAISE NOTICE 'Índice idx_produto_nome criado';
    END IF;
END $$;

-- =============================================
-- CRIAÇÃO DE TRIGGERS PARA AUTOMAÇÃO
-- =============================================

-- 1. Trigger para atualizar data_modificacao
CREATE OR REPLACE FUNCTION atualizar_data_modificacao()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_modificacao = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em tabelas principais
DO $$
DECLARE
    tabela text;
    tabelas text[] := array['cliente', 'fornecedor', 'produto', 'pedido', 'usuario', 'material'];
BEGIN
    FOREACH tabela IN ARRAY tabelas LOOP
        -- Verificar se a coluna data_modificacao existe
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = tabela 
                  AND column_name = 'data_modificacao') THEN
            
            -- Verificar se o trigger já existe
            IF NOT EXISTS (SELECT 1 FROM pg_trigger 
                          WHERE tgname = 'trigger_' || tabela || '_data_modificacao') THEN
                
                -- Criar o trigger
                EXECUTE 'CREATE TRIGGER trigger_' || tabela || '_data_modificacao ' ||
                        'BEFORE UPDATE ON ' || tabela || ' ' ||
                        'FOR EACH ROW EXECUTE FUNCTION atualizar_data_modificacao()';
                
                RAISE NOTICE 'Trigger de atualização de data_modificacao criado para a tabela %', tabela;
            END IF;
        ELSE
            -- Adicionar coluna data_modificacao se não existir
            EXECUTE 'ALTER TABLE ' || tabela || ' ADD COLUMN data_modificacao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP';
            
            -- Criar o trigger
            EXECUTE 'CREATE TRIGGER trigger_' || tabela || '_data_modificacao ' ||
                    'BEFORE UPDATE ON ' || tabela || ' ' ||
                    'FOR EACH ROW EXECUTE FUNCTION atualizar_data_modificacao()';
            
            RAISE NOTICE 'Coluna data_modificacao e trigger criados para a tabela %', tabela;
        END IF;
    END LOOP;
END $$;

-- 2. Trigger para registrar logs de alterações
CREATE OR REPLACE FUNCTION registrar_log_alteracoes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO log_sistema (acao, tabela, registro_id, dados)
    VALUES (
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW))
            ELSE row_to_json(NEW)
        END
    );
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de log em tabelas principais
DO $$
DECLARE
    tabela text;
    tabelas text[] := array['cliente', 'fornecedor', 'produto', 'pedido', 'usuario', 'material'];
BEGIN
    -- Verificar se a tabela de log existe
    IF EXISTS (SELECT 1 FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'log_sistema') THEN
        
        FOREACH tabela IN ARRAY tabelas LOOP
            -- Verificar se o trigger já existe
            IF NOT EXISTS (SELECT 1 FROM pg_trigger 
                          WHERE tgname = 'trigger_' || tabela || '_log') THEN
                
                -- Criar o trigger
                EXECUTE 'CREATE TRIGGER trigger_' || tabela || '_log ' ||
                        'AFTER INSERT OR UPDATE OR DELETE ON ' || tabela || ' ' ||
                        'FOR EACH ROW EXECUTE FUNCTION registrar_log_alteracoes()';
                
                RAISE NOTICE 'Trigger de log criado para a tabela %', tabela;
            END IF;
        END LOOP;
    END IF;
END $$;

-- =============================================
-- INSERÇÃO DE DADOS INICIAIS
-- =============================================

-- 1. Inserir configurações padrão
INSERT INTO configuracao (chave, valor, descricao, tipo, categoria)
VALUES
    ('empresa_nome', 'Ateliê Olie', 'Nome da empresa', 'texto', 'empresa'),
    ('empresa_cnpj', '00.000.000/0000-00', 'CNPJ da empresa', 'texto', 'empresa'),
    ('empresa_email', 'contato@atelieolie.com.br', 'Email de contato da empresa', 'texto', 'empresa'),
    ('empresa_telefone', '(00) 0000-0000', 'Telefone de contato da empresa', 'texto', 'empresa'),
    ('cor_tema_principal', '#F0FFBE', 'Cor principal do tema', 'cor', 'aparencia'),
    ('cor_tema_secundaria', '#A5854E', 'Cor secundária do tema', 'cor', 'aparencia'),
    ('notificacoes_email', 'true', 'Enviar notificações por email', 'booleano', 'notificacoes'),
    ('notificacoes_sistema', 'true', 'Mostrar notificações no sistema', 'booleano', 'notificacoes')
ON CONFLICT (chave) DO NOTHING;

-- Mensagem de conclusão
DO $$
BEGIN
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Ajustes no banco de dados concluídos com sucesso!';
    RAISE NOTICE '================================================';
END $$;
