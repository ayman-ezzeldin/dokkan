"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function OurStory() {
  const t = useTranslations("About");
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>{t("story.title")}</h2>
          <p className="text-muted-foreground leading-7 mb-4">{t("story.p1")}</p>
          <p className="text-muted-foreground leading-7">{t("story.p2")}</p>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/50 p-4"><div className="text-2xl font-extrabold">2019</div><div className="text-xs text-muted-foreground">{t("story.founded")}</div></div>
            <div className="rounded-xl border border-border/50 p-4"><div className="text-2xl font-extrabold">10k+</div><div className="text-xs text-muted-foreground">{t("story.booksSold")}</div></div>
            <div className="rounded-xl border border-border/50 p-4"><div className="text-2xl font-extrabold">5k+</div><div className="text-xs text-muted-foreground">{t("story.happyCustomers")}</div></div>
            <div className="rounded-xl border border-border/50 p-4"><div className="text-2xl font-extrabold">5+</div><div className="text-xs text-muted-foreground">{t("story.years")}</div></div>
          </div>
        </div>
        <div className="relative order-1 md:order-2">
          <div className="relative rounded-2xl overflow-hidden border border-border/50">
            <Image src="/images/story.jpg" alt={t("story.alt", { default: "Our bookstore journey" })} width={800} height={600} className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}


