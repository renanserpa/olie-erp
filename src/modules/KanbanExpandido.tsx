/*
 * KanbanExpandido.tsx
 * ---------------------------------------------
 * Board Kanban para gestão de tarefas de produção (Olie ERP)
 * ---------------------------------------------
 * > Responsável por listar, arrastar e soltar cartões entre colunas
 *   e persistir as alterações no Supabase.
 *
 * Dependências:
 *   - @hello-pangea/dnd  (fork compatível do react-beautiful-dnd)
 *   - lucide-react       (ícones)
 *   - TailwindCSS        (estilos utilitários)
 *
 * Observação: esta implementação usa o hook `useSupabaseKanban`
 * (definido neste arquivo) para encapsular toda a lógica de
 *   1. busca inicial dos cartões
 *   2. atualização otimista do estado local
 *   3. persistência no Supabase ao soltar o cartão.
 *
 * A tipagem é 100 % strict e não há uso de `any`.
 */

import { useEffect, useState, useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { supabase } from "@/lib/supabaseClient";
import { GripVertical } from "lucide-react";

// ---------------------------------------------
// Tipos
// ---------------------------------------------
export type KanbanStatus = "todo" | "doing" | "done";
export type KanbanPrioridade = "baixa" | "normal" | "alta";

export interface KanbanCard {
  id: number;
  titulo: string;
  descricao?: string;
  status: KanbanStatus;
  ordem: number; // posição na coluna
  prioridade: KanbanPrioridade;
  criado_em: string; // ISO-8601
}

// Estrutura interna do estado local (colunas -> cartões)
interface KanbanState {
  todo: KanbanCard[];
  doing: KanbanCard[];
  done: KanbanCard[];
}

// ---------------------------------------------
// Hook que centraliza lógica Supabase
// ---------------------------------------------
function useSupabaseKanban() {
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState<KanbanState>({
    todo: [],
    doing: [],
    done: [],
  });

  // 1. Busca inicial
  const fetchCards = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("kanban_cards")
      .select("*")
      .order("ordem", { ascending: true });

    if (error) {
      console.error("Erro ao buscar cartões:", error.message);
      setLoading(false);
      return;
    }

    // Distribui nas colunas
    const byStatus = { todo: [], doing: [], done: [] } as KanbanState;
    (data as KanbanCard[]).forEach((card) => {
      byStatus[card.status].push(card);
    });
    setColumns(byStatus);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // 2. Atualização (drag‑and‑drop)
  const moveCard = async (
    card: KanbanCard,
    destStatus: KanbanStatus,
    destIndex: number
  ) => {
    // Otimista: muda estado local primeiro
    setColumns((prev) => {
      // remove da origem
      const originArr = [...prev[card.status]];
      const originIdx = originArr.findIndex((c) => c.id === card.id);
      originArr.splice(originIdx, 1);

      // adiciona na coluna destino
      const destArr = [...prev[destStatus]];
      destArr.splice(destIndex, 0, { ...card, status: destStatus });

      return {
        ...prev,
        [card.status]: originArr,
        [destStatus]: destArr,
      };
    });

    // Persistência no Supabase
    const { error } = await supabase
      .from("kanban_cards")
      .update({ status: destStatus, ordem: destIndex })
      .eq("id", card.id);

    if (error) {
      console.error("Falha ao atualizar cartão:", error.message);
      // rollback simplista (recarrega tudo)
      fetchCards();
    }
  };

  return { columns, loading, moveCard } as const;
}

// ---------------------------------------------
// UI
// ---------------------------------------------
export default function KanbanExpandido() {
  const { columns, loading, moveCard } = useSupabaseKanban();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // drop fora de alvo

    const [originStatus, originIdx] = [
      result.source.droppableId as KanbanStatus,
      result.source.index,
    ];
    const [destStatus, destIdx] = [
      result.destination.droppableId as KanbanStatus,
      result.destination.index,
    ];

    if (originStatus === destStatus && originIdx === destIdx) return;

    const card = columns[originStatus][originIdx];
    moveCard(card, destStatus, destIdx);
  };

  // helpers ---------------------------------------------------------
  const columnTitles: Record<KanbanStatus, string> = {
    todo: "A Fazer",
    doing: "Em Progresso",
    done: "Concluído",
  };

  // render -----------------------------------------------------------
  return (
    <section className="mx-auto max-w-7xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Kanban de Produção</h1>

      {loading ? (
        <p className="text-center text-gray-500">Carregando…</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(columns) as KanbanStatus[]).map((status) => (
              <Droppable droppableId={status} key={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex min-h-[60vh] flex-col rounded-lg border p-2 transition ${
                      snapshot.isDraggingOver ? "bg-secondary/10" : "bg-white"
                    }`}
                  >
                    <h2 className="mb-2 flex items-center justify-between text-lg font-semibold">
                      {columnTitles[status]}
                      <span className="text-sm text-gray-500">
                        {columns[status].length}
                      </span>
                    </h2>

                    {columns[status].map((card, index) => (
                      <Draggable
                        draggableId={String(card.id)}
                        index={index}
                        key={card.id}
                      >
                        {(dragProps, dragSnapshot) => (
                          <article
                            ref={dragProps.innerRef}
                            {...dragProps.draggableProps}
                            {...dragProps.dragHandleProps}
                            className={`mb-2 rounded-md border p-3 shadow-sm transition ${
                              dragSnapshot.isDragging
                                ? "bg-yellow-50"
                                : "bg-white"
                            }`}
                          >
                            <header className="mb-1 flex items-center gap-2">
                              <GripVertical size={14} className="text-gray-400" />
                              <h3 className="flex-1 text-sm font-medium">
                                {card.titulo}
                              </h3>
                            </header>
                            {card.descricao && (
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {card.descricao}
                              </p>
                            )}
                            {card.prioridade === "alta" && (
                              <span className="mt-2 inline-block rounded bg-red-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                                Prioridade alta
                              </span>
                            )}
                          </article>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
    </section>
  );
}
