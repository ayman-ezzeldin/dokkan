"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "@/lib/cart";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json();
        setCart(data.items || []);
      } catch {}
    })();
  }, []);

  const handleAddToCart = async (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", item, quantity }) });
    const data = await res.json();
    setCart(data.items || []);
  };

  const handleRemoveFromCart = async (productId: string) => {
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove", productId }) });
    const data = await res.json();
    setCart(data.items || []);
  };

  const handleUpdateCartItem = async (productId: string, quantity: number) => {
    const res = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", productId, quantity }) });
    const data = await res.json();
    setCart(data.items || []);
  };

  const handleClearCart = async () => {
    await fetch("/api/cart", { method: "DELETE" });
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
