"use client";

import { Logo, DesktopNavbar, MobileNavigation } from "./navigationItems";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setIsScrolled(scrollTop > 10);
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 `}>
      <div
        className={`max-w-7xl mx-auto px-4 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className={`flex md:gap-3 h-16 items-center justify-between`}>
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavbar />

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>

        {/* Dynamic Progress Border */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-primary via-pink-500 to-purple-600"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
