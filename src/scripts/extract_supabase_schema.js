// Script para extrair a estrutura das tabelas do Supabase
// Salve este arquivo como extract_supabase_schema.js

const { createClient } = require('@supabase/supabase-js');

// Configuração do cliente Supabase
const supabaseUrl = 'https://lhnfftajaanimavszbnf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobmZmdGFqYWFuaW1hdnN6Ym5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTEyODMsImV4cCI6MjA2Mjg4NzI4M30.lJRjKPPzLNwRByFfa_XmtM20IPKqcn-4dddgNbuOUzU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function extractSchema() {
  try {
    console.log('Iniciando extração do esquema do Supabase...');
    
    // Obter lista de todas as tabelas
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      throw tablesError;
    }
    
    console.log(`\nTabelas encontradas: ${tables.length}`);
    
    // Para cada tabela, obter suas colunas e restrições
    const schema = {};
    
    for (const table of tables) {
      const tableName = table.table_name;
      console.log(`\nAnalisando tabela: ${tableName}`);
      
      // Obter colunas da tabela
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_columns', { table_name: tableName });
      
      if (columnsError) {
        console.error(`Erro ao obter colunas da tabela ${tableName}:`, columnsError);
        continue;
      }
      
      // Obter chaves primárias
      const { data: primaryKeys, error: pkError } = await supabase
        .rpc('get_primary_keys', { table_name: tableName });
      
      if (pkError) {
        console.error(`Erro ao obter chaves primárias da tabela ${tableName}:`, pkError);
      }
      
      // Obter chaves estrangeiras
      const { data: foreignKeys, error: fkError } = await supabase
        .rpc('get_foreign_keys', { table_name: tableName });
      
      if (fkError) {
        console.error(`Erro ao obter chaves estrangeiras da tabela ${tableName}:`, fkError);
      }
      
      // Organizar informações da tabela
      schema[tableName] = {
        columns: columns || [],
        primaryKeys: primaryKeys || [],
        foreignKeys: foreignKeys || []
      };
      
      // Exibir informações da tabela
      console.log(`  Colunas: ${columns ? columns.length : 0}`);
      if (columns) {
        columns.forEach(col => {
          console.log(`    - ${col.column_name} (${col.data_type}${col.is_nullable === 'NO' ? ', NOT NULL' : ''})`);
        });
      }
      
      console.log(`  Chaves Primárias: ${primaryKeys ? primaryKeys.length : 0}`);
      if (primaryKeys) {
        primaryKeys.forEach(pk => {
          console.log(`    - ${pk.column_name}`);
        });
      }
      
      console.log(`  Chaves Estrangeiras: ${foreignKeys ? foreignKeys.length : 0}`);
      if (foreignKeys) {
        foreignKeys.forEach(fk => {
          console.log(`    - ${fk.column_name} -> ${fk.foreign_table}.${fk.foreign_column}`);
        });
      }
    }
    
    // Salvar o esquema em um arquivo JSON
    const fs = require('fs');
    fs.writeFileSync('supabase_schema.json', JSON.stringify(schema, null, 2));
    console.log('\nEsquema salvo em supabase_schema.json');
    
    return schema;
  } catch (error) {
    console.error('Erro ao extrair esquema:', error);
    return null;
  }
}

// Funções RPC necessárias para o Supabase
// Você precisa criar estas funções no Supabase SQL Editor:

/*
-- Função para obter todas as tabelas
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (table_name text)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT t.table_name::text
  FROM information_schema.tables t
  WHERE t.table_schema = 'public'
  AND t.table_type = 'BASE TABLE'
  ORDER BY t.table_name;
END;
$$;

-- Função para obter colunas de uma tabela
CREATE OR REPLACE FUNCTION get_columns(table_name text)
RETURNS TABLE (
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
  AND c.table_name = get_columns.table_name
  ORDER BY c.ordinal_position;
END;
$$;

-- Função para obter chaves primárias
CREATE OR REPLACE FUNCTION get_primary_keys(table_name text)
RETURNS TABLE (
  constraint_name text,
  column_name text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    kcu.column_name::text
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = get_primary_keys.table_name;
END;
$$;

-- Função para obter chaves estrangeiras
CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
RETURNS TABLE (
  constraint_name text,
  column_name text,
  foreign_table text,
  foreign_column text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    tc.constraint_name::text,
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table,
    ccu.column_name::text AS foreign_column
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name = get_foreign_keys.table_name;
END;
$$;
*/

// Executar a extração
extractSchema();
