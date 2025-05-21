# Olie ERP - Sistema de Gestão para Ateliê Olie

Este é o sistema completo de gestão empresarial (ERP) desenvolvido especificamente para o Ateliê Olie, integrando todos os processos do negócio em uma única plataforma.

## Visão Geral

O Olie ERP é uma solução completa que permite gerenciar:

- Clientes e pedidos
- Estoque e materiais
- Produção e fluxo de trabalho
- Fornecedores e compras
- Logística e entregas
- Financeiro e faturamento
- Recursos humanos
- Análises e relatórios

## Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Bibliotecas**: React Router, React Hook Form, Zod, Lucide Icons, Recharts

## Estrutura do Projeto

```
olie-erp/
├── src/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/          # Páginas do sistema
│   ├── contexts/       # Contextos React
│   ├── utils/          # Funções utilitárias
│   ├── scripts/        # Scripts de banco de dados
│   └── assets/         # Imagens e outros recursos
├── public/             # Arquivos públicos
└── README.md           # Este arquivo
```

## Módulos Implementados

### 1. Login e Autenticação
- Tela de login com validação
- Controle de acesso baseado em perfis
- Integração com Supabase Auth

### 2. Dashboard Principal
- Visão geral do negócio
- Cards com indicadores principais
- Gráficos de desempenho

### 3. Notificações
- Sistema de alertas em tempo real
- Configurações de notificações
- Histórico de mensagens

### 4. Fornecedores
- Cadastro e gestão de fornecedores
- Histórico de compras
- Avaliação de fornecedores

### 5. Estoque
- Controle de materiais
- Movimentações de estoque
- Alertas de estoque baixo

### 6. Clientes
- Cadastro e gestão de clientes
- Histórico de pedidos
- Sistema de indicações

### 7. Produtos
- Cadastro de produtos
- Ficha técnica
- Imagens e variações

### 8. Pedidos
- Registro de pedidos
- Acompanhamento de status
- Histórico de alterações

### 9. Produção (Kanban)
- Visualização em quadro Kanban
- Controle de etapas de produção
- Alocação de recursos

### 10. Compras
- Solicitações de compra
- Ordens de compra
- Aprovações e recebimentos

### 11. Logística
- Controle de entregas
- Rastreamento de envios
- Gestão de transportadoras

### 12. Financeiro
- Contas a pagar e receber
- Fluxo de caixa
- Relatórios financeiros

### 13. RH
- Gestão de funcionários
- Controle de férias
- Registro de ponto

### 14. Configurações
- Configurações da empresa
- Personalização do sistema
- Integrações externas

### 15. Usuários e Permissões
- Gestão de usuários
- Perfis de acesso
- Logs de atividades

### 16. BI/Dashboards Analíticos
- Análises avançadas
- Gráficos interativos
- Exportação de relatórios

## Integração com Supabase

O sistema está integrado com o Supabase para armazenamento de dados e autenticação:

```javascript
// Configuração do Supabase
const supabaseUrl = 'https://lhnfftajaanimavszbnf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobmZmdGFqYWFuaW1hdnN6Ym5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTEyODMsImV4cCI6MjA2Mjg4NzI4M30.lJRjKPPzLNwRByFfa_XmtM20IPKqcn-4dddgNbuOUzU';
```

## Como Iniciar o Sistema

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=https://lhnfftajaanimavszbnf.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxobmZmdGFqYWFuaW1hdnN6Ym5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMTEyODMsImV4cCI6MjA2Mjg4NzI4M30.lJRjKPPzLNwRByFfa_XmtM20IPKqcn-4dddgNbuOUzU
   ```
4. Execute o sistema:
   ```
   npm run dev
   ```

## Ajustes no Banco de Dados

Antes de usar o sistema em produção, execute o script de ajuste do banco de dados:

1. Acesse o painel do Supabase
2. Vá para "SQL Editor"
3. Copie e cole o conteúdo do arquivo `src/scripts/ajuste_banco_dados.sql`
4. Execute o script

Este script irá:
- Unificar tabelas duplicadas
- Padronizar nomenclatura
- Criar tabelas faltantes
- Adicionar campos necessários
- Criar índices para otimização
- Configurar triggers para automação

## Contato e Suporte

Para dúvidas ou suporte, entre em contato com a equipe de desenvolvimento.

---

Desenvolvido com ❤️ para o Ateliê Olie
