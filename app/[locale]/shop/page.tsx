"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export default function ShopPage() {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    try {
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const qParam = searchParams.get("q") || "";
    const catParam = searchParams.get("category") || "";
    const minParam = searchParams.get("minPrice") || "";
    const maxParam = searchParams.get("maxPrice") || "";
    const sortParam = searchParams.get("sort") || "createdAt";
    const pageParam = parseInt(searchParams.get("page") || "1");
    setSearch(qParam);
    setSelectedCategory(catParam);
    setMinPrice(minParam);
    setMaxPrice(maxParam);
    setSort(sortParam);
    setPage(pageParam);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const handleSearch = () => {
    setPage(1);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (selectedCategory) params.set("category", selectedCategory);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort !== "createdAt") params.set("sort", sort);
    router.push(`/${locale}/shop?${params}`);
    fetchProducts();
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0] || "/images/logo.png",
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t("filterByCategory")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                aria-label={t("filterByCategory")}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("priceRange")}
              </label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={t("minPrice")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t("maxPrice")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t("sortBy")}
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
                aria-label={t("sortBy")}
              >
                <option value="createdAt">{t("sortNewest")}</option>
                <option value="price">{t("sortPriceAsc")}</option>
              </select>
            </div>

            <Button onClick={handleSearch} className="w-full">
              {t("search")}
            </Button>
          </aside>

          <main className="flex-1">
            <div className="mb-4">
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-md"
              />
            </div>

            {loading ? (
              <div className="text-center py-12">{t("loading")}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">{t("noProducts")}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative"
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
                            {product.stock === 0
                              ? t("outOfStock")
                              : t("addToCart")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4">
                      {t("page")} {pagination.page} {t("of")}{" "}
                      {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage(Math.min(pagination.totalPages, page + 1))
                      }
                      disabled={page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
