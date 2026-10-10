import React, { useState } from 'react';
import { X, Wrench, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { AssistanceRequest } from '../types';

interface AssistanceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssistanceRequestModal: React.FC<AssistanceRequestModalProps> = ({
  isOpen,
  onClose
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deviceType, setDeviceType] = useState('Smartphone');
  const [brandModel, setBrandModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [preferredService, setPreferredService] = useState('Troca de Tela');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdOS, setCreatedOS] = useState<AssistanceRequest | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName || !customerPhone || !brandModel || !issueDescription) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios (*).');
      return;
    }

    setLoading(true);

    try {
      const res = await api.submitAssistanceRequest({
        customerName,
        customerPhone,
        customerEmail,
        deviceType,
        brandModel,
        serialNumber,
        issueDescription,
        preferredService
      });

      setCreatedOS(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao registrar solicitação de assistência.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreatedOS(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setBrandModel('');
    setSerialNumber('');
    setIssueDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative w-full max-w-xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161616] border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-[#D8AE35]" />
            <div>
              <h2 className="text-base font-bold text-white">Solicitar Orçamento de Assistência</h2>
              <p className="text-[11px] text-neutral-400">Diagnóstico técnico com peças de alta procedência</p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {createdOS ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Solicitação Aberta com Sucesso!</h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  Seus dados e a descrição do aparelho foram registrados em nosso sistema. Nossa equipe técnica entrará em contato em breve.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 max-w-sm mx-auto text-left space-y-1 text-xs">
                <div className="text-[11px] text-neutral-500 uppercase font-bold">Número da OS</div>
                <div className="text-base font-extrabold text-[#D8AE35] font-mono-numbers">{createdOS.requestNumber}</div>
                <div className="text-neutral-300 pt-2 border-t border-neutral-800 mt-2">
                  <strong>Aparelho:</strong> {createdOS.brandModel} ({createdOS.deviceType})
                </div>
                <div className="text-neutral-300">
                  <strong>Cliente:</strong> {createdOS.customerName}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Concluir e Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Seu Nome *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ex: Amanda Rocha"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">WhatsApp / Telefone *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="(11) 98888-7777"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">E-mail (Opcional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="amanda@exemplo.com"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Tipo de Aparelho *</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Smartphone">Smartphone</option>
                    <option value="Tablet">Tablet / iPad</option>
                    <option value="Notebook">Notebook / Computador</option>
                    <option value="Console">Console / Videogame</option>
                    <option value="Audio">Headphone / Fone / Caixa</option>
                    <option value="Outro">Outro Dispositivo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Marca e Modelo Exato *</label>
                  <input
                    type="text"
                    required
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                    placeholder="Ex: iPhone 14 Pro / Samsung S23"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Serviço Pretendido</label>
                  <select
                    value={preferredService}
                    onChange={(e) => setPreferredService(e.target.value)}
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="Troca de Tela">Troca de Tela / Display</option>
                    <option value="Troca de Bateria">Troca de Bateria</option>
                    <option value="Reparo em Placa">Reparo de Placa / Microssoldagem</option>
                    <option value="Conector de Carga">Reparo do Conector de Carga</option>
                    <option value="Limpeza / Manutenção">Limpeza e Pasta Térmica</option>
                    <option value="Desoxidação">Desoxidação (Aparelho Molhado)</option>
                    <option value="Diagnóstico Geral">Diagnóstico Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">Número de Série / IMEI (Opcional)</label>
                  <input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Opcional"
                    className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">Descrição do Defeito *</label>
                <textarea
                  rows={3}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="Descreva o que aconteceu: caiu no chão, parou de carregar, não liga, tela piscando..."
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#D8AE35] hover:bg-[#e4be4a] disabled:bg-neutral-800 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando Ordem de Serviço...</span>
                    </>
                  ) : (
                    <>
                      <Wrench className="w-4 h-4" />
                      <span>Enviar Solicitação de Orçamento</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
