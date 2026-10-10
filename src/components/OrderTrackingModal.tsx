import React, { useState } from 'react';
import { X, CheckCircle, Clock, PackageCheck, Truck, Store, Copy, Check, Search, AlertCircle, RefreshCw } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderUpdated?: (order: Order) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order: initialOrder,
  isOpen,
  onClose,
  onOrderUpdated
}) => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(initialOrder);
  const [searchCode, setSearchCode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);
  const [simulatingPayment, setSimulatingPayment] = useState(false);

  React.useEffect(() => {
    setCurrentOrder(initialOrder);
  }, [initialOrder]);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await api.getOrders({ code: searchCode.trim() });
      if (results && results.length > 0) {
        setCurrentOrder(results[0]);
      } else {
        setSearchError('Pedido não encontrado com o código informado.');
      }
    } catch (err: any) {
      setSearchError(err.message || 'Erro ao buscar pedido.');
    } finally {
      setIsSearching(false);
    }
  };

  const copyPixCode = () => {
    if (!currentOrder?.pixPayload) return;
    navigator.clipboard.writeText(currentOrder.pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Allows testing instant payment confirmation via real backend webhook
  const handleSimulatePaymentApproval = async () => {
    if (!currentOrder) return;
    setSimulatingPayment(true);
    try {
      await api.simulatePaymentWebhook(currentOrder.orderNumber, 'approved');
      // Refresh order
      const refreshed = await api.getOrderById(currentOrder.orderNumber);
      setCurrentOrder(refreshed);
      if (onOrderUpdated) onOrderUpdated(refreshed);
    } catch (err: any) {
      alert(`Erro na simulação: ${err.message}`);
    } finally {
      setSimulatingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative w-full max-w-2xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161616] border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-white">Acompanhamento de Pedido</h2>
            <p className="text-[11px] text-neutral-400">Rastreie o status do pagamento e entrega</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="Digite o código do pedido (Ex: MS-2026-XXXX)"
              className="flex-1 bg-[#181818] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#D8AE35]"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? 'Buscando...' : 'Buscar'}</span>
            </button>
          </form>

          {searchError && (
            <div className="p-3 rounded-lg bg-red-950/50 border border-red-800 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{searchError}</span>
            </div>
          )}

          {currentOrder ? (
            <div className="space-y-6">
              
              {/* Order Number Banner */}
              <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Código do Pedido</span>
                  <span className="text-lg font-bold text-[#D8AE35] font-mono-numbers">{currentOrder.orderNumber}</span>
                  <span className="text-xs text-neutral-400 block mt-0.5">
                    Data: {new Date(currentOrder.createdAt).toLocaleDateString('pt-BR')} às {new Date(currentOrder.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                    currentOrder.paymentStatus === 'aprovado'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : currentOrder.paymentStatus === 'recusado'
                      ? 'bg-red-950/80 text-red-400 border border-red-800'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  }`}>
                    Pagamento: {currentOrder.paymentStatus}
                  </div>

                  <div className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-neutral-800 text-neutral-200 border border-neutral-700">
                    Status: {currentOrder.fulfillmentStatus.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* PIX Pay Box if pending */}
              {currentOrder.paymentMethod === 'pix' && currentOrder.paymentStatus === 'pendente' && currentOrder.pixPayload && (
                <div className="p-5 rounded-xl bg-[#161616] border border-[#D8AE35]/40 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#D8AE35]">
                    <Clock className="w-4 h-4" />
                    <span>Aguardando Pagamento via PIX</span>
                  </div>
                  <p className="text-xs text-neutral-300">
                    Copie a chave Pix abaixo ou escaneie o código em seu aplicativo bancário para concluir a compra.
                  </p>

                  <div className="p-3 bg-[#0d0d0d] rounded-lg border border-neutral-800 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-neutral-400 truncate select-all">
                      {currentOrder.pixPayload}
                    </span>
                    <button
                      type="button"
                      onClick={copyPixCode}
                      className="px-3 py-1.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-md transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar PIX</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Simulator button for test environments */}
                  <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">Modo de Testes Sandbox:</span>
                    <button
                      type="button"
                      onClick={handleSimulatePaymentApproval}
                      disabled={simulatingPayment}
                      className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 border border-emerald-900/60 rounded text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${simulatingPayment ? 'animate-spin' : ''}`} />
                      <span>Simular Aprovação Gateway</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Histórico Operacional do Pedido
                </h3>
                <div className="space-y-2">
                  {currentOrder.statusHistory && currentOrder.statusHistory.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#161616] border border-neutral-800 flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D8AE35] mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white uppercase">{step.status}</span>
                          <span className="text-[10px] text-neutral-500 font-mono-numbers">
                            {new Date(step.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {step.note && (
                          <p className="text-xs text-neutral-400 mt-0.5">{step.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized summary */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Itens do Pedido ({currentOrder.items.length})
                </h3>
                <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl bg-[#161616] overflow-hidden">
                  {currentOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-semibold text-white">{it.name}</div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          SKU: {it.sku} · Qtd: {it.quantity} un.
                        </div>
                      </div>
                      <div className="text-right font-mono-numbers font-bold text-white">
                        R$ {it.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-[#131313] flex justify-between text-xs font-bold text-white">
                    <span>Total do Pedido:</span>
                    <span className="text-[#D8AE35] font-mono-numbers text-sm">
                      R$ {currentOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer and Delivery info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#161616] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">Destinatário</span>
                  <div className="font-semibold text-white">{currentOrder.customer.name}</div>
                  <div className="text-neutral-400">{currentOrder.customer.email}</div>
                  <div className="text-neutral-400">{currentOrder.customer.phone}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#161616] border border-neutral-800">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block mb-1">
                    {currentOrder.deliveryType === 'retirada' ? 'Retirada no Balcão' : 'Endereço de Entrega'}
                  </span>
                  {currentOrder.deliveryType === 'retirada' ? (
                    <div className="text-neutral-300">
                      Balcão Técnico MS Multi Services (Disponível após confirmação de pagamento e separação).
                    </div>
                  ) : (
                    <div className="text-neutral-300">
                      {currentOrder.shippingAddress?.street}, {currentOrder.shippingAddress?.number}
                      {currentOrder.shippingAddress?.complement ? ` - ${currentOrder.shippingAddress.complement}` : ''}
                      <br />
                      {currentOrder.shippingAddress?.neighborhood} - {currentOrder.shippingAddress?.city}/{currentOrder.shippingAddress?.state}
                      <br />
                      CEP: {currentOrder.shippingAddress?.cep}
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500 text-xs">
              Informe o código do seu pedido acima para consultar o andamento em tempo real.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
