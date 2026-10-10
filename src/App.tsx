import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { TechnicalAssistanceSection } from './components/TechnicalAssistanceSection';
import { AssistanceRequestModal } from './components/AssistanceRequestModal';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Product, Category, Order } from './types';
import { api } from './services/api';
import { 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Search, 
  CheckCircle2, 
  Layers, 
  Wrench,
  Smartphone,
  Headphones,
  Keyboard,
  BatteryCharging,
  Cpu,
  PackageX
} from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const { isOpen: isCartOpen, setIsOpen: setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // View & navigation
  const [activeTab, setActiveTab] = useState<'inicio' | 'loja'>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('novidades');
  const [filterInStockOnly, setFilterInStockOnly] = useState<boolean>(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isAssistanceModalOpen, setIsAssistanceModalOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Load data from server
  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        api.getProducts({ includeInactive: false }),
        api.getCategories()
      ]);
      setProducts(prods);
      setCategories(cats);

      if (isAdmin) {
        try {
          const ords = await api.getOrders();
          setOrders(ords);
        } catch {
          // not authorized yet
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAdmin]);

  // Filter products for catalog
  const filteredProducts = products.filter((p) => {
    // Category filter
    if (selectedCategory !== 'todas' && p.categoryId !== selectedCategory) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      const match = p.name.toLowerCase().includes(term) ||
                    p.description.toLowerCase().includes(term) ||
                    p.sku.toLowerCase().includes(term);
      if (!match) return false;
    }
    // In stock only
    if (filterInStockOnly && p.stock <= 0) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const priceA = a.promoPrice || a.price;
    const priceB = b.promoPrice || b.price;

    if (sortOption === 'preco-asc') return priceA - priceB;
    if (sortOption === 'preco-desc') return priceB - priceA;
    if (sortOption === 'nome-asc') return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const featuredProducts = products.filter(p => p.featured && p.active);
  const promoProducts = products.filter(p => p.promoPrice && p.promoPrice > 0 && p.active);

  const handleOpenAdminTrigger = () => {
    if (isAdmin) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleOrderCompleted = (createdOrder: Order) => {
    setTrackingOrder(createdOrder);
    setIsTrackingModalOpen(true);
    loadData(); // refresh stock on storefront
  };

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('smart') || slug.includes('celular')) return <Smartphone className="w-4 h-4 text-[#D8AE35]" />;
    if (slug.includes('audio') || slug.includes('fone')) return <Headphones className="w-4 h-4 text-[#D8AE35]" />;
    if (slug.includes('periferico') || slug.includes('teclado')) return <Keyboard className="w-4 h-4 text-[#D8AE35]" />;
    if (slug.includes('carregador') || slug.includes('cabo')) return <BatteryCharging className="w-4 h-4 text-[#D8AE35]" />;
    return <Cpu className="w-4 h-4 text-[#D8AE35]" />;
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col font-sans selection:bg-[#D8AE35] selection:text-black">
      
      {/* Global Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenAssistance={() => setIsAssistanceModalOpen(true)}
        onOpenTracking={() => {
          setTrackingOrder(null);
          setIsTrackingModalOpen(true);
        }}
        onSearch={(term) => {
          setSearchQuery(term);
          setActiveTab('loja');
        }}
        activeTab={activeTab}
        setActiveTab={(t: any) => setActiveTab(t)}
      />

      {/* Main View Container */}
      <main className="flex-1">
        
        {/* ===================== VIEW 1: HOME (INÍCIO) ===================== */}
        {activeTab === 'inicio' && (
          <div>
            {/* Hero Banner */}
            <HeroBanner
              onExploreProducts={() => {
                setActiveTab('loja');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onRequestAssistance={() => setIsAssistanceModalOpen(true)}
            />

            {/* Quick Categories Bar */}
            <section className="border-b border-neutral-800/80 bg-[#0e0e0e] py-6 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Principais Departamentos
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCategory('todas');
                      setActiveTab('loja');
                    }}
                    className="text-xs text-[#D8AE35] hover:underline cursor-pointer flex items-center gap-1 font-semibold"
                  >
                    <span>Ver catálogo completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.categoryId === cat.id && p.active).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setActiveTab('loja');
                        }}
                        className="p-3.5 rounded-xl bg-[#141414] border border-neutral-800 hover:border-[#D8AE35]/60 hover:bg-[#181818] transition-all text-left flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="p-2 rounded-lg bg-[#1a1a1a] border border-neutral-800 group-hover:scale-105 transition-transform">
                          {getCategoryIcon(cat.slug)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate group-hover:text-[#D8AE35] transition-colors">
                            {cat.name}
                          </h4>
                          <span className="text-[11px] text-neutral-500 font-mono-numbers">
                            {count} {count === 1 ? 'produto' : 'produtos'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Featured Products Collection */}
            <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="catalogo">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D8AE35] mb-1.5">
                    <span>Linha de Destaques</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="text-neutral-400">Seleção Oficial MS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Equipamentos Mais Procurados
                  </h2>
                </div>

                <button
                  onClick={() => setActiveTab('loja')}
                  className="px-4 py-2 rounded-lg bg-[#161616] hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors flex items-center gap-2 cursor-pointer w-fit"
                >
                  <span>Explorar todos os {products.length} itens</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#D8AE35]" />
                </button>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-neutral-400">
                  Carregando vitrine de produtos...
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6)).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                      categoryName={categories.find(c => c.id === prod.categoryId)?.name}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Special Promo Deals Section (when available) */}
            {promoProducts.length > 0 && (
              <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#0c0c0c] border-y border-neutral-800/80" id="ofertas">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#ED1027] mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#ED1027]" />
                        <span>Ofertas por Tempo Limitado</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        Oportunidades com Desconto Real
                      </h2>
                    </div>

                    <span className="text-xs text-neutral-400 font-mono-numbers hidden sm:inline">
                      {promoProducts.length} itens com preço reduzido
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promoProducts.slice(0, 3).map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelect={(p) => setSelectedProduct(p)}
                        categoryName={categories.find(c => c.id === prod.categoryId)?.name}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Technical Assistance Laboratory Section */}
            <TechnicalAssistanceSection
              onRequestQuote={() => setIsAssistanceModalOpen(true)}
            />

          </div>
        )}

        {/* ===================== VIEW 2: FULL CATALOG (LOJA) ===================== */}
        {activeTab === 'loja' && (
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Catalog Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
                <button 
                  onClick={() => setActiveTab('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Início
                </button>
                <span>/</span>
                <span className="text-[#D8AE35]">Catálogo Completo</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Produtos Disponíveis
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                Filtre por categoria, pesquise por modelo ou ordene de acordo com sua preferência.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-xl bg-[#141414] border border-neutral-800 mb-8 space-y-4">
              
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Pesquisar produto, modelo ou SKU..."
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#D8AE35]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-neutral-400 hover:text-white text-xs"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Sort and Stock Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={filterInStockOnly}
                      onChange={(e) => setFilterInStockOnly(e.target.checked)}
                      className="accent-[#D8AE35] w-4 h-4 cursor-pointer"
                    />
                    <span>Apenas em Estoque</span>
                  </label>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Ordenar por:</span>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="bg-[#181818] border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D8AE35]"
                    >
                      <option value="novidades">Novidades</option>
                      <option value="preco-asc">Menor Preço</option>
                      <option value="preco-desc">Maior Preço</option>
                      <option value="nome-asc">Nome (A - Z)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-neutral-800/80">
                <button
                  onClick={() => setSelectedCategory('todas')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === 'todas'
                      ? 'bg-[#D8AE35] text-black shadow-sm'
                      : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  Todas as Categorias ({products.length})
                </button>

                {categories.map((cat) => {
                  const count = products.filter(p => p.categoryId === cat.id && p.active).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#D8AE35] text-black shadow-sm'
                          : 'bg-[#181818] text-neutral-400 hover:text-white hover:bg-neutral-800'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-[#121212] rounded-2xl border border-neutral-800">
                <div className="w-14 h-14 rounded-full bg-neutral-800/60 flex items-center justify-center text-neutral-500 mx-auto">
                  <PackageX className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Nenhum produto encontrado</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Tente alterar os filtros de busca ou remover as restrições para encontrar o equipamento desejado.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('todas');
                    setSearchQuery('');
                    setFilterInStockOnly(false);
                  }}
                  className="px-4 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Redefinir Filtros
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs text-neutral-400 mb-4 flex items-center justify-between">
                  <span>Exibindo <strong>{filteredProducts.length}</strong> produtos</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onSelect={(p) => setSelectedProduct(p)}
                      categoryName={categories.find(c => c.id === prod.categoryId)?.name}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Global Footer */}
      <Footer
        onOpenAdmin={handleOpenAdminTrigger}
        onOpenAssistance={() => setIsAssistanceModalOpen(true)}
        onOpenTracking={() => {
          setTrackingOrder(null);
          setIsTrackingModalOpen(true);
        }}
      />

      {/* ===================== OVERLAYS & MODALS ===================== */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        categoryName={categories.find(c => c.id === selectedProduct?.categoryId)?.name}
        relatedProducts={products.filter(p => p.categoryId === selectedProduct?.categoryId && p.id !== selectedProduct?.id)}
        onSelectRelated={(p) => setSelectedProduct(p)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        order={trackingOrder}
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        onOrderUpdated={(upd) => setTrackingOrder(upd)}
      />

      {/* Technical Assistance Quote Request Modal */}
      <AssistanceRequestModal
        isOpen={isAssistanceModalOpen}
        onClose={() => setIsAssistanceModalOpen(false)}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminPanelOpen(true);
          loadData();
        }}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        products={products}
        categories={categories}
        orders={orders}
        onRefreshAll={loadData}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainStoreContent />
      </CartProvider>
    </AuthProvider>
  );
}
