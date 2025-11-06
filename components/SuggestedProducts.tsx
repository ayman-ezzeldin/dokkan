"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/shop/ProductCard";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "/api/products?perPage=6&page=1&sort=createdAt"
        );
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

  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Suggested Products
          </h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("suggestedTitle")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("suggestedSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              slug={product.slug}
              title={product.title}
              images={product.images}
              price={product.price}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/shop`}>View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
