"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function CTASection() {
  const locale = useLocale();
  const t = useTranslations("About.cta");
  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-6 text-center rounded-2xl border border-border/50 bg-linear-to-r from-primary/10 via-transparent to-secondary/10">
        <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
          {t("title")}
        </h2>
        <p className="mt-3 text-muted-foreground">{t("subtitle")}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}/shop`} className="inline-flex items-center justify-center px-5 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors">
            {t("browse")}
          </Link>
          <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center px-5 py-3 rounded-lg border border-border/50 hover:border-primary/60 transition-colors">
            {t("contact")}
          </Link>
        </div>
      </div>
    </section>
  );
}


