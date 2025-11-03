"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SearchModalProps {
  children: React.ReactNode;
}

const SearchModal = ({ children }: SearchModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<{ _id: string; title: string; slug: string; images?: string[] }[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("Navbar");
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products?q=${encodeURIComponent(q)}&perPage=6`);
        const data = await res.json();
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className=" max-w-[85%] sm:max-w-md bg-background/95 backdrop-blur-sm border-0 [&>button]:hidden">
        <DialogHeader className="relative">
          <DialogTitle className="text-foreground text-xl font-semibold text-center">
            {t("searchTitle")}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 h-6 w-6 text-muted-foreground hover:text-foreground rtl:right-auto rtl:left-0"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t("searchInputPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-200"
              autoFocus
            />
          </div>
          {searchQuery.trim() ? (
            <div className="border rounded-md max-h-80 overflow-auto divide-y">
              {loading ? (
                <div className="p-3 text-sm text-muted-foreground">{t("loading")}</div>
              ) : results.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">{t("noResults")}</div>
              ) : (
                results.map((p) => (
                  <button
                    key={p._id}
                    className="w-full text-left p-3 hover:bg-accent"
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                      router.push(`/${locale}/product/${p.slug}`);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={(p.images && p.images[0]) || "/images/logo.png"}
                        alt={p.title}
                        className="w-10 h-10 rounded object-cover border"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium line-clamp-1">{p.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">/{p.slug}</div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
