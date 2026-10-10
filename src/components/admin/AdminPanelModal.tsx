import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Wrench, 
  FolderTree, 
  Sliders, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product, Category, Order } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminStock } from './AdminStock';
import { AdminOrders } from './AdminOrders';
import { AdminAssistance } from './AdminAssistance';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  categories: Category[];
  orders: Order[];
  onRefreshAll: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  products,
  categories,
  orders,
  onRefreshAll
}) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produtos' | 'estoque' | 'pedidos' | 'os' | 'categorias' | 'configuracoes'>('dashboard');

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-md flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-[#121212] border-b border-neutral-800 px-6 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/MTnJQTSJ/MS.jpg"
            alt="MS Multi Services"
            className="h-8 w-auto rounded border border-neutral-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">Painel de Controle MS</h1>
              <span className="text-[10px] font-mono font-bold bg-[#D8AE35]/20 text-[#D8AE35] px-2 py-0.5 rounded">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">Logado como: {user?.name || 'Administrador'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#181818] hover:bg-neutral-800 text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D8AE35]" />
            <span>Ver Loja</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/40 text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Sair do painel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-[#0d0d0d] border-b md:border-b-0 md:border-r border-neutral-800 p-4 space-y-1.5 shrink-0 overflow-y-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>Visão Geral (Dashboard)</span>
          </button>

          <button
            onClick={() => setActiveTab('produtos')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'produtos'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>Produtos & Catálogo</span>
          </button>

          <button
            onClick={() => setActiveTab('estoque')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'estoque'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Controle de Estoque</span>
          </button>

          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pedidos'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Pedidos & Vendas</span>
          </button>

          <button
            onClick={() => setActiveTab('os')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'os'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <span>Ordens de Serviço (OS)</span>
          </button>

          <button
            onClick={() => setActiveTab('categorias')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'categorias'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <FolderTree className="w-4 h-4 shrink-0" />
            <span>Categorias</span>
          </button>

          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'configuracoes'
                ? 'bg-[#D8AE35] text-black shadow-md shadow-[#D8AE35]/20'
                : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            <span>Configurações</span>
          </button>
        </aside>

        {/* Tab Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090909]">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <AdminDashboard onNavigateTab={(t: any) => setActiveTab(t)} />
            )}
            {activeTab === 'produtos' && (
              <AdminProducts products={products} categories={categories} onRefresh={onRefreshAll} />
            )}
            {activeTab === 'estoque' && (
              <AdminStock products={products} onRefresh={onRefreshAll} />
            )}
            {activeTab === 'pedidos' && (
              <AdminOrders orders={orders} onRefresh={onRefreshAll} />
            )}
            {activeTab === 'os' && (
              <AdminAssistance />
            )}
            {activeTab === 'categorias' && (
              <AdminCategories categories={categories} onRefresh={onRefreshAll} />
            )}
            {activeTab === 'configuracoes' && (
              <AdminSettings />
            )}
          </div>
        </main>

      </div>
    </div>
  );
};
