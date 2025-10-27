"use client";

import { Logo, DesktopNavbar, MobileNavigation } from "./navigationItems";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
          : "border-b-0 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex md:gap-3 h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavbar />

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
