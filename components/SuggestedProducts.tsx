"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";
import FavoriteButton from "@/components/FavoriteButton";

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  stock: number;
}

export default function SuggestedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("Shop");
  const locale = useLocale();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?perPage=6&page=1&sort=createdAt");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
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
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Suggested Products</h2>
          <div className="text-center py-12">{t("loading")}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Suggested Products</h2>
          <p className="text-muted-foreground text-lg">Discover our handpicked selection</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-card relative"
            >
              <Link href={`/${locale}/product/${product.slug}`}>
                <div className="relative aspect-square">
                  <Image
                    src={product.images[0] || "/images/logo.png"}
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
                      image: product.images[0] || "/images/logo.png",
                    }}
                  />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/${locale}/product/${product.slug}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm min-h-[2.5rem]">
                    {product.title}
                  </h3>
                </Link>
                <p className="text-lg font-bold mb-4">
                  {product.price} {product.currency}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link href={`/${locale}/product/${product.slug}`}>
                      {t("viewDetails")}
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    className="w-full"
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

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/shop`}>
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

