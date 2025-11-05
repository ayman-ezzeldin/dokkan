"use client";

import { useTranslations } from "next-intl";

export default function PerformanceMetrics() {
  const t = useTranslations("Metrics");
  const items = [
    { value: "99.9%", label: t("uptime") },
    { value: "2x", label: t("speed") },
    { value: "+35%", label: t("conversions") },
    { value: "120ms", label: t("latency") },
  ];
  return (
    <section className="py-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">{t("title")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((m, i) => (
            <div key={i} className="rounded-xl border border-border/50 p-6 text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{m.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


