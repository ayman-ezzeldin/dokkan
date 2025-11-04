"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import type { FavoriteItem } from "@/lib/favorites";

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  isFavorite: (productId: string) => boolean;
  favoritesCount: number;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === "loading") return;

      if (!session?.user) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavorites(data.favorites || []);
        } else if (res.status === 401) {
          setFavorites([]);
        }
      } catch (error) {
        console.error("Failed to fetch favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [session, status]);

  const handleAddToFavorites = async (item: FavoriteItem) => {
    if (!session?.user) return;

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item }),
      });

      if (res.ok) {
        setFavorites((prev) => {
          const exists = prev.some((f) => f.productId === item.productId);
          if (exists) return prev;
          return [...prev, item];
        });
      }
    } catch (error) {
      console.error("Failed to add favorite:", error);
    }
  };

  const handleRemoveFromFavorites = async (productId: string) => {
    if (!session?.user) return;

    try {
      const res = await fetch(
        `/api/favorites?productId=${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.productId !== productId));
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  const handleToggleFavorite = async (item: FavoriteItem) => {
    if (!session?.user) return;

    const isFav = favorites.some((f) => f.productId === item.productId);
    if (isFav) {
      await handleRemoveFromFavorites(item.productId);
    } else {
      await handleAddToFavorites(item);
    }
  };

  const handleIsFavorite = (productId: string) => {
    return favorites.some((f) => f.productId === productId);
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
        loading,
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
