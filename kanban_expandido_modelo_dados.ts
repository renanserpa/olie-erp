// Modelo de dados para Kanban personalizável em múltiplos processos

// Tipos de módulos suportados pelo sistema
export type ModuleType = 'producao' | 'vendas' | 'compras' | 'financeiro' | 'logistica' | 'custom';

// Tipos de entidades que podem ser representadas em cards
export type EntityType = 'pedido' | 'ordem_compra' | 'producao' | 'financeiro' | 'entrega';

// Níveis de prioridade para cards
export type PriorityLevel = 'baixa' | 'normal' | 'alta' | 'urgente';

// Tipos de gatilhos para automação
export type TriggerType = 'manual' | 'time' | 'status_change' | 'field_value' | 'dependency';

// Tipos de ações para automação
export type ActionType = 'move_card' | 'notify' | 'update_field' | 'create_task';

// Definição de um quadro Kanban
export interface KanbanBoard {
  id: string;
  name: string;
  description: string;
  module: ModuleType;
  columns: KanbanColumn[];
  isVisible: boolean;
  permissions: {
    viewRoles: string[];
    editRoles: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Definição de uma coluna no quadro Kanban
export interface KanbanColumn {
  id: string;
  name: string;
  order: number;
  limit: number | null; // Limite de cards na coluna (opcional)
  boardId: string;
  color: string; // Cor de identificação da coluna
  automationRules: AutomationRule[];
  isCollapsed: boolean; // Se a coluna está recolhida na visualização
}

// Definição de um card no quadro Kanban
export interface KanbanCard {
  id: string;
  title: string;
  description: string;
  columnId: string;
  boardId: string;
  entityType: EntityType;
  entityId: string; // ID do objeto relacionado (pedido, ordem de compra, etc.)
  assignedTo: string | null; // ID do usuário responsável
  priority: PriorityLevel;
  dueDate: string | null;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  checklist: ChecklistItem[];
  customFields: CustomField[];
  history: CardHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// Definição de uma regra de automação
export interface AutomationRule {
  id: string;
  name: string; // Nome descritivo da regra
  columnId: string;
  triggerType: TriggerType;
  triggerCondition: string; // Condição em formato JSON
  action: ActionType;
  actionParams: string; // Parâmetros da ação em formato JSON
  isActive: boolean;
  createdBy: string; // ID do usuário que criou a regra
  createdAt: string;
  updatedAt: string;
}

// Anexos em cards
export interface Attachment {
  id: string;
  cardId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

// Comentários em cards
export interface Comment {
  id: string;
  cardId: string;
  text: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// Itens de checklist em cards
export interface ChecklistItem {
  id: string;
  cardId: string;
  text: string;
  isCompleted: boolean;
  completedBy: string | null;
  completedAt: string | null;
  createdAt: string;
}

// Campos personalizados para cards
export interface CustomField {
  id: string;
  cardId: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'boolean';
  value: string;
}

// Histórico de alterações em cards
export interface CardHistoryEntry {
  id: string;
  cardId: string;
  action: 'created' | 'moved' | 'updated' | 'commented' | 'assigned' | 'completed';
  description: string;
  performedBy: string;
  timestamp: string;
}

// Configuração de visualização do Kanban para um usuário
export interface KanbanUserConfig {
  userId: string;
  visibleBoards: string[]; // IDs dos quadros visíveis
  defaultBoard: string | null; // ID do quadro padrão
  columnOrder: Record<string, string[]>; // boardId -> array de columnIds na ordem preferida
  filters: KanbanFilter[];
  createdAt: string;
  updatedAt: string;
}

// Filtros salvos para visualização do Kanban
export interface KanbanFilter {
  id: string;
  name: string;
  userId: string;
  boardId: string;
  conditions: FilterCondition[];
  isDefault: boolean;
  createdAt: string;
}

// Condição de filtro
export interface FilterCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: string;
}

// Dependências entre cards
export interface CardDependency {
  id: string;
  sourceCardId: string;
  targetCardId: string;
  type: 'blocks' | 'is_blocked_by' | 'relates_to';
  createdAt: string;
}

// Template de quadro Kanban para reutilização
export interface KanbanBoardTemplate {
  id: string;
  name: string;
  description: string;
  module: ModuleType;
  columns: Omit<KanbanColumn, 'id' | 'boardId'>[];
  automationRules: Omit<AutomationRule, 'id' | 'columnId'>[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
