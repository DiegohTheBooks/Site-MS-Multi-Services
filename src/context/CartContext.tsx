import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ms_cart_items_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to store cart items", e);
    }
  }, [items]);

  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: `Desculpe, o produto "${product.name}" está esgotado no momento.` };
    }

    let result = { success: true, message: `"${product.name}" adicionado ao carrinho!` };

    setItems(prev => {
      const existingIdx = prev.findIndex(item => item.product.id === product.id);
      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity;
        const targetQty = currentQty + quantity;

        if (targetQty > product.stock) {
          result = {
            success: false,
            message: `Quantidade solicitada ultrapassa o estoque disponível (${product.stock} un.).`
          };
          return prev;
        }

        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: targetQty
        };
        return updated;
      } else {
        if (quantity > product.stock) {
          result = {
            success: false,
            message: `Quantidade solicitada ultrapassa o estoque disponível (${product.stock} un.).`
          };
          return prev;
        }
        return [...prev, { product, quantity }];
      }
    });

    return result;
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number): { success: boolean; message: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: "Produto removido do carrinho." };
    }

    let result = { success: true, message: "Quantidade atualizada." };

    setItems(prev => {
      const idx = prev.findIndex(item => item.product.id === productId);
      if (idx === -1) return prev;

      const item = prev[idx];
      if (quantity > item.product.stock) {
        result = {
          success: false,
          message: `Estoque máximo atingido (${item.product.stock} un. disponíveis).`
        };
        return prev;
      }

      const updated = [...prev];
      updated[idx] = { ...item, quantity };
      return updated;
    });

    return result;
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const subtotal = items.reduce((acc, curr) => {
    const price = (curr.product.promoPrice !== null && curr.product.promoPrice !== undefined && curr.product.promoPrice > 0)
      ? curr.product.promoPrice 
      : curr.product.price;
    return acc + price * curr.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
