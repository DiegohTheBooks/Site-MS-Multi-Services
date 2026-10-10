import React, { useState, useEffect } from 'react';
import { Package, ArrowDownRight, ArrowUpRight, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { Product, StockMovement } from '../../types';
import { api } from '../../services/api';

interface AdminStockProps {
  products: Product[];
  onRefresh: () => void;
}

export const AdminStock: React.FC<AdminStockProps> = ({ products, onRefresh }) => {
  const [history, setHistory] = useState<StockMovement[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Stock Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [adjustType, setAdjustType] = useState<'entrada' | 'saida' | 'ajuste'>('entrada');
  const [quantity, setQuantity] = useState('5');
  const [reason, setReason] = useState('');
  const [operator, setOperator] = useState('Administrador MS');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const data = await api.getStockHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const openAdjustForProduct = (pId: string) => {
    setSelectedProductId(pId);
    setQuantity('5');
    setReason('');
    setErrorMsg(null);
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!reason || reason.trim().length < 3) {
      setErrorMsg('A justificativa é obrigatória (mínimo 3 caracteres).');
      return;
    }

    setSubmitting(true);

    try {
      await api.adjustStock({
        productId: selectedProductId,
        type: adjustType,
        quantity: parseFloat(quantity),
        reason: reason.trim(),
        operator
      });

      setIsAdjustModalOpen(false);
      onRefresh();
      fetchHistory();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao movimentar estoque.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Current Stock Balance Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D8AE35]" />
              Saldos Atuais em Estoque
            </h3>
            <p className="text-xs text-neutral-400">Controle contínuo e sincronizado com as vendas da loja</p>
          </div>

          <button
            onClick={() => {
              setSelectedProductId(products[0]?.id || '');
              setIsAdjustModalOpen(true);
            }}
            className="px-4 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Registrar Movimentação
          </button>
        </div>

        <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Produto / SKU</th>
                <th className="p-3.5">Saldo Disponível</th>
                <th className="p-3.5">Estoque Mínimo</th>
                <th className="p-3.5">Situação</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {products.map((p) => {
                const isZero = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= p.minStockAlert;

                return (
                  <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-[11px] font-mono text-neutral-400">SKU: {p.sku}</div>
                    </td>
                    <td className="p-3.5 font-mono text-sm font-bold text-white">
                      {p.stock} un.
                    </td>
                    <td className="p-3.5 font-mono text-neutral-400">
                      {p.minStockAlert} un.
                    </td>
                    <td className="p-3.5">
                      {isZero ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-[#ED1027] border border-red-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Esgotado
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Estoque Baixo
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> Normal
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => openAdjustForProduct(p.id)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-[#D8AE35] hover:text-black text-neutral-200 rounded text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Ajustar / Lançar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Audit Trail Table */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#D8AE35]" />
            Trilha de Auditoria e Histórico de Movimentações
          </h3>
          <p className="text-xs text-neutral-400">Registro persistente e inalterável de todas as entradas, saídas e vendas</p>
        </div>

        <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
              <tr>
                <th className="p-3.5">Data / Hora</th>
                <th className="p-3.5">Produto</th>
                <th className="p-3.5">Tipo</th>
                <th className="p-3.5">Qtd Movimentada</th>
                <th className="p-3.5">Antes → Depois</th>
                <th className="p-3.5">Justificativa / Motivo</th>
                <th className="p-3.5">Operador</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80">
              {history.map((mov) => (
                <tr key={mov.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-3.5 font-mono text-neutral-400 whitespace-nowrap">
                    {new Date(mov.createdAt).toLocaleDateString('pt-BR')} {new Date(mov.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-white block truncate max-w-xs">{mov.productName}</span>
                    <span className="text-[10px] font-mono text-neutral-500">{mov.sku}</span>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      mov.type === 'entrada'
                        ? 'bg-emerald-950 text-emerald-400'
                        : mov.type === 'venda_pedido'
                        ? 'bg-blue-950 text-blue-400'
                        : mov.type === 'saida'
                        ? 'bg-red-950 text-red-400'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {mov.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono font-bold text-white">
                    {mov.quantity} un.
                  </td>
                  <td className="p-3.5 font-mono text-neutral-300">
                    {mov.balanceBefore} → <strong className="text-white">{mov.balanceAfter}</strong>
                  </td>
                  <td className="p-3.5 text-neutral-300 max-w-xs truncate" title={mov.reason}>
                    {mov.reason}
                  </td>
                  <td className="p-3.5 text-neutral-400">
                    {mov.operator}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Lançamento de Estoque</h3>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAdjustSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Selecionar Produto</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Saldo atual: {p.stock} un.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Tipo de Movimentação</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                >
                  <option value="entrada">Entrada (+ Compra de Fornecedor / Devolução)</option>
                  <option value="saida">Saída (- Perda / Avaria / Demonstração)</option>
                  <option value="ajuste">Ajuste de Balanço (Novo Saldo Contado em Loja)</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  {adjustType === 'ajuste' ? 'Novo Saldo Físico Apurado' : 'Quantidade'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Justificativa Obrigatória *</label>
                <input
                  type="text"
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex: Recebimento Nota Fiscal 4529 / Recontagem de inventário"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Operador Responsável</label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold rounded-lg cursor-pointer"
                >
                  {submitting ? 'Gravando...' : 'Confirmar Lançamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
