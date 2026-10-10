import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, ShoppingCart, DollarSign, Wrench, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats } from '../../types';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-xs text-neutral-400">
        Carregando indicadores em tempo real...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Products */}
        <div 
          onClick={() => onNavigateTab('produtos')}
          className="p-5 rounded-xl bg-[#161616] border border-neutral-800 hover:border-[#D8AE35]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Produtos Ativos</span>
            <div className="p-2 bg-[#1f1f1f] rounded-lg text-[#D8AE35] group-hover:scale-105 transition-transform">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats.activeProducts} <span className="text-xs text-neutral-500 font-normal">/ {stats.totalProducts} total</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 mt-2">
            <span>Ver catálogo completo</span>
            <ArrowUpRight className="w-3 h-3 text-[#D8AE35]" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => onNavigateTab('estoque')}
          className="p-5 rounded-xl bg-[#161616] border border-neutral-800 hover:border-amber-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Estoque Crítico</span>
            <div className="p-2 bg-amber-950/40 border border-amber-800/40 rounded-lg text-amber-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono-numbers">
            {stats.lowStockProducts + stats.outOfStockProducts}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            {stats.outOfStockProducts} zerados · {stats.lowStockProducts} abaixo do mínimo
          </div>
        </div>

        {/* Orders */}
        <div 
          onClick={() => onNavigateTab('pedidos')}
          className="p-5 rounded-xl bg-[#161616] border border-neutral-800 hover:border-[#D8AE35]/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Pedidos</span>
            <div className="p-2 bg-[#1f1f1f] rounded-lg text-[#D8AE35] group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats.totalOrders}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            {stats.pendingOrders} pendentes de separação/envio
          </div>
        </div>

        {/* Total Revenue */}
        <div 
          onClick={() => onNavigateTab('pedidos')}
          className="p-5 rounded-xl bg-[#161616] border border-neutral-800 hover:border-emerald-500/60 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Vendas Aprovadas</span>
            <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-400 group-hover:scale-105 transition-transform">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono-numbers">
            R$ {stats.approvedSalesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Compensadas via Pix e Cartão
          </div>
        </div>

      </div>

      {/* Two Column Section: Recent Orders & Low Stock List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="p-5 rounded-xl bg-[#161616] border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#D8AE35]" />
              Pedidos Recentes
            </h3>
            <button
              onClick={() => onNavigateTab('pedidos')}
              className="text-xs text-[#D8AE35] hover:underline cursor-pointer font-medium"
            >
              Ver todos
            </button>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              Nenhum pedido registrado até o momento.
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.recentOrders.map((ord) => (
                <div 
                  key={ord.id}
                  onClick={() => onNavigateTab('pedidos')}
                  className="p-3 rounded-lg bg-[#121212] border border-neutral-800 hover:border-neutral-700 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer"
                >
                  <div>
                    <span className="font-mono-numbers font-bold text-white">{ord.orderNumber}</span>
                    <span className="text-neutral-400 block text-[11px]">{ord.customer.name} · {ord.items.length} itens</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono-numbers font-bold text-white block">
                      R$ {ord.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      ord.paymentStatus === 'aprovado' ? 'text-emerald-400 bg-emerald-950/60' : 'text-amber-400 bg-amber-950/60'
                    }`}>
                      {ord.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts Table */}
        <div className="p-5 rounded-xl bg-[#161616] border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Produtos com Reposição Necessária
            </h3>
            <button
              onClick={() => onNavigateTab('estoque')}
              className="text-xs text-[#D8AE35] hover:underline cursor-pointer font-medium"
            >
              Gerenciar estoque
            </button>
          </div>

          {stats.lowStockList.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Todos os produtos possuem níveis de estoque saudáveis!</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {stats.lowStockList.map((p) => (
                <div 
                  key={p.id}
                  className="p-3 rounded-lg bg-[#121212] border border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-white truncate block">{p.name}</span>
                    <span className="text-[11px] font-mono text-neutral-400">SKU: {p.sku} · Mínimo: {p.minStockAlert} un.</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                      p.stock === 0 ? 'bg-red-950 text-[#ED1027] border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {p.stock} un.
                    </span>
                    <button
                      onClick={() => onNavigateTab('estoque')}
                      className="px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#D8AE35] hover:text-black text-neutral-300 rounded border border-neutral-700 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      Ajustar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
