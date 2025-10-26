"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ModeToggle";
import SearchModal from "./SearchModal";
import { navigationItems } from "./types";

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

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
            <div className="p-6 border-b bg-linear-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                    <AvatarFallback className="text-lg font-bold bg-linear-to-br from-primary/30 to-primary/10">
                      EZ
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">Welcome!</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore our books
                    </p>
                  </div>
                </div>
                <ModeToggle />
              </div>
            </div>

            {/* Search Section */}
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold mb-3">Search Books</h3>
              <SearchModal>
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 border-border/50 hover:border-border transition-all duration-200"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search for books...
                </Button>
              </SearchModal>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 p-6">
              <h3 className="text-lg font-semibold mb-4">Navigation</h3>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-lg font-medium transition-all duration-200 hover:text-primary hover:bg-accent/50 rounded-lg group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/30">
              <p className="text-sm text-muted-foreground text-center">
                📚 Dokkan Bookstore
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
