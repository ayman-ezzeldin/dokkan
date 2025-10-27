"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative h-[calc(100vh-65px)] flex items-center overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Main Title */}
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none font-serif">
                <span className="block bg-gradient-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x font-extrabold tracking-tight font-display">
                  BOOKSTORE
                </span>
                <span className="block text-4xl md:text-5xl lg:text-6xl font-light bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mt-2 tracking-wide font-serif">
                  PARADISE
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-light leading-relaxed max-w-2xl">
                Discover{" "}
                <span className="text-primary font-semibold">
                  extraordinary
                </span>{" "}
                stories that
                <span className="text-primary font-semibold"> ignite</span> your
                imagination
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary via-pink-500 to-purple-600 hover:from-primary/90 hover:via-pink-500/90 hover:to-purple-600/90 text-white font-bold text-lg px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-primary/25"
                >
                  ✨ Explore Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary hover:via-pink-500 hover:to-purple-600 hover:text-white font-semibold text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all duration-300"
                >
                  📚 Browse
                </Button>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute inset-0 z-10">
                {/* Floating Books */}
                <div className="absolute top-10 left-10 w-16 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-2xl transform rotate-12 animate-float-slow opacity-80" />
                <div className="absolute top-20 right-10 w-12 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg shadow-2xl transform -rotate-12 animate-float-medium opacity-70" />
                <div className="absolute bottom-20 left-10 w-14 h-18 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-2xl transform rotate-6 animate-float-fast opacity-60" />

                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse opacity-40" />
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse opacity-50" />
                <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-30" />
              </div>

              {/* Main Image */}
              <div className="relative z-20 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/heroImg.jpg"
                  alt="Bookstore Hero"
                  width={500}
                  height={600}
                  className="object-cover w-full h-[400px] lg:h-[500px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/20" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/70 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
