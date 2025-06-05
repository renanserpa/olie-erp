/*
 * NotificationDropdown.tsx
 * -----------------------------------------------------------
 * Dropdown de notificações com Supabase Realtime + Tailwind padrão
 * -----------------------------------------------------------
 * ✔ Remove cores custom (secondary) → usa azul padrão
 * ✔ Deriva unreadCount diretamente do estado (evita duplicidade)
 * ✔ Acessibilidade: aria-haspopup + aria-expanded
 * ✔ Compatível com Supabase JS v2 (`supabase.channel(..)`)
 */

import React, { useEffect, useState } from "react";
import { Bell, Check, AlertTriangle, Info, Clock } from "lucide-react";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

export interface Notification {
  id: number;
  tipo: "aviso" | "alerta" | "lembrete" | "tarefa";
  mensagem: string;
  origem: string;
  data_hora: string;
  status: "nova" | "lida" | "resolvida";
  usuario_id: string;
  prioridade: "baixa" | "normal" | "alta";
}

interface NotificationDropdownProps {
  userId: string;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter((n) => n.status === "nova").length;

  /* --------------------------------------------------
   * Fetch inicial + Realtime subscription
   * -------------------------------------------------- */
  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notificacoes")
        .select("*")
        .eq("usuario_id", userId)
        .order("data_hora", { ascending: false })
        .limit(10);

      if (error) return console.error(error.message);
      setNotifications(data as Notification[]);
    };

    fetchNotifications();

    const channel = supabase
      .channel("notificacoes_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notificacoes",
          filter: `usuario_id=eq.${userId}`,
        },
        (payload: RealtimePostgresInsertPayload<Notification>) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  /* --------------------------------------------------
   * Mutations
   * -------------------------------------------------- */
  const updateStatus = async (id: number, status: Notification["status"]) => {
    const { error } = await supabase
      .from("notificacoes")
      .update({ status })
      .eq("id", id);
    if (error) return console.error(error.message);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));
  };

  const deleteNotification = async (id: number) => {
    const { error } = await supabase.from("notificacoes").delete().eq("id", id);
    if (error) return console.error(error.message);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /* -------------------------------------------------- */
  const renderIcon = (tipo: Notification["tipo"]) => {
    switch (tipo) {
      case "alerta":
        return <AlertTriangle size={18} className="text-red-500" />;
      case "aviso":
        return <Info size={18} className="text-blue-500" />;
      case "lembrete":
        return <Clock size={18} className="text-yellow-500" />;
      case "tarefa":
        return <Check size={18} className="text-green-500" />;
      default:
        return <Info size={18} className="text-gray-500" />;
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* -------------------------------------------------- */
  return (
    <div className="relative">
      {/* Badge */}
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Bell size={20} className="text-blue-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-gray-200 z-50">
          <div className="flex items-center justify-between border-b border-gray-200 p-3">
            <h3 className="text-sm font-semibold text-gray-700">Notificações</h3>
            <button className="text-xs text-blue-600 hover:underline" onClick={() => setIsOpen(false)}>
              Fechar
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-sm text-gray-500">Nenhuma notificação encontrada</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group border-b border-gray-100 p-3 transition hover:bg-gray-50 ${n.status === "nova" ? "bg-blue-50" : ""} ${n.prioridade === "alta" ? "border-l-4 border-red-500" : ""}`}
                >
                  <div className="flex items-start">
                    <div className="mt-0.5 flex-shrink-0">{renderIcon(n.tipo)}</div>
                    <div className="ml-2 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{n.mensagem}</p>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                        <span>
                          <span className="font-medium">{n.origem}</span> • {formatDate(n.data_hora)}
                        </span>
                        <div className="flex gap-1">
                          {n.status === "nova" && (
                            <button onClick={() => updateStatus(n.id, "lida")} className="text-blue-600 hover:text-blue-800">
                              Marcar como lida
                            </button>
                          )}
                          <button onClick={() => updateStatus(n.id, "resolvida")} className="text-green-600 hover:text-green-800">
                            Resolver
                          </button>
                          <button onClick={() => deleteNotification(n.id)} className="text-red-600 hover:text-red-800">
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-200 p-2 text-center">
            <a href="/notificacoes" className="text-xs text-blue-600 hover:underline">
              Ver todas as notificações
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
