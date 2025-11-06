"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("Hero");
  const locale = useLocale();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pb-1 flex items-center overflow-hidden bg-background min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-12 items-center ">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-start">
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {/* Main Title */}
              <h1
                className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none"
                style={{
                  fontFamily:
                    locale === "ar"
                      ? "var(--font-reem-ar)"
                      : "var(--font-dancing)",
                }}
              >
                <span className="block bg-linear-to-r from-primary via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x font-extrabold tracking-tight pb-2">
                  {t("title")}
                </span>
                <span
                  className="block text-4xl md:text-5xl lg:text-6xl font-light bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mt-2 tracking-wide"
                  style={{
                    fontFamily:
                      locale === "ar" ? "var(--font-reem-ar)" : undefined,
                  }}
                >
                  {t("subtitle")}
                </span>
              </h1>

              {/* description */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("description")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold text-base px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  {t("exploreBooks")}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-primary/20 text-primary hover:bg-primary hover:text-white font-medium text-base px-6 py-3 rounded-xl hover:border-primary transition-all duration-300 hover:shadow-lg"
                >
                  {t("learnMore")}
                </Button>
              </div>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative">
              {/* Main Image */}
              <div className="relative z-20 rounded-2xl">
                <Image
                  src="/images/heroImg.png"
                  alt="Bookstore Hero"
                  width={500}
                  height={600}
                  className="object-cover w-full h-[400px] lg:h-[500px] group-hover:scale-105 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
