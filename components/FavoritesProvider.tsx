"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
  FavoriteItem,
  getFavorites,
  addToFavorites as add,
  removeFromFavorites as remove,
  toggleFavorite as toggle,
  isFavorite as checkIsFavorite,
} from "@/lib/favorites";

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (item: FavoriteItem) => void;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    if (typeof window !== "undefined") {
      return getFavorites();
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFavorites(getFavorites());
    }
  }, []);

  const handleAddToFavorites = (item: FavoriteItem) => {
    const newFavorites = add(item);
    setFavorites(newFavorites);
  };

  const handleRemoveFromFavorites = (productId: string) => {
    const newFavorites = remove(productId);
    setFavorites(newFavorites);
  };

  const handleToggleFavorite = (item: FavoriteItem) => {
    const newFavorites = toggle(item);
    setFavorites(newFavorites);
  };

  const handleIsFavorite = (productId: string) => {
    return checkIsFavorite(productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites: handleAddToFavorites,
        removeFromFavorites: handleRemoveFromFavorites,
        toggleFavorite: handleToggleFavorite,
        isFavorite: handleIsFavorite,
        favoritesCount: favorites.length,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}

