import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldAlert, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const { items, isOpen, setIsOpen, updateQuantity, removeFromCart, subtotal, totalItems, clearCart } = useCart();

  if (!isOpen) return null;

  const freeShippingThreshold = 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-neutral-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 bg-[#141414] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D8AE35]" />
              <h2 className="text-base font-bold text-white">Carrinho de Compras</h2>
              <span className="text-xs font-mono-numbers px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-[#161616] border-b border-neutral-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
                <Truck className="w-3.5 h-3.5 text-[#D8AE35]" />
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-bold">Parabéns! Você ganhou Frete Grátis</span>
                ) : (
                  <span>Faltam <strong className="text-white font-mono-numbers">R$ {remainingForFreeShipping.toFixed(2)}</strong> para frete grátis</span>
                )}
              </span>
              <span className="text-neutral-500 font-mono-numbers">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#D8AE35] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#181818] border border-neutral-800 flex items-center justify-center text-neutral-500 mb-2">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-white">Seu carrinho está vazio</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Explore nosso catálogo e adicione os produtos desejados com frete ágil e procedência garantida.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-4 px-5 py-2.5 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const price = (product.promoPrice !== null && product.promoPrice !== undefined && product.promoPrice > 0)
                  ? product.promoPrice 
                  : product.price;
                const itemTotal = price * quantity;
                const isMaxStockReached = quantity >= product.stock;

                return (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-xl bg-[#171717] border border-neutral-800/90 flex gap-3.5 items-start"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg bg-[#202020] overflow-hidden shrink-0 border border-neutral-800">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-white leading-tight truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-500 hover:text-[#ED1027] transition-colors p-0.5 cursor-pointer"
                          title="Remover item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                        SKU: {product.sku}
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        {/* Stepper */}
                        <div className="flex items-center border border-neutral-700 bg-[#121212] rounded-md">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="px-2.5 py-0.5 text-xs text-neutral-300 hover:text-white font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-white font-mono-numbers">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={isMaxStockReached}
                            className={`px-2.5 py-0.5 text-xs font-bold cursor-pointer ${
                              isMaxStockReached ? 'text-neutral-600 cursor-not-allowed' : 'text-neutral-300 hover:text-white'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <span className="text-xs font-bold text-white font-mono-numbers">
                            R$ {itemTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          {quantity > 1 && (
                            <span className="block text-[10px] text-neutral-400 font-mono-numbers">
                              R$ {price.toFixed(2)} cada
                            </span>
                          )}
                        </div>
                      </div>

                      {isMaxStockReached && (
                        <div className="mt-2 text-[10px] text-amber-400 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Estoque máximo atingido ({product.stock} un.)</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-[#141414] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Subtotal dos produtos</span>
                  <span className="font-mono-numbers text-white">
                    R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Frete estimado</span>
                  <span className="font-mono-numbers text-[#D8AE35] font-semibold">
                    {subtotal >= freeShippingThreshold ? 'GRÁTIS' : 'Calculado no checkout'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Total estimado</span>
                  <span className="font-mono-numbers text-[#D8AE35] text-base">
                    R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  className="px-3 py-3 rounded-xl border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  title="Esvaziar carrinho"
                >
                  Limpar
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onCheckout();
                  }}
                  className="flex-1 py-3 px-4 bg-[#D8AE35] hover:bg-[#e4be4a] text-black font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#D8AE35]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Finalizar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 text-center">
                Validação de estoque e preços realizada em tempo real no servidor.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
