import React, { useState } from 'react';
import { ShoppingBag, Search, Wrench, ShieldCheck, UserCheck, Package, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenAssistance: () => void;
  onOpenTracking: () => void;
  onSearch: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenAdmin,
  onOpenAssistance,
  onOpenTracking,
  onSearch,
  activeTab,
  setActiveTab
}) => {
  const { totalItems } = useCart();
  const { isAdmin, user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    if (activeTab !== 'loja') {
      setActiveTab('loja');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090909]/95 backdrop-blur-md border-b border-neutral-800/80 transition-all">
      {/* Top micro announcement bar */}
      <div className="bg-[#121212] border-b border-neutral-800/50 py-1.5 px-4 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-[#D8AE35] font-medium">MS MULTI SERVICES</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>Loja Oficial & Assistência Especializada</span>
            <span aria-hidden="true" className="text-neutral-600 hidden md:inline">·</span>
            <span className="hidden md:inline text-neutral-300">Frete Grátis nas compras acima de R$ 299</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400 text-xs">
            <button 
              onClick={onOpenTracking}
              className="hover:text-[#D8AE35] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Rastrear Pedido</span>
            </button>
            <span aria-hidden="true" className="text-neutral-700">|</span>
            <button
              onClick={onOpenAssistance}
              className="hover:text-[#D8AE35] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5 text-[#D8AE35]" />
              <span className="text-neutral-200">Orçamento Assistência</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation complying with Top Bar Contract: Zone 1 - Zone 2 - Zone 3 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text/logo element brand zone */}
        <div 
          onClick={() => { setActiveTab('inicio'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer select-none shrink-0"
        >
          <img 
            src="https://i.postimg.cc/MTnJQTSJ/MS.jpg" 
            alt="MS Multi Services Logotipo" 
            className="h-12 w-auto object-contain rounded-md border border-neutral-700/60 shadow-md"
          />
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-white text-lg sm:text-xl font-display leading-tight flex items-center gap-1.5">
              MS <span className="text-[#D8AE35]">MULTI SERVICES</span>
            </span>
            <span className="text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
              E-Commerce & Tecnologia
            </span>
          </div>
        </div>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'inicio' ? 'text-[#D8AE35] border-b-2 border-[#D8AE35] font-semibold' : 'hover:text-white'
            }`}
          >
            Início
          </button>
          <button
            onClick={() => setActiveTab('loja')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'loja' ? 'text-[#D8AE35] border-b-2 border-[#D8AE35] font-semibold' : 'hover:text-white'
            }`}
          >
            Catálogo de Produtos
          </button>
          <button
            onClick={onOpenAssistance}
            className="whitespace-nowrap transition-colors hover:text-white cursor-pointer py-1 flex items-center gap-1.5"
          >
            <span>Assistência Técnica</span>
          </button>
          <button
            onClick={onOpenTracking}
            className="whitespace-nowrap transition-colors hover:text-white cursor-pointer py-1"
          >
            Rastreio de Pedidos
          </button>
        </nav>

        {/* Zone 3: Search, Cart, Admin toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar smartphone, fone, SSD..."
                  autoFocus
                  className="w-48 sm:w-64 bg-[#171717] border border-neutral-700 text-white text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#D8AE35] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-neutral-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                title="Pesquisar produtos"
                className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Cart button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir carrinho de compras"
            className="relative flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#171717] hover:bg-neutral-800 border border-neutral-700 hover:border-[#D8AE35]/60 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#D8AE35]" />
            <span className="hidden sm:inline">Carrinho</span>
            {totalItems > 0 && (
              <span className="bg-[#ED1027] text-white text-[11px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center font-mono-numbers">
                {totalItems}
              </span>
            )}
          </button>

          {/* Admin toggle button */}
          <button
            onClick={onOpenAdmin}
            title={isAdmin ? `Painel Administrativo (${user?.name})` : "Acesso Administrativo"}
            className={`p-2 rounded-lg border transition-all cursor-pointer ${
              isAdmin 
                ? 'bg-[#D8AE35]/15 border-[#D8AE35] text-[#D8AE35] hover:bg-[#D8AE35]/25' 
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
            }`}
          >
            {isAdmin ? <UserCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden border-t border-neutral-800/80 bg-[#0c0c0c] px-4 py-2 flex items-center justify-around text-xs font-medium">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`px-3 py-1.5 rounded-md ${activeTab === 'inicio' ? 'text-[#D8AE35] font-semibold bg-[#171717]' : 'text-neutral-400'}`}
        >
          Início
        </button>
        <button
          onClick={() => setActiveTab('loja')}
          className={`px-3 py-1.5 rounded-md ${activeTab === 'loja' ? 'text-[#D8AE35] font-semibold bg-[#171717]' : 'text-neutral-400'}`}
        >
          Produtos
        </button>
        <button
          onClick={onOpenAssistance}
          className="px-3 py-1.5 rounded-md text-neutral-400 hover:text-[#D8AE35]"
        >
          Assistência
        </button>
        <button
          onClick={onOpenTracking}
          className="px-3 py-1.5 rounded-md text-neutral-400"
        >
          Rastreio
        </button>
      </div>
    </header>
  );
};
