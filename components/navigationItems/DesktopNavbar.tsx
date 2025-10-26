"use client";

import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle";
import SearchModal from "./SearchModal";
import { navigationItems } from "./types";

const DesktopNavbar = () => {
  return (
    <div className="hidden md:flex md:items-center md:justify-between md:w-full md:ml-8 md:gap-3">
      {/* Search Bar - Left */}
      <div className="flex-1 max-w-sm">
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

      {/* Navigation Links - Center */}
      <div className="flex items-center space-x-8">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium transition-all duration-200 hover:text-primary relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Theme Toggle & Avatar - Right */}
      <div className="flex items-center space-x-4">
        <ModeToggle />
        <Avatar className="h-9 w-9 ring-2 ring-border/20 hover:ring-primary/30 transition-all duration-200 cursor-pointer">
          <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
          <AvatarFallback className="text-sm font-semibold bg-linear-to-br from-primary/20 to-primary/10">
            EZ
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DesktopNavbar;
