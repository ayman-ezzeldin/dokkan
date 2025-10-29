export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const CART_KEY = 'dokkan_cart';

export const getCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

export const addToCart = (item: Omit<CartItem, 'quantity'>): CartItem[] => {
  const cart = getCart();
  const existingIndex = cart.findIndex(
    (i) => i.productId === item.productId
  );

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const cart = getCart().filter((item) => item.productId !== productId);
  saveCart(cart);
  return cart;
};

export const updateCartItem = (
  productId: string,
  quantity: number
): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);

  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }

  return cart;
};

export const clearCart = (): void => {
  saveCart([]);
};

export const getCartTotal = (): number => {
  return getCart().reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
};

export const getCartItemCount = (): number => {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
};

