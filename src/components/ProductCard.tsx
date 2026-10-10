import React from 'react';
import { ShoppingBag, Eye, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  categoryName
}) => {
  const { addToCart, setIsOpen } = useCart();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStockAlert;
  const hasPromo = product.promoPrice !== null && product.promoPrice !== undefined && product.promoPrice > 0;
  const currentPrice = hasPromo ? product.promoPrice! : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const res = addToCart(product, 1);
    if (res.success) {
      setIsOpen(true);
    }
  };

  const discountPercent = hasPromo 
    ? Math.round(((product.price - product.promoPrice!) / product.price) * 100) 
    : 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#141414] border border-neutral-800/90 hover:border-[#D8AE35]/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/3] w-full bg-[#1c1c1c] overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600">
            <span>Imagem não disponível</span>
          </div>
        )}

        {/* Promo discount badge (if applicable, subtle and red-tinted) */}
        {hasPromo && (
          <div className="absolute top-2.5 left-2.5 bg-[#ED1027] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Quick View Button on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="p-2.5 bg-black/80 hover:bg-[#D8AE35] text-white hover:text-black rounded-lg transition-colors shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-4 h-4" />
            <span>Detalhes</span>
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px] flex items-center justify-center p-4">
            <span className="text-neutral-300 text-xs uppercase font-bold tracking-wider px-3 py-1 border border-neutral-700 bg-neutral-900/90 rounded">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4.5 justify-between">
        <div>
          {/* Unboxed Metadata: Category · SKU */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1.5 uppercase tracking-wide">
            <span className="truncate">{categoryName || 'Tecnologia'}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="font-mono text-[11px] text-neutral-400">{product.sku}</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-[#D8AE35] transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </div>

        {/* Pricing and Stock Bar */}
        <div className="pt-3 border-t border-neutral-800/80 mt-2">
          
          {/* Price Block */}
          <div className="mb-2.5">
            {hasPromo && (
              <span className="block text-xs text-neutral-400 line-through font-mono-numbers">
                R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white font-mono-numbers">
                R$ {currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-[#D8AE35] font-medium">
                à vista via PIX
              </span>
            </div>
          </div>

          {/* Stock state & Buy button */}
          <div className="flex items-center justify-between gap-2">
            {isOutOfStock ? (
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-[#ED1027]" />
                Sem estoque
              </span>
            ) : isLowStock ? (
              <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                Últimas {product.stock} un.
              </span>
            ) : (
              <span className="text-xs text-emerald-400/90 font-medium">
                Em estoque ({product.stock})
              </span>
            )}

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                isOutOfStock
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-[#D8AE35] hover:bg-[#e4be4a] text-black shadow-sm active:scale-95'
              }`}
              title={isOutOfStock ? 'Produto indisponível' : 'Adicionar ao carrinho'}
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
