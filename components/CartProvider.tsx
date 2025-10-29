"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  CartItem,
  getCart,
  addToCart as add,
  removeFromCart as remove,
  updateCartItem as update,
  clearCart as clear,
} from "@/lib/cart";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      return getCart();
    }
    return [];
  });

  const handleAddToCart = (item: Omit<CartItem, "quantity">) => {
    const newCart = add(item);
    setCart(newCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = remove(productId);
    setCart(newCart);
  };

  const handleUpdateCartItem = (productId: string, quantity: number) => {
    const newCart = update(productId, quantity);
    setCart(newCart);
  };

  const handleClearCart = () => {
    clear();
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart: handleAddToCart,
        removeFromCart: handleRemoveFromCart,
        updateCartItem: handleUpdateCartItem,
        clearCart: handleClearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
