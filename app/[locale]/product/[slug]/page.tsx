"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: string;
  images: string[];
  price: number;
  currency: string;
  categoryId?: string;
  tags: string[];
  stock: number;
}

export default function ProductPage() {
  const t = useTranslations("Product");
  const locale = useLocale();
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.slug) {
      fetch(`/api/products/${params.slug}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [params.slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product._id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.images[0] || "/images/logo.png",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">{t("loading")}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t("notFound")}</h1>
          <Button asChild>
            <Link href={`/${locale}/shop`}>Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          ← Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
              <Image
                src={
                  product.images[selectedImage] ||
                  product.images[0] ||
                  product.image ||
                  "/images/logo.png"
                }
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-3xl font-bold mb-6">
              {product.price} {product.currency}
            </p>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t("description")}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {product.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">{t("tags")}</h2>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm mb-2">
                <span className="font-semibold">{t("stock")}:</span>{" "}
                {product.stock > 0 ? (
                  <span className="text-green-500">
                    {t("inStock")} ({product.stock})
                  </span>
                ) : (
                  <span className="text-red-500">{t("outOfStock")}</span>
                )}
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              {product.stock === 0 ? t("outOfStock") : t("addToCart")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
