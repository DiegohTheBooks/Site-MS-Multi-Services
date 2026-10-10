import React, { useState, useEffect } from 'react';
import { Sliders, Check, AlertCircle, Save } from 'lucide-react';
import { StoreSettings } from '../../types';
import { api } from '../../services/api';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await api.getSettings();
        setSettings(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSuccessMsg(null);

    try {
      await api.updateSettings(settings);
      setSuccessMsg('Configurações da loja salvas com sucesso!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="p-8 text-center text-xs text-neutral-400">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D8AE35]" />
            Configurações Gerais da Loja & Operação
          </h3>
          <p className="text-xs text-neutral-400">Altere contatos, chaves Pix, frete e mensagens sem alterar código-fonte</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Basic Brand Info */}
        <div className="p-5 rounded-xl bg-[#141414] border border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold text-[#D8AE35] uppercase tracking-wider">
            Identificação Comercial & Contatos
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Nome da Empresa</label>
              <input
                type="text"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">CNPJ</label>
              <input
                type="text"
                value={settings.cnpj}
                onChange={(e) => setSettings({ ...settings, cnpj: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">WhatsApp Comercial</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">E-mail de Atendimento</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Telefone Fixo</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Endereço Físico Completo</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-medium mb-1">Horário de Funcionamento</label>
            <input
              type="text"
              value={settings.openingHours}
              onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
              className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
            />
          </div>
        </div>

        {/* PIX Settings */}
        <div className="p-5 rounded-xl bg-[#141414] border border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold text-[#D8AE35] uppercase tracking-wider">
            Configuração de Recebimento via PIX
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Chave PIX da Loja</label>
              <input
                type="text"
                value={settings.pixKey}
                onChange={(e) => setSettings({ ...settings, pixKey: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Tipo da Chave</label>
              <select
                value={settings.pixKeyType}
                onChange={(e) => setSettings({ ...settings, pixKeyType: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              >
                <option value="E-mail">E-mail</option>
                <option value="CNPJ">CNPJ</option>
                <option value="Telefone">Telefone</option>
                <option value="Chave Aleatória">Chave Aleatória</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Nome do Favorecido / Razão Social</label>
              <input
                type="text"
                value={settings.pixReceiver}
                onChange={(e) => setSettings({ ...settings, pixReceiver: e.target.value })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="p-5 rounded-xl bg-[#141414] border border-neutral-800 space-y-4">
          <h4 className="text-xs font-bold text-[#D8AE35] uppercase tracking-wider">
            Regras de Frete e Entregas
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Valor Mínimo para Frete Grátis (R$)</label>
              <input
                type="number"
                step="0.01"
                value={settings.freeShippingMinimum}
                onChange={(e) => setSettings({ ...settings, freeShippingMinimum: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Valor Padrão de Frete (R$)</label>
              <input
                type="number"
                step="0.01"
                value={settings.defaultShippingFee}
                onChange={(e) => setSettings({ ...settings, defaultShippingFee: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#181818] border border-neutral-700 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-[#D8AE35]/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Gravando...' : 'Salvar Todas as Configurações'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
