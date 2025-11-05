"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Testimonials() {
  const t = useTranslations("Testimonials");
  const items = [
    { name: "Maya", role: t("roles.designer"), quote: t("q1"), avatar: "/images/avatar1.png" },
    { name: "Omar", role: t("roles.marketer"), quote: t("q2"), avatar: "/images/avatar2.png" },
    { name: "Sara", role: t("roles.engineer"), quote: t("q3"), avatar: "/images/avatar3.png" },
  ];
  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{t("title")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <div key={i} className="rounded-xl border border-border/50 p-6 bg-background/60">
              <div className="flex items-center gap-3 mb-4">
                <Image src={it.avatar} alt={it.name} width={40} height={40} className="rounded-full" />
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-xs text-muted-foreground">{it.role}</div>
                </div>
              </div>
              <p className="text-sm leading-6 text-foreground/90">“{it.quote}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


