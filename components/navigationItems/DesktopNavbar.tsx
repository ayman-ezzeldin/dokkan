"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import SearchModal from "./SearchModal";
import { navigationItems } from "./types";
import { useEffect, useState } from "react";

const DesktopNavbar = () => {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  return (
    <div className="hidden md:flex md:items-center md:justify-between md:w-full md:ml-8 md:gap-3">
      {/* Search Bar - Left */}
      <div className="flex-1 max-w-[200px] border-b hover:border-primary/50 transition-all duration-200">
        <SearchModal>
          <Button className="w-full justify-start text-muted-foreground border-0 transition-all duration-200 bg-transparent hover:bg-transparent hover:text-primary">
            <Search className="mr-2 h-4 w-4" />
            {t("searchPlaceholder")}
          </Button>
        </SearchModal>
      </div>

      {/* Navigation Links - Center */}
      <div className="flex items-center space-x-8">
        {navigationItems.map((item) => {
          const href =
            item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
          return (
            <Link
              key={item.href}
              href={href}
              className="text-sm font-medium transition-all duration-200 hover:text-primary relative group"
            >
              {t(item.labelKey)}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
            </Link>
          );
        })}
      </div>

      {/* Theme Toggle, Language Switcher & Avatar - Right */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <LanguageSwitcher />
        <Avatar className="h-9 w-9 ring-2 ring-border/20 hover:ring-primary/30 transition-all duration-200 cursor-pointer">
          <AvatarImage src="/images//placeholder-avatar.png" alt="User" />
          <AvatarFallback className="text-sm font-semibold bg-linear-to-br from-primary/20 to-primary/10">
            EZ
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DesktopNavbar;
