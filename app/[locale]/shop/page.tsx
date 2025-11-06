"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/CartProvider";

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  author?: { _id?: string; name?: string } | string | null;
  image?: string;
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

interface Author {
  _id: string;
  name: string;
}

export default function ShopPage() {
  const t = useTranslations("Shop");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {} = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    searchParams.getAll("author")
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "createdAt");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const isUpdatingFromUrl = useRef(false);
  const prevSearchParams = useRef<string>(searchParams.toString());

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    selectedCategories.forEach((c) => params.append("category", c));
    selectedAuthors.forEach((a) => params.append("author", a));
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());
    return params;
  }, [search, selectedCategories, selectedAuthors, sort, page]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = buildQueryString();
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
  }, [buildQueryString]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounce fetch when local filters/search/sort/page change
  const debounceId = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isUpdatingFromUrl.current) return;
    if (debounceId.current) clearTimeout(debounceId.current);
    debounceId.current = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => {
      if (debounceId.current) clearTimeout(debounceId.current);
    };
  }, [search, selectedCategories, selectedAuthors, sort, page, fetchProducts]);

  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (search) params.set("q", search);
    selectedCategories.forEach((c) => params.append("category", c));
    selectedAuthors.forEach((a) => params.append("author", a));
    if (sort) params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    const currentParams = new URLSearchParams(window.location.search);
    const paramsString = params.toString();
    const currentString = currentParams.toString();

    if (paramsString !== currentString) {
      router.replace(`/${locale}/shop?${params}`, { scroll: false });
    }
  }, [selectedCategories, selectedAuthors, search, sort, page, locale, router]);

  useEffect(() => {
    const currentParams = searchParams.toString();
    if (prevSearchParams.current === currentParams) {
      return;
    }
    prevSearchParams.current = currentParams;

    const qParam = searchParams.get("q") || "";
    const sortParam = searchParams.get("sort") || "createdAt";
    const pageParam = parseInt(searchParams.get("page") || "1");
    const cats = searchParams.getAll("category");
    const auths = searchParams.getAll("author");

    isUpdatingFromUrl.current = true;
    setSearch(qParam);
    setSort(sortParam);
    setPage(pageParam);
    setSelectedCategories(cats);
    setSelectedAuthors(auths);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
    fetch("/api/authors")
      .then((res) => res.json())
      .then((data) => setAuthors(data.authors || []))
      .catch(console.error);
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setPage(1);
      return next;
    });
  };

  const toggleAuthor = (id: string) => {
    setSelectedAuthors((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      setPage(1);
      return next;
    });
  };

  // Using ProductCard handles add-to-cart internally

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 space-y-6">
            <div>
              <Input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setPage(1);
                    const params = buildQueryString();
                    router.push(`/${locale}/shop?${params}`);
                  }
                }}
                className="w-full"
              />
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">{t("categories")}</h3>
              <div className="space-y-1 max-h-64 overflow-auto pr-2">
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(c._id)}
                      onChange={() => toggleCategory(c._id)}
                    />
                    <span>{c.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">{t("authors")}</h3>
              <div className="space-y-1 max-h-64 overflow-auto pr-2">
                {authors.map((a) => (
                  <label
                    key={a._id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAuthors.includes(a._id)}
                      onChange={() => toggleAuthor(a._id)}
                    />
                    <span>{a.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="text-center py-12">{t("loading")}</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">{t("noProducts")}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      slug={product.slug}
                      title={product.title}
                      author={product.author}
                      images={
                        product.images && product.images.length > 0
                          ? product.images
                          : product.image
                          ? [product.image]
                          : []
                      }
                      price={product.price}
                    />
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
