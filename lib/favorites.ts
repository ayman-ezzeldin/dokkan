export interface FavoriteItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
}

const FAVORITES_KEY = 'dokkan_favorites';

export const getFavorites = (): FavoriteItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export const saveFavorites = (favorites: FavoriteItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

export const addToFavorites = (item: FavoriteItem): FavoriteItem[] => {
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.productId === item.productId);
  
  if (!exists) {
    favorites.push(item);
    saveFavorites(favorites);
  }
  
  return favorites;
};

export const removeFromFavorites = (productId: string): FavoriteItem[] => {
  const favorites = getFavorites().filter((item) => item.productId !== productId);
  saveFavorites(favorites);
  return favorites;
};

export const isFavorite = (productId: string): boolean => {
  return getFavorites().some((f) => f.productId === productId);
};

export const toggleFavorite = (item: FavoriteItem): FavoriteItem[] => {
  if (isFavorite(item.productId)) {
    return removeFromFavorites(item.productId);
  } else {
    return addToFavorites(item);
  }
};

export const getFavoritesCount = (): number => {
  return getFavorites().length;
};

