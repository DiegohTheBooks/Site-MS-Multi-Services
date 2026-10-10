import React, { useState } from 'react';
import { X, ShoppingBag, Shield, Truck, CheckCircle2, AlertTriangle, MessageSquare, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  categoryName?: string;
  relatedProducts?: Product[];
  onSelectRelated?: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  categoryName,
  relatedProducts = [],
  onSelectRelated
}) => {
  const { addToCart, setIsOpen } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  const hasPromo = product.promoPrice !== null && product.promoPrice !== undefined && product.promoPrice > 0;
  const currentPrice = hasPromo ? product.promoPrice! : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setFeedbackMsg({ text: res.message });
      setTimeout(() => {
        setFeedbackMsg(null);
        onClose();
        setIsOpen(true);
      }, 700);
    } else {
      setFeedbackMsg({ text: res.message, error: true });
    }
  };

  const handleWhatsAppContact = () => {
    const text = encodeURIComponent(
      `Olá MS Multi Services! Tenho interesse no produto: ${product.name} (SKU: ${product.sku}). Poderiam me tirar algumas dúvidas?`
    );
    window.open(`https://wa.me/5511999998888?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#121212] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-[#141414]">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Loja</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span>{categoryName || 'Produtos'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left: Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#181818] border border-neutral-800 relative">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIdx] || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                    Sem imagem
                  </div>
                )}
                {hasPromo && (
                  <div className="absolute top-3 left-3 bg-[#ED1027] text-white text-xs font-bold px-2.5 py-1 rounded">
                    OFERTA ESPECIAL
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImageIdx === idx ? 'border-[#D8AE35]' : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-800/80 text-xs text-neutral-400">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#171717] border border-neutral-800">
                  <Shield className="w-4 h-4 text-[#D8AE35]" />
                  <span>Garantia MS Oficial</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#171717] border border-neutral-800">
                  <Truck className="w-4 h-4 text-[#D8AE35]" />
                  <span>Envio para todo Brasil</span>
                </div>
              </div>
            </div>

            {/* Right: Contiguous Purchase Module */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2 uppercase tracking-wider font-mono">
                  <span>SKU: {product.sku}</span>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span className="text-[#D8AE35]">{categoryName}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4 leading-snug">
                  {product.name}
                </h1>

                {/* Pricing Block */}
                <div className="p-4 rounded-xl bg-[#171717] border border-neutral-800 mb-5">
                  {hasPromo && (
                    <div className="text-xs text-neutral-400 line-through font-mono-numbers mb-0.5">
                      R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                      R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-[#D8AE35] font-semibold">
                      à vista via PIX
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">
                    ou em até 12x no cartão com juros da operadora
                  </div>
                </div>

                {/* Stock availability indicator */}
                <div className="mb-6">
                  {isOutOfStock ? (
                    <div className="flex items-center gap-2 text-xs text-[#ED1027] font-semibold bg-red-950/30 p-2.5 rounded-lg border border-red-900/40">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Produto indisponível em estoque no momento.</span>
                    </div>
                  ) : isLowStock ? (
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Restam apenas {product.stock} unidades disponíveis no estoque!</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Produto disponível para envio imediato ou retirada ({product.stock} unidades).</span>
                    </div>
                  )}
                </div>

                {/* Quantity stepper & Buy action */}
                {!isOutOfStock && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-semibold text-neutral-300">Quantidade:</span>
                      <div className="flex items-center border border-neutral-700 bg-[#171717] rounded-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 font-bold text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-4 py-1.5 text-xs font-bold text-white font-mono-numbers">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                          className="px-3 py-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800 font-bold text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-xs text-neutral-400">
                        Total: <strong className="text-white font-mono-numbers">R$ {(currentPrice * quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 py-3.5 px-6 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Adicionar ao Carrinho</span>
                      </button>

                      <button
                        onClick={handleWhatsAppContact}
                        className="py-3.5 px-4 bg-[#171717] hover:bg-neutral-800 text-white border border-neutral-700 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
                        title="Tirar dúvidas pelo WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-400" />
                        <span>Dúvidas?</span>
                      </button>
                    </div>

                    {feedbackMsg && (
                      <div className={`p-3 rounded-lg text-xs font-medium text-center ${
                        feedbackMsg.error 
                          ? 'bg-red-950/60 text-red-300 border border-red-800' 
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                      }`}>
                        {feedbackMsg.text}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-neutral-800/80">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Descrição do Produto
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

          </div>

          {/* Specifications Table */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="pt-6 border-t border-neutral-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-[#D8AE35]" />
                Especificações Técnicas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div 
                    key={key} 
                    className="p-3 rounded-lg bg-[#161616] border border-neutral-800/80 flex flex-col justify-between"
                  >
                    <span className="text-[11px] text-neutral-400 uppercase font-medium">{key}</span>
                    <span className="text-xs sm:text-sm text-neutral-200 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-neutral-800/80">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                Você Também Pode Gostar
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {relatedProducts.slice(0, 3).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="p-3 bg-[#161616] border border-neutral-800 hover:border-[#D8AE35] rounded-xl cursor-pointer transition-colors"
                  >
                    <img 
                      src={rel.images[0]} 
                      alt={rel.name} 
                      className="w-full aspect-[4/3] object-cover rounded-lg mb-2" 
                    />
                    <div className="text-xs font-semibold text-white truncate">{rel.name}</div>
                    <div className="text-xs font-bold text-[#D8AE35] font-mono-numbers mt-1">
                      R$ {(rel.promoPrice || rel.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
