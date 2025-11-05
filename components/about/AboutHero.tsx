"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function AboutHero() {
  const t = useTranslations("About");
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative h-[60vh] md:h-[70vh] overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/40 to-black/30" />
      <div className="relative z-10 max-w-6xl mx-auto h-full px-6 flex flex-col items-center justify-center text-center text-white">
        <h1
          className={`text-4xl md:text-6xl font-extrabold tracking-tight transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("hero.title")}
        </h1>
        <p
          className={`mt-4 max-w-2xl text-base md:text-lg text-white/90 transition-all duration-700 delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {t("hero.subtitle")}
        </p>
        <div className="absolute bottom-6 animate-bounce text-white/80" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}


