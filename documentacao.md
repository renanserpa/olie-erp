# Documentação do Protótipo Olie ERP

## Visão Geral

Este documento descreve o protótipo navegável do sistema Olie ERP, um sistema modular para ateliê artesanal com foco em produção personalizada, controle de estoque, pedidos sob medida e relacionamento com fornecedores e clientes.

## Estrutura do Projeto

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Frontend**: React + TypeScript
- **Estilização**: Tailwind CSS
- **Bundler**: Vite
- **Formulários**: React Hook Form + Zod
- **Máscaras**: React Input Mask
- **Ícones**: Lucide React
- **Gráficos**: Recharts
- **Testes**: React Testing Library

A estrutura de pastas segue um padrão modular:

```
src/
├── assets/        # Recursos estáticos (imagens, ícones)
├── components/    # Componentes reutilizáveis
├── contexts/      # Contextos React para gerenciamento de estado
├── pages/         # Páginas/telas do sistema
├── tests/         # Testes automatizados
└── utils/         # Funções utilitárias
```

## Telas Implementadas

### 1. Tela de Login

- Campos: email e senha com validação
- Botão "Entrar" com feedback visual
- Link "Esqueci minha senha"
- Layout limpo e centralizado conforme especificações visuais

### 2. Dashboard Principal

- Cards com indicadores:
  - Pedidos Abertos
  - Ordens de Produção em andamento
  - Materiais com Estoque Crítico
- Gráfico de pizza: status dos pedidos
- Fila de Produção: exibindo ordens com status, produto e etapa
- Lista "Últimos pedidos": cliente, data, status

### 3. Menu Lateral Fixo

- Ícones + nomes para todos os módulos
- Controle dinâmico baseado no perfil do usuário
- Destaque visual para módulo ativo
- Botão "+ Novo" no rodapé

### 4. Listagem de Fornecedores

- Tabela com dados principais
- Filtros avançados (busca, categoria, estado, status)
- Ações para cada item (visualizar, editar, excluir)
- Paginação

### 5. Formulário de Fornecedor

- Organizado em seções (Dados Gerais, Endereço, Contato)
- Campos com validação e máscaras
- Selects com busca para relacionamentos
- Toggle para status ativo/inativo

## Componentes Reutilizáveis

### Componentes de UI Básicos

- **Button**: Botão customizável com variantes (primary, secondary, outline) e tamanhos
- **Input**: Campo de entrada com suporte a label, validação e mensagens de erro
- **Select**: Dropdown com opção de busca para facilitar seleção em listas grandes
- **Toggle**: Interruptor para campos booleanos

### Componentes de Formulário

- **FormSection**: Organizador de seções em formulários extensos
- **MaskedInput**: Campos com máscaras para CPF/CNPJ, telefone, datas e valores monetários

## Controle de Permissões

O sistema implementa controle de acesso baseado em perfis de usuário:

- **Admin**: Acesso total a todos os módulos
- **Produção**: Dashboard, Produção, Pedidos, Estoque
- **Financeiro**: Dashboard, Financeiro, Compras
- **Compras**: Dashboard, Fornecedores, Compras, Estoque
- **RH**: Dashboard, RH, Configurações
- **Logística**: Dashboard, Logística, Pedidos

O menu lateral e os botões de ação refletem essas permissões, exibindo apenas os módulos permitidos para cada perfil.

## Padrão Visual

O sistema segue o padrão visual definido:

- **Fundo principal**: `#F0FFBE` (amarelo claro)
- **Botões e destaques**: `#A5854E` (dourado terroso)
- **Texto principal**: `#2C2C2C` (preto suave)
- **Cards**: Fundo branco com bordas suaves e leve sombra

## Testes Automatizados

Foram implementados testes automatizados para:

1. **Tela de Login**:
   - Renderização correta
   - Validação de campos obrigatórios
   - Validação de formato de email
   - Alternância de visibilidade da senha

2. **Listagem de Fornecedores**:
   - Renderização correta
   - Exibição/ocultação do painel de filtros
   - Filtragem de dados
   - Exibição de mensagem quando nenhum resultado é encontrado

## Fluxos Implementados

### Fluxo de Autenticação
1. Usuário acessa a tela de login
2. Preenche email e senha
3. Sistema valida os campos
4. Após login bem-sucedido, redireciona para o Dashboard

### Fluxo de Listagem e Filtro de Fornecedores
1. Usuário acessa a tela de Fornecedores
2. Pode visualizar todos os fornecedores cadastrados
3. Pode aplicar filtros para refinar a busca
4. Pode acessar ações para cada fornecedor (visualizar, editar, excluir)

### Fluxo de Cadastro de Fornecedor
1. Usuário clica em "Novo Fornecedor"
2. Preenche os dados nas seções organizadas
3. Sistema valida os campos obrigatórios e formatos
4. Usuário salva o cadastro

## Próximos Passos

Conforme solicitado, o próximo módulo a ser implementado será o de **Fornecedores**, expandindo as funcionalidades já iniciadas neste protótipo.
