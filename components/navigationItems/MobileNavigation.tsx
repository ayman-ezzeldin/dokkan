"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import SearchModal from "./SearchModal";
import { navigationItems } from "./types";
import { useSession, signOut, signIn } from "next-auth/react";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <div className="flex md:hidden items-center space-x-3">
      {/* Search Button */}
      <SearchModal>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </SearchModal>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] sm:w-[400px] p-0">
          <div className="flex flex-col h-full">
            {/* Header with Avatar and Theme Toggle */}
            <div className="p-6 pt-10 bg-linear-to-r from-primary/5 to-primary/10">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage
                    src="/images//placeholder-avatar.png"
                    alt="User"
                  />
                  <AvatarFallback className="text-lg font-bold bg-linear-to-br from-primary/30 to-primary/10">
                    EZ
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{t("welcome")}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t("exploreBooks")}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-3">{t("searchTitle")}</h3>
              <SearchModal>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 border-border/50 hover:border-border transition-all duration-200"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {t("searchPlaceholder")}
                </Button>
              </SearchModal>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold mb-4">{t("navigation")}</h3>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => {
                  const href =
                    item.href === "/" ? `/${locale}` : `/${locale}${item.href}`;
                  return (
                    <Link
                      key={item.href}
                      href={href}
                      className="flex items-center px-4 py-3 text-lg font-medium transition-all duration-200 hover:text-primary hover:bg-accent/50 rounded-lg group"
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="relative">
                        {t(item.labelKey)}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer with Controls */}
            <div className="p-6 bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  📚 {t("bookstoreName")}
                </p>
                <div className="flex items-center space-x-2">
                  <ModeToggle />
                  <LanguageSwitcher />
                </div>
              </div>
              {session?.user ? (
                <div className="flex gap-2">
                  <Link
                    href={`/${locale}/account`}
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    <Button className="w-full">Account</Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsOpen(false);
                      signOut({ callbackUrl: `/${locale}` });
                    }}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    setIsOpen(false);
                    signIn(undefined, { callbackUrl: `/${locale}` });
                  }}
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
