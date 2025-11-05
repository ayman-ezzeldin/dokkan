"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 cursor-pointer flex justify-between items-center"
      >
        <span className="font-medium">{q}</span>
        <span
          className={`text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`px-5 overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 opacity-100 pb-5" : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <div className="text-sm text-muted-foreground">{a}</div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations("FAQ");
  const items = [
    { q: t("q1.q"), a: t("q1.a") },
    { q: t("q2.q"), a: t("q2.a") },
    { q: t("q3.q"), a: t("q3.a") },
  ];
  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          {t("title")}
        </h2>
        <div className="space-y-3">
          {items.map((it, i) => (
            <Item key={i} q={it.q} a={it.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
