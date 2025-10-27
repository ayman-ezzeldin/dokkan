"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Navbar");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log("Searching for:", searchQuery);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

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
        <form onSubmit={handleSearch} className="space-y-4">
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
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-border/50 hover:border-border"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!searchQuery.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {t("search")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
