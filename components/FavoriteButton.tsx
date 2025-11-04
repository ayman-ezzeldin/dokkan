"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/components/FavoritesProvider";
import type { FavoriteItem } from "@/lib/favorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  productId: string;
  item: FavoriteItem;
  variant?: "default" | "icon" | "outline";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  className?: string;
}

export default function FavoriteButton({
  productId,
  item,
  variant = "icon",
  size = "sm",
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(item);
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size={size}
        className={cn(
          "absolute top-2 right-2 z-10 rounded-full p-2 h-auto w-auto bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all",
          favorited && "text-red-500 hover:text-red-600",
          className
        )}
        onClick={handleClick}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            favorited && "fill-current"
          )}
        />
      </Button>
    );
  }

  return (
    <Button
      variant={variant === "outline" ? "outline" : "default"}
      size={size}
      className={cn(
        "gap-2",
        favorited && "text-red-500 border-red-500 hover:text-red-600 hover:border-red-600",
        className
      )}
      onClick={handleClick}
    >
      <Heart
        className={cn(
          "h-4 w-4 transition-all",
          favorited && "fill-current"
        )}
      />
      {favorited ? "Favorited" : "Favorite"}
    </Button>
  );
}

