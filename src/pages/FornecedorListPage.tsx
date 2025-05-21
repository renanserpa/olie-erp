import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { Search, Plus, Edit, Trash2, FileText, Filter } from 'lucide-react';

// Dados simulados para a listagem de fornecedores
const fornecedoresData = [
  { 
    id: 1, 
    nome_fantasia: 'Tecidos Premium', 
    razao_social: 'Tecidos Premium Ltda', 
    cnpj: '12.345.678/0001-90', 
    telefone: '(11) 98765-4321', 
    email: 'contato@tecidospremium.com.br',
    categoria: 'Tecidos',
    cidade: 'São Paulo',
    estado: 'SP',
    ativo: true
  },
  { 
    id: 2, 
    nome_fantasia: 'Aviamentos Gerais', 
    razao_social: 'Aviamentos Gerais Comércio Ltda', 
    cnpj: '23.456.789/0001-01', 
    telefone: '(11) 97654-3210', 
    email: 'vendas@aviamentosgerais.com.br',
    categoria: 'Aviamentos',
    cidade: 'São Paulo',
    estado: 'SP',
    ativo: true
  },
  { 
    id: 3, 
    nome_fantasia: 'Embalagens Express', 
    razao_social: 'Embalagens Express Indústria Ltda', 
    cnpj: '34.567.890/0001-12', 
    telefone: '(11) 96543-2109', 
    email: 'comercial@embalagensexpress.com.br',
    categoria: 'Embalagens',
    cidade: 'Guarulhos',
    estado: 'SP',
    ativo: true
  },
  { 
    id: 4, 
    nome_fantasia: 'Máquinas & Cia', 
    razao_social: 'Máquinas & Cia Importação Ltda', 
    cnpj: '45.678.901/0001-23', 
    telefone: '(11) 95432-1098', 
    email: 'vendas@maquinasecia.com.br',
    categoria: 'Máquinas e Equipamentos',
    cidade: 'Campinas',
    estado: 'SP',
    ativo: false
  },
  { 
    id: 5, 
    nome_fantasia: 'Serviços Têxteis', 
    razao_social: 'Serviços Têxteis Especializados Ltda', 
    cnpj: '56.789.012/0001-34', 
    telefone: '(11) 94321-0987', 
    email: 'atendimento@servicostexteis.com.br',
    categoria: 'Serviços',
    cidade: 'São Bernardo do Campo',
    estado: 'SP',
    ativo: true
  }
];

// Schema de validação para o formulário de filtro
const filtroSchema = z.object({
  termo_busca: z.string().optional(),
  categoria: z.string().optional(),
  estado: z.string().optional(),
  apenas_ativos: z.boolean().optional()
});

type FiltroFormData = z.infer<typeof filtroSchema>;

// Dados simulados para os selects de filtro
const categorias = [
  { value: '', label: 'Todas as categorias' },
  { value: 'Tecidos', label: 'Tecidos' },
  { value: 'Aviamentos', label: 'Aviamentos' },
  { value: 'Embalagens', label: 'Embalagens' },
  { value: 'Máquinas e Equipamentos', label: 'Máquinas e Equipamentos' },
  { value: 'Serviços', label: 'Serviços' }
];

const estados = [
  { value: '', label: 'Todos os estados' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'PR', label: 'Paraná' }
];

const FornecedorListPage: React.FC = () => {
  // Simulando um usuário com perfil Admin para demonstração
  const userProfile = 'Admin' as const;
  
  const [filteredData, setFilteredData] = React.useState(fornecedoresData);
  const [showFilters, setShowFilters] = React.useState(false);
  
  const { register, handleSubmit } = useForm<FiltroFormData>({
    resolver: zodResolver(filtroSchema),
    defaultValues: {
      apenas_ativos: false
    }
  });
  
  const onSubmitFilter = (data: FiltroFormData) => {
    console.log('Filtros aplicados:', data);
    
    // Simulação de filtragem
    let filtered = [...fornecedoresData];
    
    if (data.termo_busca) {
      const termo = data.termo_busca.toLowerCase();
      filtered = filtered.filter(item => 
        item.nome_fantasia.toLowerCase().includes(termo) || 
        item.razao_social.toLowerCase().includes(termo) || 
        item.cnpj.includes(termo)
      );
    }
    
    if (data.categoria) {
      filtered = filtered.filter(item => item.categoria === data.categoria);
    }
    
    if (data.estado) {
      filtered = filtered.filter(item => item.estado === data.estado);
    }
    
    if (data.apenas_ativos) {
      filtered = filtered.filter(item => item.ativo);
    }
    
    setFilteredData(filtered);
    setShowFilters(false);
  };
  
  return (
    <div className="flex h-screen bg-primary">
      <Sidebar userProfile={userProfile} />
      
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-text">Fornecedores</h1>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-1" />
                Filtros
              </Button>
              
              <Button size="sm">
                <Plus size={18} className="mr-1" />
                Novo Fornecedor
              </Button>
            </div>
          </div>
          
          {/* Área de filtros */}
          {showFilters && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="text-lg font-semibold text-text mb-4">Filtrar Fornecedores</h3>
              
              <form onSubmit={handleSubmit(onSubmitFilter)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Busca
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                      placeholder="Nome, Razão Social ou CNPJ"
                      {...register('termo_busca')}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Categoria
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('categoria')}
                  >
                    {categorias.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Estado
                  </label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-secondary focus:border-secondary"
                    {...register('estado')}
                  >
                    {estados.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <div className="flex items-center h-10">
                    <input
                      id="apenas_ativos"
                      type="checkbox"
                      className="h-4 w-4 text-secondary focus:ring-secondary border-gray-300 rounded"
                      {...register('apenas_ativos')}
                    />
                    <label htmlFor="apenas_ativos" className="ml-2 block text-sm text-text">
                      Apenas ativos
                    </label>
                  </div>
                  
                  <div className="ml-auto">
                    <Button type="submit" size="sm">
                      Aplicar Filtros
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
          
          {/* Tabela de fornecedores */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome Fantasia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CNPJ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cidade/UF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((fornecedor) => (
                  <tr key={fornecedor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-text">{fornecedor.nome_fantasia}</div>
                        <div className="text-xs text-gray-500">{fornecedor.razao_social}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {fornecedor.cnpj}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {fornecedor.telefone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {fornecedor.categoria}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {fornecedor.cidade}/{fornecedor.estado}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        fornecedor.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fornecedor.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-secondary hover:text-secondary/80 mr-3">
                        <FileText size={18} />
                      </button>
                      <button className="text-secondary hover:text-secondary/80 mr-3">
                        <Edit size={18} />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Nenhum fornecedor encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Mostrando {filteredData.length} de {fornecedoresData.length} fornecedores
            </div>
            
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50">
                Anterior
              </button>
              <button className="px-3 py-1 bg-secondary text-white rounded-md text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                Próxima
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FornecedorListPage;
