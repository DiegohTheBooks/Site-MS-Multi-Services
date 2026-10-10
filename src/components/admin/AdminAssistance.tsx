import React, { useState, useEffect } from 'react';
import { Wrench, Edit3, Check, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { AssistanceRequest } from '../../types';
import { api } from '../../services/api';

export const AdminAssistance: React.FC = () => {
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit OS Modal
  const [selectedOS, setSelectedOS] = useState<AssistanceRequest | null>(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [estimatedPrice, setEstimatedPrice] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await api.getAssistanceRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openEdit = (os: AssistanceRequest) => {
    setSelectedOS(os);
    setStatus(os.status);
    setNotes(os.notes || '');
    setEstimatedPrice(os.estimatedPrice ? os.estimatedPrice.toString() : '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOS) return;
    setUpdating(true);

    try {
      await api.updateAssistanceRequest(selectedOS.id, {
        status: status as any,
        notes,
        estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : undefined
      });
      setSelectedOS(null);
      fetchRequests();
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  const openWhatsAppCustomer = (os: AssistanceRequest) => {
    const text = encodeURIComponent(
      `Olá ${os.customerName}! Aqui é da assistência técnica MS Multi Services referente à sua OS ${os.requestNumber} (${os.brandModel}). Gostaria de passar o diagnóstico!`
    );
    window.open(`https://wa.me/55${os.customerPhone.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-[#D8AE35]" />
            Ordens de Serviço e Orçamentos de Assistência ({requests.length})
          </h3>
          <p className="text-xs text-neutral-400">Atendimentos de bancada, diagnósticos e manutenções solicitadas</p>
        </div>
      </div>

      <div className="border border-neutral-800 rounded-xl bg-[#141414] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#181818] text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800">
            <tr>
              <th className="p-3.5">OS / Data</th>
              <th className="p-3.5">Cliente</th>
              <th className="p-3.5">Aparelho</th>
              <th className="p-3.5">Defeito Informado</th>
              <th className="p-3.5">Valor Orçado</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {requests.map((os) => (
              <tr key={os.id} className="hover:bg-[#1a1a1a] transition-colors">
                <td className="p-3.5">
                  <div className="font-mono font-bold text-[#D8AE35]">{os.requestNumber}</div>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    {new Date(os.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-white">{os.customerName}</div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span>{os.customerPhone}</span>
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="font-medium text-white">{os.brandModel}</div>
                  <div className="text-[10px] text-neutral-400">{os.deviceType} · {os.preferredService}</div>
                </td>
                <td className="p-3.5 max-w-xs truncate text-neutral-300" title={os.issueDescription}>
                  {os.issueDescription}
                </td>
                <td className="p-3.5 font-mono font-bold text-white">
                  {os.estimatedPrice ? `R$ ${os.estimatedPrice.toFixed(2)}` : 'Em análise'}
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    os.status === 'concluido'
                      ? 'bg-emerald-950 text-emerald-400'
                      : os.status === 'em_manutencao'
                      ? 'bg-blue-950 text-blue-400'
                      : os.status === 'em_orcamento'
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-neutral-800 text-neutral-200'
                  }`}>
                    {os.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3.5 text-right space-x-1.5">
                  <button
                    onClick={() => openWhatsAppCustomer(os)}
                    className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 transition-colors cursor-pointer"
                    title="Chamar cliente no WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => openEdit(os)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#D8AE35] hover:text-black text-neutral-200 transition-colors cursor-pointer"
                    title="Editar Orçamento e Status"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit OS Modal */}
      {selectedOS && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-between justify-between pb-2 border-b border-neutral-800">
              <h3 className="text-base font-bold text-white">Gerenciar Ordem de Serviço</h3>
              <span className="font-mono text-[#D8AE35] text-xs font-bold">{selectedOS.requestNumber}</span>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Status Técnico</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
                >
                  <option value="aguardando_analise">Aguardando Análise</option>
                  <option value="em_orcamento">Em Orçamento / Aguardando Aprovação</option>
                  <option value="aprovado">Aprovado pelo Cliente</option>
                  <option value="em_manutencao">Em Manutenção na Bancada</option>
                  <option value="concluido">Concluído / Pronto p/ Retirada</option>
                  <option value="cancelado">Cancelado / Devolvido sem Reparo</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Valor do Orçamento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Laudo / Observações do Técnico</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Peça encomendada com fornecedor / Teste de carga 100% / Garantia de 90 dias"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOS(null)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold rounded-lg cursor-pointer"
                >
                  {updating ? 'Salvando...' : 'Salvar Atualização'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
