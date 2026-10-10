import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, QrCode, CreditCard, Store, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { items, subtotal, clearCart } = useCart();

  // Customer state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

  // Delivery state
  const [deliveryType, setDeliveryType] = useState<'entrega' | 'retirada'>('entrega');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [loadingCep, setLoadingCep] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'balcao'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const defaultShippingFee = subtotal >= 299 ? 0 : 24.90;
  const shippingCost = deliveryType === 'retirada' ? 0 : defaultShippingFee;
  const finalTotal = subtotal + shippingCost;

  // Auto-fetch CEP from public Brazilian ViaCEP
  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length === 8) {
      setLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || 'SP');
        }
      } catch (err) {
        console.warn("Could not fetch CEP:", err);
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !phone) {
      setErrorMsg('Por favor, preencha todos os dados de contato obrigatórios.');
      return;
    }

    if (deliveryType === 'entrega' && (!cep || !street || !number || !city)) {
      setErrorMsg('Por favor, preencha o endereço de entrega completo.');
      return;
    }

    if (items.length === 0) {
      setErrorMsg('O carrinho está vazio.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: { name, email, phone, cpf },
        deliveryType,
        shippingAddress: deliveryType === 'entrega' ? {
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state
        } : undefined,
        items: items.map(it => ({
          productId: it.product.id,
          quantity: it.quantity
        })),
        paymentMethod
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderCompleted(createdOrder);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro ao registrar o pedido. Verifique o estoque e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative w-full max-w-3xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#161616] border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#D8AE35]" />
            <div>
              <h2 className="text-base font-bold text-white">Finalização de Compra Segura</h2>
              <p className="text-[11px] text-neutral-400">MS Multi Services · Checkout Protegido</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-8 space-y-7 flex-1">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Customer identification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#D8AE35] text-black text-xs font-extrabold flex items-center justify-center">1</span>
              <span>Identificação do Comprador</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Silva"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8AE35]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">E-mail para Recibo *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8AE35]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">WhatsApp / Telefone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8AE35]"
                />
              </div>

              <div>
                <label className="block text-xs text-neutral-300 font-medium mb-1">CPF (Opcional p/ Nota)</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full bg-[#181818] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D8AE35]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery vs Pickup */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#D8AE35] text-black text-xs font-extrabold flex items-center justify-center">2</span>
              <span>Modalidade de Entrega</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('entrega')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryType === 'entrega'
                    ? 'border-[#D8AE35] bg-[#D8AE35]/10 text-white'
                    : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">Receber no Endereço</span>
                  <span className="text-xs font-mono-numbers text-[#D8AE35]">
                    {subtotal >= 299 ? 'GRÁTIS' : 'R$ 24,90'}
                  </span>
                </div>
                <p className="text-xs text-neutral-400">Envio seguro rastreado via Correios/Transportadora.</p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('retirada')}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  deliveryType === 'retirada'
                    ? 'border-[#D8AE35] bg-[#D8AE35]/10 text-white'
                    : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-white">Retirar no Balcão MS</span>
                  <span className="text-xs text-emerald-400 font-bold">GRÁTIS</span>
                </div>
                <p className="text-xs text-neutral-400">Retirada expressa na nossa loja técnica após separação.</p>
              </button>
            </div>

            {deliveryType === 'entrega' ? (
              <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">CEP *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={cep}
                        onChange={(e) => setCep(e.target.value)}
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                      {loadingCep && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-2.5 top-2.5 text-[#D8AE35]" />
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-neutral-400 mb-1">Rua / Logradouro *</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Ex: Av. Paulista"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Número *</label>
                    <input
                      type="text"
                      required
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="123"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Complemento</label>
                    <input
                      type="text"
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      placeholder="Apto 42"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Bairro *</label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Centro"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Cidade / UF *</label>
                    <input
                      type="text"
                      required
                      value={`${city}${city && state ? ' - ' : ''}${state}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('-');
                        setCity(parts[0]?.trim() || '');
                        if (parts[1]) setState(parts[1].trim());
                      }}
                      placeholder="São Paulo - SP"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 text-xs text-neutral-300 flex items-start gap-3">
                <Store className="w-5 h-5 text-[#D8AE35] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Endereço de Retirada Balcão:</strong>
                  Rua do Comércio Tecnológico, 350 - Centro Comercial MS - São Paulo / SP.
                  <span className="block text-neutral-400 text-[11px] mt-1">Horário: Seg a Sex das 08:30 às 18:30 / Sáb das 09:00 às 14:00.</span>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Payment method */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-[#D8AE35] text-black text-xs font-extrabold flex items-center justify-center">3</span>
              <span>Forma de Pagamento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'pix'
                    ? 'border-[#D8AE35] bg-[#D8AE35]/15 text-white'
                    : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#D8AE35]" />
                <span className="text-xs font-bold text-white">PIX (Instantâneo)</span>
                <span className="text-[10px] text-[#D8AE35]">Aprovação imediata</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cartao')}
                className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'cartao'
                    ? 'border-[#D8AE35] bg-[#D8AE35]/15 text-white'
                    : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:border-neutral-700'
                }`}
              >
                <CreditCard className="w-5 h-5 text-neutral-300" />
                <span className="text-xs font-bold text-white">Cartão de Crédito</span>
                <span className="text-[10px] text-neutral-400">Até 12 parcelas</span>
              </button>

              {deliveryType === 'retirada' && (
                <button
                  type="button"
                  onClick={() => setPaymentMethod('balcao')}
                  className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'balcao'
                      ? 'border-[#D8AE35] bg-[#D8AE35]/15 text-white'
                      : 'border-neutral-800 bg-[#171717] text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Store className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">Pagar no Balcão</span>
                  <span className="text-[10px] text-emerald-400">Ao retirar</span>
                </button>
              )}
            </div>

            {paymentMethod === 'cartao' && (
              <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-3">
                <div className="text-xs text-neutral-400 mb-2">
                  Ambiente de gateway seguro compatível com Mercado Pago Sandbox.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Número do Cartão</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Como impresso no cartão"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Validade (MM/AA)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-[#121212] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary & Submit */}
          <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 space-y-2.5">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Resumo do Pedido ({items.length} itens)
            </h4>

            <div className="flex justify-between text-xs text-neutral-300">
              <span>Subtotal</span>
              <span className="font-mono-numbers">
                R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between text-xs text-neutral-300">
              <span>Frete ({deliveryType === 'retirada' ? 'Retirada no Balcão' : 'Entrega no Endereço'})</span>
              <span className="font-mono-numbers text-[#D8AE35]">
                {shippingCost === 0 ? 'GRÁTIS' : `R$ ${shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800">
              <span>Total a Pagar</span>
              <span className="font-mono-numbers text-[#D8AE35]">
                R$ {finalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#D8AE35] hover:bg-[#e4be4a] disabled:bg-neutral-800 text-black font-bold text-sm rounded-xl transition-all shadow-xl shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Validando Estoque e Processando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Confirmar e Concluir Pedido</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-neutral-500 text-center mt-2.5">
              Ao confirmar, seu pedido será gerado e o estoque será reservado com rastreio imediato.
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
