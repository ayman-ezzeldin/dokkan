"use client";

import { CheckCircle2, PackageCheck, ShieldCheck, Headphones, Tags, RotateCcw, Sparkles, BookMarked } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WhyChooseUs() {
  const t = useTranslations("About.why");
  const items = [
    { icon: BookMarked, text: t("i1") },
    { icon: PackageCheck, text: t("i2") },
    { icon: ShieldCheck, text: t("i3") },
    { icon: Headphones, text: t("i4") },
    { icon: Tags, text: t("i5") },
    { icon: RotateCcw, text: t("i6") },
    { icon: CheckCircle2, text: t("i7") },
    { icon: Sparkles, text: t("i8") },
  ];
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>{t("title")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 rounded-xl border border-border/50 p-4 bg-background/60">
              <div className="text-primary mt-0.5"><Icon className="w-5 h-5" /></div>
              <p className="text-sm text-foreground/90">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


