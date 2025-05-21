import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Package, 
  ShoppingCart, 
  Truck, 
  DollarSign, 
  Settings, 
  UserCog,
  Briefcase,
  PlusCircle,
  LogOut
} from 'lucide-react';

// Definição dos tipos de perfil de usuário
type UserProfile = 'Admin' | 'Produção' | 'Financeiro' | 'Compras' | 'RH' | 'Logística';

// Interface para os itens do menu
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  allowedProfiles: UserProfile[];
}

interface SidebarProps {
  userProfile: UserProfile;
}

const Sidebar: React.FC<SidebarProps> = ({ userProfile }) => {
  const location = useLocation();
  
  // Definição dos itens do menu com suas permissões
  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Home size={20} />,
      allowedProfiles: ['Admin', 'Produção', 'Financeiro', 'Compras', 'RH', 'Logística']
    },
    {
      name: 'Fornecedores',
      path: '/fornecedores',
      icon: <Briefcase size={20} />,
      allowedProfiles: ['Admin', 'Compras']
    },
    {
      name: 'Estoque',
      path: '/estoque',
      icon: <Package size={20} />,
      allowedProfiles: ['Admin', 'Produção', 'Compras']
    },
    {
      name: 'Clientes',
      path: '/clientes',
      icon: <Users size={20} />,
      allowedProfiles: ['Admin']
    },
    {
      name: 'Pedidos',
      path: '/pedidos',
      icon: <ShoppingCart size={20} />,
      allowedProfiles: ['Admin', 'Produção', 'Logística']
    },
    {
      name: 'Produção',
      path: '/producao',
      icon: <Package size={20} />,
      allowedProfiles: ['Admin', 'Produção']
    },
    {
      name: 'Compras',
      path: '/compras',
      icon: <ShoppingCart size={20} />,
      allowedProfiles: ['Admin', 'Compras', 'Financeiro']
    },
    {
      name: 'Financeiro',
      path: '/financeiro',
      icon: <DollarSign size={20} />,
      allowedProfiles: ['Admin', 'Financeiro']
    },
    {
      name: 'Logística',
      path: '/logistica',
      icon: <Truck size={20} />,
      allowedProfiles: ['Admin', 'Logística']
    },
    {
      name: 'RH',
      path: '/rh',
      icon: <UserCog size={20} />,
      allowedProfiles: ['Admin', 'RH']
    },
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: <Settings size={20} />,
      allowedProfiles: ['Admin', 'RH']
    }
  ];
  
  // Filtra os itens do menu com base no perfil do usuário
  const filteredMenuItems = menuItems.filter(item => 
    item.allowedProfiles.includes(userProfile)
  );
  
  return (
    <div className="h-screen w-64 bg-white shadow-md flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-secondary">Olie ERP</h1>
        <p className="text-sm text-gray-500">Perfil: {userProfile}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-secondary text-white' 
                      : 'text-text hover:bg-primary hover:text-secondary'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center justify-center w-full p-2 bg-primary text-secondary rounded-md hover:bg-primary/80 transition-colors">
          <PlusCircle size={20} className="mr-2" />
          <span>+ Novo</span>
        </button>
        
        <button className="flex items-center justify-center w-full p-2 mt-4 text-gray-600 hover:text-red-500 transition-colors">
          <LogOut size={20} className="mr-2" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
