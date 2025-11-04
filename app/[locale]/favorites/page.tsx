"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";
import { useFavorites } from "@/components/FavoritesProvider";
import FavoriteButton from "@/components/FavoriteButton";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Shop");
  const locale = useLocale();
  const { addToCart } = useCart();
  const { favorites } = useFavorites();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const slugs = favorites.map((f) => f.slug);
        const productPromises = slugs.map(async (slug) => {
          try {
            const res = await fetch(`/api/products/${slug}`);
            if (res.ok) {
              const product = await res.json();
              return product;
            }
            return null;
          } catch {
            return null;
          }
        });

        const fetchedProducts = await Promise.all(productPromises);
        const validProducts = fetchedProducts.filter((p) => p !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch favorite products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images[0] || "/images/logo.png",
      slug: product.slug,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-8">Favorites</h1>
          <div className="text-center py-12">{t("loading")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>

        {favorites.length === 0 || products.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding products to your favorites to see them here
            </p>
            <Button asChild>
              <Link href={`/${locale}/shop`}>Browse Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card relative"
              >
                <Link href={`/${locale}/product/${product.slug}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={product.images?.[0] || "/images/logo.png"}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    <FavoriteButton
                      productId={product._id}
                      item={{
                        productId: product._id,
                        slug: product.slug,
                        title: product.title,
                        price: product.price,
                        image: product.images?.[0] || "/images/logo.png",
                      }}
                    />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/${locale}/product/${product.slug}`}>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold mb-4">
                    {product.price} {product.currency}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Link href={`/${locale}/product/${product.slug}`}>
                        {t("viewDetails")}
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? t("outOfStock") : t("addToCart")}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

