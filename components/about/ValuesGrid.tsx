"use client";

import { BookOpen, Heart, Users, Accessibility } from "lucide-react";
import { useTranslations } from "next-intl";

const icons = [BookOpen, Heart, Users, Accessibility];

export default function ValuesGrid() {
  const t = useTranslations("About.values");
  const values = [
    { icon: icons[0], title: t("v1.title"), desc: t("v1.desc") },
    { icon: icons[1], title: t("v2.title"), desc: t("v2.desc") },
    { icon: icons[2], title: t("v3.title"), desc: t("v3.desc") },
    { icon: icons[3], title: t("v4.title"), desc: t("v4.desc") },
  ];
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8" style={{ fontFamily: "var(--font-playfair)" }}>{t("title")}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border/50 p-6 bg-background/60 transition-shadow duration-300 hover:shadow-xl">
              <Icon className="w-6 h-6 text-primary" />
              <div className="mt-3 font-semibold">{title}</div>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


