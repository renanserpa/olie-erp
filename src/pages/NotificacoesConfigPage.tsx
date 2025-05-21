import React, { useState, useEffect } from 'react';
import { Plus, Save, X, AlertTriangle, Info, Clock, Check } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import { FormSection } from '../components/FormComponents';
import { supabase } from '../utils/supabase';

// Tipos de notificações automáticas
const notificacoesAutomaticas = [
  { id: 'estoque_baixo', nome: 'Estoque Baixo', descricao: 'Notifica quando um material atinge o estoque mínimo', modulo: 'estoque', ativa: true },
  { id: 'pedido_entrega', nome: 'Pedido Pronto para Entrega', descricao: 'Notifica quando um pedido está pronto para entrega', modulo: 'pedidos', ativa: true },
  { id: 'solicitacao_compra', nome: 'Nova Solicitação de Compra', descricao: 'Notifica quando há uma nova solicitação de compra', modulo: 'compras', ativa: true },
  { id: 'aprovacao_pendente', nome: 'Aprovação Pendente', descricao: 'Notifica quando há uma aprovação pendente', modulo: 'compras', ativa: true },
  { id: 'ferias_vencendo', nome: 'Férias/Licença Vencendo', descricao: 'Notifica quando férias ou licença estão prestes a vencer', modulo: 'rh', ativa: false }
];

// Tipos de notificação
const tiposNotificacao = [
  { value: 'aviso', label: 'Aviso' },
  { value: 'alerta', label: 'Alerta' },
  { value: 'lembrete', label: 'Lembrete' },
  { value: 'tarefa', label: 'Tarefa' }
];

// Origens de notificação
const origensNotificacao = [
  { value: 'pedidos', label: 'Pedidos' },
  { value: 'estoque', label: 'Estoque' },
  { value: 'producao', label: 'Produção' },
  { value: 'compras', label: 'Compras' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'sistema', label: 'Sistema' }
];

// Prioridades
const prioridades = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'normal', label: 'Normal' },
  { value: 'alta', label: 'Alta' }
];

// Perfis de usuário
const perfisUsuario = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Producao', label: 'Produção' },
  { value: 'Compras', label: 'Compras' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Logistica', label: 'Logística' },
  { value: 'RH', label: 'RH' }
];

const NotificacoesConfigPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [activeTab, setActiveTab] = useState<'manual' | 'automatica'>('manual');
  const [configuracoesAutomaticas, setConfiguracoesAutomaticas] = useState(notificacoesAutomaticas);
  
  // Estado para notificação manual
  const [novaNotificacao, setNovaNotificacao] = useState({
    tipo: 'aviso',
    mensagem: '',
    origem: 'sistema',
    prioridade: 'normal',
    destinatarios: [] as string[]
  });
  
  // Estado para usuários
  const [usuarios, setUsuarios] = useState<Array<{ id: string, nome: string, perfil: string }>>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);
  
  // Buscar usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoadingUsuarios(true);
        
        // Em um ambiente real, isso viria do banco de dados
        // Simulando dados para demonstração
        setUsuarios([
          { id: '1', nome: 'Admin', perfil: 'Admin' },
          { id: '2', nome: 'João Silva', perfil: 'Producao' },
          { id: '3', nome: 'Maria Oliveira', perfil: 'Compras' },
          { id: '4', nome: 'Carlos Santos', perfil: 'Financeiro' },
          { id: '5', nome: 'Ana Pereira', perfil: 'Logistica' }
        ]);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoadingUsuarios(false);
      }
    };
    
    fetchUsuarios();
  }, []);
  
  // Atualizar configuração de notificação automática
  const toggleNotificacaoAutomatica = (id: string) => {
    setConfiguracoesAutomaticas(prev => 
      prev.map(config => 
        config.id === id ? { ...config, ativa: !config.ativa } : config
      )
    );
  };
  
  // Salvar configurações de notificações automáticas
  const salvarConfiguracoesAutomaticas = async () => {
    try {
      // Em um ambiente real, isso seria salvo no banco de dados
      alert('Configurações de notificações automáticas salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    }
  };
  
  // Enviar notificação manual
  const enviarNotificacaoManual = async () => {
    try {
      if (!novaNotificacao.mensagem) {
        alert('Por favor, preencha a mensagem da notificação.');
        return;
      }
      
      if (novaNotificacao.destinatarios.length === 0) {
        alert('Por favor, selecione pelo menos um destinatário.');
        return;
      }
      
      // Em um ambiente real, isso seria salvo no banco de dados
      // Simulando o envio para cada destinatário
      for (const usuarioId of novaNotificacao.destinatarios) {
        const notificacao = {
          tipo: novaNotificacao.tipo,
          mensagem: novaNotificacao.mensagem,
          origem: novaNotificacao.origem,
          data_hora: new Date().toISOString(),
          status: 'nova',
          usuario_id: usuarioId,
          prioridade: novaNotificacao.prioridade
        };
        
        // Aqui seria o código para salvar no Supabase
        // const { error } = await supabase.from('notificacoes').insert([notificacao]);
        // if (error) throw error;
      }
      
      alert('Notificação enviada com sucesso!');
      
      // Limpar formulário
      setNovaNotificacao({
        tipo: 'aviso',
        mensagem: '',
        origem: 'sistema',
        prioridade: 'normal',
        destinatarios: []
      });
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('Erro ao enviar notificação. Tente novamente.');
    }
  };
  
  // Renderizar ícone baseado no tipo de notificação
  const renderIcon = (tipo: string) => {
    switch (tipo) {
      case 'alerta':
        return <AlertTriangle size={18} className="text-red-500" />;
      case 'aviso':
        return <Info size={18} className="text-blue-500" />;
      case 'lembrete':
        return <Clock size={18} className="text-yellow-500" />;
      case 'tarefa':
        return <Check size={18} className="text-green-500" />;
      default:
        return <Info size={18} className="text-gray-500" />;
    }
  };
  
  // Selecionar todos os usuários de um perfil
  const selecionarPorPerfil = (perfil: string) => {
    const usuariosDoPerfil = usuarios
      .filter(u => u.perfil === perfil)
      .map(u => u.id);
    
    setNovaNotificacao(prev => ({
      ...prev,
      destinatarios: [...new Set([...prev.destinatarios, ...usuariosDoPerfil])]
    }));
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-text mb-6">Configuração de Notificações</h1>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'manual'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('manual')}
              >
                Envio Manual
              </button>
              <button
                className={`${
                  activeTab === 'automatica'
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('automatica')}
              >
                Notificações Automáticas
              </button>
            </nav>
          </div>
          
          {/* Conteúdo da tab ativa */}
          {activeTab === 'manual' ? (
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">Enviar Notificação Manual</h2>
              
              <FormSection title="Detalhes da Notificação">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Tipo
                  </label>
                  <div className="flex items-center space-x-4">
                    {tiposNotificacao.map(tipo => (
                      <label key={tipo.value} className="flex items-center">
                        <input
                          type="radio"
                          name="tipo"
                          value={tipo.value}
                          checked={novaNotificacao.tipo === tipo.value}
                          onChange={() => setNovaNotificacao(prev => ({ ...prev, tipo: tipo.value }))}
                          className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300"
                        />
                        <div className="ml-2 flex items-center">
                          {renderIcon(tipo.value)}
                          <span className="ml-1 text-sm text-gray-700">{tipo.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text mb-1">
                    Mensagem
                  </label>
                  <textarea
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    rows={3}
                    value={novaNotificacao.mensagem}
                    onChange={(e) => setNovaNotificacao(prev => ({ ...prev, mensagem: e.target.value }))}
                    placeholder="Digite a mensagem da notificação..."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Origem
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={novaNotificacao.origem}
                    onChange={(e) => setNovaNotificacao(prev => ({ ...prev, origem: e.target.value }))}
                  >
                    {origensNotificacao.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Prioridade
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={novaNotificacao.prioridade}
                    onChange={(e) => setNovaNotificacao(prev => ({ ...prev, prioridade: e.target.value }))}
                  >
                    {prioridades.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </FormSection>
              
              <FormSection title="Destinatários">
                <div className="col-span-2 mb-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {perfisUsuario.map(perfil => (
                      <button
                        key={perfil.value}
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                        onClick={() => selecionarPorPerfil(perfil.value)}
                      >
                        Selecionar {perfil.label}
                      </button>
                    ))}
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selecione os usuários:</h4>
                    <div className="max-h-60 overflow-y-auto">
                      {loadingUsuarios ? (
                        <p className="text-gray-500 text-sm">Carregando usuários...</p>
                      ) : (
                        <div className="space-y-2">
                          {usuarios.map(usuario => (
                            <label key={usuario.id} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={novaNotificacao.destinatarios.includes(usuario.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNovaNotificacao(prev => ({
                                      ...prev,
                                      destinatarios: [...prev.destinatarios, usuario.id]
                                    }));
                                  } else {
                                    setNovaNotificacao(prev => ({
                                      ...prev,
                                      destinatarios: prev.destinatarios.filter(id => id !== usuario.id)
                                    }));
                                  }
                                }}
                                className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                {usuario.nome} <span className="text-gray-500">({usuario.perfil})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      {novaNotificacao.destinatarios.length} usuário(s) selecionado(s)
                    </div>
                  </div>
                </div>
              </FormSection>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={enviarNotificacaoManual}>
                  <Send size={18} className="mr-1" />
                  Enviar Notificação
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-text">Notificações Automáticas</h2>
                <Button onClick={salvarConfiguracoesAutomaticas}>
                  <Save size={18} className="mr-1" />
                  Salvar Configurações
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notificação
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Módulo
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {configuracoesAutomaticas.map((config) => (
                      <tr key={config.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {config.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {config.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {origensNotificacao.find(o => o.value === config.modulo)?.label || config.modulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              checked={config.ativa}
                              onChange={() => toggleNotificacaoAutomatica(config.id)}
                              className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                            />
                            <span className="ml-2">
                              {config.ativa ? 'Ativa' : 'Inativa'}
                            </span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>As notificações automáticas são enviadas com base em eventos do sistema.</p>
                <p>Ative ou desative conforme necessário e clique em "Salvar Configurações".</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificacoesConfigPage;
