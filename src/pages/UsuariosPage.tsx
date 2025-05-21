import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, Trash2, UserPlus, UserCheck, UserX, Shield, Mail, Key } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

// Tipos de dados
interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfil: 'admin' | 'proprietario' | 'editor' | 'cliente';
  perfil_id: string; // ID real da role no Wix
  status: 'ativo' | 'inativo' | 'pendente';
  ultimo_acesso?: string;
  avatar_url?: string;
  departamento?: string;
  cargo?: string;
  telefone?: string;
}

const UsuariosPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState({
    perfil: '',
    status: '',
    departamento: '',
    busca: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  
  // Mapeamento de IDs de perfis do Wix
  const perfilIdMap = {
    'admin': '7325205886407729212',
    'cliente': '6612722526048361472',
    'editor': '6600344420111308827',
    'proprietario': '6601492336091027458'
  };
  
  // Buscar usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        
        // Em um ambiente real, isso viria do Supabase
        // Simulando dados para demonstração
        const usuariosSimulados: Usuario[] = [
          {
            id: 1,
            nome: 'Ana Silva',
            email: 'ana.silva@example.com',
            perfil: 'admin',
            perfil_id: perfilIdMap.admin,
            status: 'ativo',
            ultimo_acesso: '2025-05-19T14:30:00',
            avatar_url: 'https://example.com/avatars/ana.jpg',
            departamento: 'Administração',
            cargo: 'Gerente',
            telefone: '(11) 98765-4321'
          },
          {
            id: 2,
            nome: 'Carlos Oliveira',
            email: 'carlos.oliveira@example.com',
            perfil: 'editor',
            perfil_id: perfilIdMap.editor,
            status: 'ativo',
            ultimo_acesso: '2025-05-18T09:15:00',
            avatar_url: 'https://example.com/avatars/carlos.jpg',
            departamento: 'Produção',
            cargo: 'Supervisor',
            telefone: '(11) 91234-5678'
          },
          {
            id: 3,
            nome: 'Mariana Santos',
            email: 'mariana.santos@example.com',
            perfil: 'cliente',
            perfil_id: perfilIdMap.cliente,
            status: 'ativo',
            ultimo_acesso: '2025-05-15T16:45:00',
            avatar_url: 'https://example.com/avatars/mariana.jpg',
            telefone: '(11) 99876-5432'
          },
          {
            id: 4,
            nome: 'Roberto Almeida',
            email: 'roberto.almeida@example.com',
            perfil: 'proprietario',
            perfil_id: perfilIdMap.proprietario,
            status: 'ativo',
            ultimo_acesso: '2025-05-19T11:20:00',
            avatar_url: 'https://example.com/avatars/roberto.jpg',
            departamento: 'Diretoria',
            cargo: 'Diretor',
            telefone: '(11) 97654-3210'
          },
          {
            id: 5,
            nome: 'Juliana Costa',
            email: 'juliana.costa@example.com',
            perfil: 'editor',
            perfil_id: perfilIdMap.editor,
            status: 'inativo',
            ultimo_acesso: '2025-04-30T08:10:00',
            avatar_url: 'https://example.com/avatars/juliana.jpg',
            departamento: 'Vendas',
            cargo: 'Vendedora',
            telefone: '(11) 95432-1098'
          },
          {
            id: 6,
            nome: 'Fernando Gomes',
            email: 'fernando.gomes@example.com',
            perfil: 'cliente',
            perfil_id: perfilIdMap.cliente,
            status: 'pendente',
            avatar_url: 'https://example.com/avatars/fernando.jpg',
            telefone: '(11) 93210-9876'
          },
          {
            id: 7,
            nome: 'Patricia Lima',
            email: 'patricia.lima@example.com',
            perfil: 'editor',
            perfil_id: perfilIdMap.editor,
            status: 'ativo',
            ultimo_acesso: '2025-05-17T13:25:00',
            avatar_url: 'https://example.com/avatars/patricia.jpg',
            departamento: 'Produção',
            cargo: 'Costureira',
            telefone: '(11) 98901-2345'
          },
          {
            id: 8,
            nome: 'Lucas Martins',
            email: 'lucas.martins@example.com',
            perfil: 'cliente',
            perfil_id: perfilIdMap.cliente,
            status: 'ativo',
            ultimo_acesso: '2025-05-10T17:40:00',
            avatar_url: 'https://example.com/avatars/lucas.jpg',
            telefone: '(11) 96789-0123'
          }
        ];
        
        setUsuarios(usuariosSimulados);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsuarios();
  }, []);
  
  // Filtrar usuários
  const usuariosFiltered = usuarios.filter(usuario => {
    // Filtro por perfil
    if (filtro.perfil && usuario.perfil !== filtro.perfil) {
      return false;
    }
    
    // Filtro por status
    if (filtro.status && usuario.status !== filtro.status) {
      return false;
    }
    
    // Filtro por departamento
    if (filtro.departamento && usuario.departamento !== filtro.departamento) {
      return false;
    }
    
    // Filtro por busca (nome ou email)
    if (filtro.busca) {
      const termoBusca = filtro.busca.toLowerCase();
      const nomeMatch = usuario.nome.toLowerCase().includes(termoBusca);
      const emailMatch = usuario.email.toLowerCase().includes(termoBusca);
      
      if (!nomeMatch && !emailMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  // Formatar data
  const formatarData = (dataString?: string) => {
    if (!dataString) return 'Nunca acessou';
    
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };
  
  // Traduzir perfil
  const traduzirPerfil = (perfil: Usuario['perfil']) => {
    switch (perfil) {
      case 'admin':
        return 'Administrador';
      case 'proprietario':
        return 'Proprietário';
      case 'editor':
        return 'Editor';
      case 'cliente':
        return 'Cliente';
      default:
        return perfil;
    }
  };
  
  // Atualizar status do usuário
  const atualizarStatus = async (id: number, novoStatus: Usuario['status']) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('usuarios')
      //   .update({ status: novoStatus })
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const usuariosAtualizados = usuarios.map(u => 
        u.id === id ? { ...u, status: novoStatus } : u
      );
      
      setUsuarios(usuariosAtualizados);
      
      console.log(`Usuário ${id} atualizado para ${novoStatus}`);
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
    }
  };
  
  // Excluir usuário
  const excluirUsuario = async (id: number) => {
    try {
      // Em um ambiente real, isso seria salvo no Supabase
      // const { error } = await supabase
      //   .from('usuarios')
      //   .delete()
      //   .eq('id', id);
      
      // if (error) throw error;
      
      // Atualizar localmente
      const usuariosAtualizados = usuarios.filter(u => u.id !== id);
      
      setUsuarios(usuariosAtualizados);
      
      console.log(`Usuário ${id} excluído`);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };
  
  // Enviar convite
  const enviarConvite = async (id: number) => {
    try {
      const usuario = usuarios.find(u => u.id === id);
      
      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }
      
      // Em um ambiente real, isso enviaria um email de convite
      console.log(`Convite enviado para ${usuario.email}`);
      
      // Atualizar status para pendente
      atualizarStatus(id, 'pendente');
    } catch (error) {
      console.error('Erro ao enviar convite:', error);
    }
  };
  
  // Renderizar avatar
  const renderAvatar = (usuario: Usuario) => {
    if (usuario.avatar_url) {
      return (
        <img 
          src={usuario.avatar_url} 
          alt={`Avatar de ${usuario.nome}`} 
          className="h-10 w-10 rounded-full"
        />
      );
    }
    
    // Avatar com iniciais
    const iniciais = usuario.nome
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    
    return (
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-white font-medium">
        {iniciais}
      </div>
    );
  };
  
  // Renderizar ícone de perfil
  const renderIconePerfil = (perfil: Usuario['perfil']) => {
    switch (perfil) {
      case 'admin':
        return <Shield size={16} className="text-red-500" />;
      case 'proprietario':
        return <Shield size={16} className="text-purple-500" />;
      case 'editor':
        return <Edit size={16} className="text-blue-500" />;
      case 'cliente':
        return <UserCheck size={16} className="text-green-500" />;
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
            <h1 className="text-2xl font-bold text-text">Usuários</h1>
            
            <div className="flex space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                  placeholder="Buscar nome ou email..."
                  value={filtro.busca}
                  onChange={(e) => setFiltro(prev => ({ ...prev, busca: e.target.value }))}
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFiltros(!showFiltros)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              <Button size="sm">
                <UserPlus size={18} className="mr-1" />
                Novo Usuário
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFiltros && (
            <div className="mt-4 p-4 bg-white rounded-md shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.perfil}
                    onChange={(e) => setFiltro(prev => ({ ...prev, perfil: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="admin">Administrador</option>
                    <option value="proprietario">Proprietário</option>
                    <option value="editor">Editor</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.status}
                    onChange={(e) => setFiltro(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="pendente">Pendente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    value={filtro.departamento}
                    onChange={(e) => setFiltro(prev => ({ ...prev, departamento: e.target.value }))}
                  >
                    <option value="">Todos</option>
                    <option value="Administração">Administração</option>
                    <option value="Produção">Produção</option>
                    <option value="Vendas">Vendas</option>
                    <option value="Diretoria">Diretoria</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                  onClick={() => setFiltro({ perfil: '', status: '', departamento: '', busca: '' })}
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Carregando usuários...</div>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  usuariosFiltered.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            {renderAvatar(usuario)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {usuario.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {usuario.email}
                            </div>
                            {usuario.telefone && (
                              <div className="text-xs text-gray-400">
                                {usuario.telefone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {renderIconePerfil(usuario.perfil)}
                          </div>
                          <div className="text-sm text-gray-900">
                            {traduzirPerfil(usuario.perfil)}
                          </div>
                        </div>
                        {usuario.departamento && usuario.cargo && (
                          <div className="text-xs text-gray-500">
                            {usuario.departamento} - {usuario.cargo}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          usuario.status === 'ativo' 
                            ? 'bg-green-100 text-green-800' 
                            : usuario.status === 'inativo'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {usuario.status === 'ativo' ? 'Ativo' : usuario.status === 'inativo' ? 'Inativo' : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(usuario.ultimo_acesso)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {usuario.status === 'pendente' && (
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="Reenviar convite"
                              onClick={() => enviarConvite(usuario.id)}
                            >
                              <Mail size={18} />
                            </button>
                          )}
                          
                          {usuario.status === 'inativo' && (
                            <button
                              className="text-green-600 hover:text-green-900"
                              title="Ativar usuário"
                              onClick={() => atualizarStatus(usuario.id, 'ativo')}
                            >
                              <UserCheck size={18} />
                            </button>
                          )}
                          
                          {usuario.status === 'ativo' && (
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Desativar usuário"
                              onClick={() => atualizarStatus(usuario.id, 'inativo')}
                            >
                              <UserX size={18} />
                            </button>
                          )}
                          
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Redefinir senha"
                          >
                            <Key size={18} />
                          </button>
                          
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                            onClick={() => excluirUsuario(usuario.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsuariosPage;
