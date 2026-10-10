import React, { useState } from 'react';
import { ShoppingBag, Eye, RefreshCw, CheckCircle2, Clock, AlertTriangle, Truck, User } from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';

interface AdminOrdersProps {
  orders: Order[];
  onRefresh: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onRefresh }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [fulfillmentStatus, setFulfillmentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const openOrderDetail = (ord: Order) => {
    setSelectedOrder(ord);
    setPaymentStatus(ord.paymentStatus);
    setFulfillmentStatus(ord.fulfillmentStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);

    try {
      const updated = await api.updateOrderStatus(selectedOrder.id, {
        paymentStatus,
        fulfillmentStatus,
        note: statusNote || undefined
      });
      setSelectedOrder(updated);
      onRefresh();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleSimulateWebhook = async (status: 'approved' | 'rejected') => {
    if (!selectedOrder) return;
    setSimulating(true);

    try {
      await api.simulatePaymentWebhook(selectedOrder.orderNumber, status);
      const refreshed = await api.getOrderById(selectedOrder.orderNumber);
      setSelectedOrder(refreshed);
      setPaymentStatus(refreshed.paymentStatus);
      setFulfillmentStatus(refreshed.fulfillmentStatus);
      onRefresh();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#D8AE35]" />
            Gerenciamento Operacional de Pedidos ({orders.length})
          </h3>
          <p className="text-xs text-neutral-400">Controle individual de pagamento e logística de entrega/retirada</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
            <tr>
              <th className="p-3.5">Código / Data</th>
              <th className="p-3.5">Cliente</th>
              <th className="p-3.5">Itens</th>
              <th className="p-3.5">Total</th>
              <th className="p-3.5">Pagamento</th>
              <th className="p-3.5">Atendimento / Envio</th>
              <th className="p-3.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-white">{ord.orderNumber}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {new Date(ord.createdAt).toLocaleDateString('pt-BR')} {new Date(ord.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-white">{ord.customer.name}</div>
                  <div className="text-[11px] text-neutral-400">{ord.customer.phone}</div>
                </td>
                <td className="p-3.5 text-neutral-300">
                  {ord.items.length} {ord.items.length === 1 ? 'item' : 'itens'}
                </td>
                <td className="p-3.5 font-mono font-bold text-white">
                  R$ {ord.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ord.paymentStatus === 'aprovado'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : ord.paymentStatus === 'recusado'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ord.paymentStatus}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-200">
                    {ord.fulfillmentStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => openOrderDetail(ord)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D8AE35] hover:text-black text-neutral-200 transition-colors cursor-pointer"
                    title="Ver detalhes e alterar status"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="relative w-full max-w-2xl bg-[#141414] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Pedido</span>
                <h3 className="text-lg font-bold text-[#D8AE35] font-mono">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-neutral-400 hover:text-white text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>

            {/* Customer & Delivery Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#181818] border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">Dados do Cliente</span>
                <div className="font-semibold text-white">{selectedOrder.customer.name}</div>
                <div className="text-neutral-400">{selectedOrder.customer.email}</div>
                <div className="text-neutral-400">{selectedOrder.customer.phone}</div>
                {selectedOrder.customer.cpf && (
                  <div className="text-neutral-400">CPF: {selectedOrder.customer.cpf}</div>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-[#181818] border border-neutral-800 space-y-1">
                <span className="text-[10px] text-neutral-500 uppercase font-bold block">
                  Modalidade: {selectedOrder.deliveryType.toUpperCase()}
                </span>
                {selectedOrder.deliveryType === 'retirada' ? (
                  <div className="text-neutral-300">Retirada física no balcão da MS Multi Services</div>
                ) : (
                  <div className="text-neutral-300">
                    {selectedOrder.shippingAddress?.street}, {selectedOrder.shippingAddress?.number}
                    <br />
                    {selectedOrder.shippingAddress?.neighborhood} - {selectedOrder.shippingAddress?.city}/{selectedOrder.shippingAddress?.state}
                    <br />
                    CEP: {selectedOrder.shippingAddress?.cep}
                  </div>
                )}
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Itens Faturados</span>
              <div className="border border-neutral-800 rounded-xl bg-[#181818] divide-y divide-neutral-800 text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{it.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        SKU: {it.sku} · Qtd: {it.quantity} un. x R$ {it.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-white">
                      R$ {it.total.toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-[#161616] flex justify-between font-bold text-xs">
                  <span className="text-white">Total com Frete:</span>
                  <span className="text-[#D8AE35] font-mono text-sm">
                    R$ {selectedOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 rounded-xl bg-[#181818] border border-neutral-800 space-y-4 text-xs">
              <span className="font-bold text-white uppercase tracking-wider block">
                Atualizar Situação Operacional
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1">Status do Pagamento</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-700 rounded-lg p-2 text-white"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="recusado">Recusado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1">Status de Atendimento / Envio</label>
                  <select
                    value={fulfillmentStatus}
                    onChange={(e) => setFulfillmentStatus(e.target.value)}
                    className="w-full bg-[#121212] border border-neutral-700 rounded-lg p-2 text-white"
                  >
                    <option value="novo">Novo Pedido</option>
                    <option value="separacao">Em Separação no Estoque</option>
                    <option value="pronto_retirada">Pronto para Retirada</option>
                    <option value="enviado">Enviado (Em trânsito)</option>
                    <option value="entregue">Entregue ao Cliente</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1">Nota / Observação do Histórico (Opcional)</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Ex: Código de rastreamento Correios: BR123456789 ou conferido na bancada"
                  className="w-full bg-[#121212] border border-neutral-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {/* Gateway simulation tools */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500">Gateway Teste:</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateWebhook('approved')}
                    disabled={simulating}
                    className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border border-emerald-800 rounded text-[11px] font-semibold cursor-pointer"
                  >
                    Simular Aprovação
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold rounded-lg cursor-pointer transition-colors"
                >
                  {updating ? 'Gravando...' : 'Atualizar Pedido'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
