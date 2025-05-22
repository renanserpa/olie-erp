import React, { useState, useEffect } from 'react';
import { Settings, Bell, Database, Shield, Edit, Save, X} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';


// Tipos de dados
interface ConfiguracaoGeral {
  id: number;
  nome_empresa: string;
  cnpj: string;
  email_contato: string;
  telefone: string;
  endereco: string;
  logo_url?: string;
  cores_tema: {
    primaria: string;
    secundaria: string;
    texto: string;
  };
}

interface ConfiguracaoNotificacao {
  id: number;
  notificar_estoque_baixo: boolean;
  notificar_pedidos_novos: boolean;
  notificar_pagamentos: boolean;
  notificar_entregas: boolean;
  email_notificacoes: string;
}

interface ConfiguracaoIntegracao {
  id: number;
  api_key?: string;
  webhook_url?: string;
  integracao_ativa: boolean;
  ultima_sincronizacao?: string;
}

const ConfiguracoesPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [activeTab, setActiveTab] = useState<'geral' | 'notificacoes' | 'integracoes' | 'seguranca'>('geral');
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Estados para cada tipo de configuração
  const [configGeral, setConfigGeral] = useState<ConfiguracaoGeral | null>(null);
  const [configNotificacao, setConfigNotificacao] = useState<ConfiguracaoNotificacao | null>(null);
  const [configIntegracao, setConfigIntegracao] = useState<ConfiguracaoIntegracao | null>(null);
  
  // Buscar configurações
  useEffect(() => {
    const fetchConfiguracoes = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        
        // Configurações gerais
        setConfigGeral({
          id: 1,
          nome_empresa: 'Ateliê Olie',
          cnpj: '12.345.678/0001-90',
          email_contato: 'contato@atelieolie.com.br',
          telefone: '(11) 98765-4321',
          endereco: 'Rua das Flores, 123 - São Paulo/SP',
          logo_url: 'https://example.com/logo.png',
          cores_tema: {
            primaria: '#F0FFBE',
            secundaria: '#A5854E',
            texto: '#2C2C2C'
          }
        });
        
        // Configurações de notificações
        setConfigNotificacao({
          id: 1,
          notificar_estoque_baixo: true,
          notificar_pedidos_novos: true,
          notificar_pagamentos: true,
          notificar_entregas: false,
          email_notificacoes: 'alertas@atelieolie.com.br'
        });
        
        // Configurações de integrações
        setConfigIntegracao({
          id: 1,
          api_key: 'sk_test_abcdefghijklmnopqrstuvwxyz123456',
          webhook_url: 'https://atelieolie.com.br/api/webhook',
          integracao_ativa: true,
          ultima_sincronizacao: '2025-05-15T10:30:00'
        });
        
      } catch (error) {
        console.error('Erro ao buscar configurações:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfiguracoes();
  }, []);
  
  // Salvar configurações
  const salvarConfiguracoes = async () => {
    try {
      setLoading(true);
      
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error: errorGeral } = await supabase
      //   .from('configuracoes_gerais')
      //   .update(configGeral)
      //   .eq('id', configGeral?.id);
      
      // if (errorGeral) throw errorGeral;
      
      // const { error: errorNotificacao } = await supabase
      //   .from('configuracoes_notificacoes')
      //   .update(configNotificacao)
      //   .eq('id', configNotificacao?.id);
      
      // if (errorNotificacao) throw errorNotificacao;
      
      // const { error: errorIntegracao } = await supabase
      //   .from('configuracoes_integracoes')
      //   .update(configIntegracao)
      //   .eq('id', configIntegracao?.id);
      
      // if (errorIntegracao) throw errorIntegracao;
      
      console.log('Configurações salvas com sucesso!');
      
      // Sair do modo de edição
      setEditMode(false);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancelar edição
  const cancelarEdicao = () => {
    // Recarregar dados originais
    // fetchConfiguracoes();
    
    // Sair do modo de edição
    setEditMode(false);
  };
  
  // Renderizar conteúdo da aba Geral
  const renderTabGeral = () => {
    if (!configGeral) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Informações da Empresa</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nome_empresa" className="block text-sm font-medium text-gray-700">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  name="nome_empresa"
                  id="nome_empresa"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configGeral.nome_empresa}
                  onChange={(e) => setConfigGeral({...configGeral, nome_empresa: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                  CNPJ
                </label>
                <input
                  type="text"
                  name="cnpj"
                  id="cnpj"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configGeral.cnpj}
                  onChange={(e) => setConfigGeral({...configGeral, cnpj: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label htmlFor="email_contato" className="block text-sm font-medium text-gray-700">
                  Email de Contato
                </label>
                <input
                  type="email"
                  name="email_contato"
                  id="email_contato"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configGeral.email_contato}
                  onChange={(e) => setConfigGeral({...configGeral, email_contato: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <input
                  type="text"
                  name="telefone"
                  id="telefone"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configGeral.telefone}
                  onChange={(e) => setConfigGeral({...configGeral, telefone: e.target.value})}
                  disabled={!editMode}
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700">
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  id="endereco"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configGeral.endereco}
                  onChange={(e) => setConfigGeral({...configGeral, endereco: e.target.value})}
                  disabled={!editMode}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Personalização</h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="cor_primaria" className="block text-sm font-medium text-gray-700">
                  Cor Primária
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    name="cor_primaria"
                    id="cor_primaria"
                    className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    value={configGeral.cores_tema.primaria}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        primaria: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                  <input
                    type="text"
                    className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    value={configGeral.cores_tema.primaria}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        primaria: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cor_secundaria" className="block text-sm font-medium text-gray-700">
                  Cor Secundária
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    name="cor_secundaria"
                    id="cor_secundaria"
                    className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    value={configGeral.cores_tema.secundaria}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        secundaria: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                  <input
                    type="text"
                    className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    value={configGeral.cores_tema.secundaria}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        secundaria: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cor_texto" className="block text-sm font-medium text-gray-700">
                  Cor do Texto
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    name="cor_texto"
                    id="cor_texto"
                    className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                    value={configGeral.cores_tema.texto}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        texto: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                  <input
                    type="text"
                    className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                    value={configGeral.cores_tema.texto}
                    onChange={(e) => setConfigGeral({
                      ...configGeral, 
                      cores_tema: {
                        ...configGeral.cores_tema,
                        texto: e.target.value
                      }
                    })}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700">
                Logo da Empresa
              </label>
              <div className="mt-1 flex items-center">
                <div className="h-20 w-20 border border-gray-300 rounded-md overflow-hidden bg-gray-100">
                  {configGeral.logo_url ? (
                    <img 
                      src={configGeral.logo_url} 
                      alt="Logo da empresa" 
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      Sem logo
                    </div>
                  )}
                </div>
                {editMode && (
                  <button
                    type="button"
                    className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  >
                    Alterar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Notificações
  const renderTabNotificacoes = () => {
    if (!configNotificacao) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações de Notificações</h3>
            <div className="mt-5 space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notificar_estoque_baixo"
                    name="notificar_estoque_baixo"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    checked={configNotificacao.notificar_estoque_baixo}
                    onChange={(e) => setConfigNotificacao({
                      ...configNotificacao,
                      notificar_estoque_baixo: e.target.checked
                    })}
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notificar_estoque_baixo" className="font-medium text-gray-700">
                    Notificar quando estoque estiver baixo
                  </label>
                  <p className="text-gray-500">Receba alertas quando produtos atingirem o estoque mínimo.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notificar_pedidos_novos"
                    name="notificar_pedidos_novos"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    checked={configNotificacao.notificar_pedidos_novos}
                    onChange={(e) => setConfigNotificacao({
                      ...configNotificacao,
                      notificar_pedidos_novos: e.target.checked
                    })}
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notificar_pedidos_novos" className="font-medium text-gray-700">
                    Notificar novos pedidos
                  </label>
                  <p className="text-gray-500">Receba alertas quando novos pedidos forem registrados.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notificar_pagamentos"
                    name="notificar_pagamentos"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    checked={configNotificacao.notificar_pagamentos}
                    onChange={(e) => setConfigNotificacao({
                      ...configNotificacao,
                      notificar_pagamentos: e.target.checked
                    })}
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notificar_pagamentos" className="font-medium text-gray-700">
                    Notificar pagamentos
                  </label>
                  <p className="text-gray-500">Receba alertas sobre pagamentos recebidos ou pendentes.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="notificar_entregas"
                    name="notificar_entregas"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    checked={configNotificacao.notificar_entregas}
                    onChange={(e) => setConfigNotificacao({
                      ...configNotificacao,
                      notificar_entregas: e.target.checked
                    })}
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="notificar_entregas" className="font-medium text-gray-700">
                    Notificar entregas
                  </label>
                  <p className="text-gray-500">Receba alertas sobre status de entregas.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <label htmlFor="email_notificacoes" className="block text-sm font-medium text-gray-700">
                Email para Notificações
              </label>
              <input
                type="email"
                name="email_notificacoes"
                id="email_notificacoes"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                value={configNotificacao.email_notificacoes}
                onChange={(e) => setConfigNotificacao({
                  ...configNotificacao,
                  email_notificacoes: e.target.value
                })}
                disabled={!editMode}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Integrações
  const renderTabIntegracoes = () => {
    if (!configIntegracao) return null;
    
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações de API</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
                  Chave de API
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="password"
                    name="api_key"
                    id="api_key"
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md focus:ring-secondary focus:border-secondary sm:text-sm border-gray-300"
                    value={configIntegracao.api_key}
                    onChange={(e) => setConfigIntegracao({
                      ...configIntegracao,
                      api_key: e.target.value
                    })}
                    disabled={!editMode}
                  />
                  {editMode && (
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    >
                      Gerar Nova
                    </button>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700">
                  URL do Webhook
                </label>
                <input
                  type="text"
                  name="webhook_url"
                  id="webhook_url"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  value={configIntegracao.webhook_url}
                  onChange={(e) => setConfigIntegracao({
                    ...configIntegracao,
                    webhook_url: e.target.value
                  })}
                  disabled={!editMode}
                />
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="integracao_ativa"
                    name="integracao_ativa"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    checked={configIntegracao.integracao_ativa}
                    onChange={(e) => setConfigIntegracao({
                      ...configIntegracao,
                      integracao_ativa: e.target.checked
                    })}
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="integracao_ativa" className="font-medium text-gray-700">
                    Integração Ativa
                  </label>
                  <p className="text-gray-500">Ativar ou desativar a integração com sistemas externos.</p>
                </div>
              </div>
            </div>
            
            {configIntegracao.ultima_sincronizacao && (
              <div className="mt-5 text-sm text-gray-500">
                Última sincronização: {new Date(configIntegracao.ultima_sincronizacao).toLocaleString('pt-BR')}
              </div>
            )}
            
            {editMode && (
              <div className="mt-5">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                >
                  Testar Conexão
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar conteúdo da aba Segurança
  const renderTabSeguranca = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Configurações de Segurança</h3>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="senha_atual" className="block text-sm font-medium text-gray-700">
                  Senha Atual
                </label>
                <input
                  type="password"
                  name="senha_atual"
                  id="senha_atual"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label htmlFor="nova_senha" className="block text-sm font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  name="nova_senha"
                  id="nova_senha"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  disabled={!editMode}
                />
              </div>
              
              <div>
                <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  name="confirmar_senha"
                  id="confirmar_senha"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  disabled={!editMode}
                />
              </div>
            </div>
            
            <div className="mt-5">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="autenticacao_dois_fatores"
                    name="autenticacao_dois_fatores"
                    type="checkbox"
                    className="focus:ring-secondary h-4 w-4 text-secondary border-gray-300 rounded"
                    disabled={!editMode}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="autenticacao_dois_fatores" className="font-medium text-gray-700">
                    Autenticação de Dois Fatores
                  </label>
                  <p className="text-gray-500">Ativar autenticação de dois fatores para maior segurança.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-5">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={!editMode}
              >
                Revogar Todas as Sessões
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Renderizar conteúdo da aba ativa
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'geral':
        return renderTabGeral();
      case 'notificacoes':
        return renderTabNotificacoes();
      case 'integracoes':
        return renderTabIntegracoes();
      case 'seguranca':
        return renderTabSeguranca();
      default:
        return null;
    }
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text">Configurações</h1>
            
            <div className="flex space-x-2">
              {!editMode ? (
                <Button 
                  onClick={() => setEditMode(true)}
                >
                  <Edit size={18} className="mr-1" />
                  Editar Configurações
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={cancelarEdicao}
                  >
                    <X size={18} className="mr-1" />
                    Cancelar
                  </Button>
                  
                  <Button 
                    onClick={salvarConfiguracoes}
                  >
                    <Save size={18} className="mr-1" />
                    Salvar Alterações
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'geral' 
                ? 'border-b-2 border-secondary text-secondary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('geral')}
          >
            <Settings size={16} className="inline mr-2" />
            Geral
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'notificacoes' 
                ? 'border-b-2 border-secondary text-secondary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('notificacoes')}
          >
            <Bell size={16} className="inline mr-2" />
            Notificações
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'integracoes' 
                ? 'border-b-2 border-secondary text-secondary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('integracoes')}
          >
            <Database size={16} className="inline mr-2" />
            Integrações
          </button>
          
          <button
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === 'seguranca' 
                ? 'border-b-2 border-secondary text-secondary' 
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('seguranca')}
          >
            <Shield size={16} className="inline mr-2" />
            Segurança
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando configurações...</div>
          </div>
        ) : (
          renderActiveTabContent()
        )}
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
