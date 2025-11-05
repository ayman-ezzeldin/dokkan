"use client";

import { useEffect, useRef, useState } from "react";
import { Library, Smile, Calendar, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

type Stat = { label: string; value: number; suffix?: string; icon: React.ComponentType<any> };

let raw: Stat[] = [];

export default function Statistics() {
  const t = useTranslations("About.stats");
  raw = [
    { label: t("books"), value: 10000, suffix: "+", icon: Library },
    { label: t("customers"), value: 5000, suffix: "+", icon: Smile },
    { label: t("years"), value: 5, suffix: "+", icon: Calendar },
    { label: t("daily"), value: 50, suffix: "+", icon: Truck },
  ];
  const [start, setStart] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setStart(true);
      });
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {raw.map((s) => (
          <CounterCard key={s.label} {...s} start={start} />
        ))}
      </div>
    </section>
  );
}

function CounterCard({ label, value, suffix = "", icon: Icon, start }: Stat & { start: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!start) return;
    const duration = 2000;
    const startAt = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - startAt) / duration);
      setDisplay(Math.floor(value * easeOutCubic(p)));
      if (p < 1) requestAnimationFrame(tick);
    };
    const r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [start, value]);
  return (
    <div className="rounded-xl border border-border/50 p-6 text-center">
      <div className="mx-auto w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <Icon className="w-5 h-5" />
      </div>
      <div className="mt-3 text-3xl font-extrabold">{display.toLocaleString()}{suffix}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function easeOutCubic(x: number) {
  return 1 - Math.pow(1 - x, 3);
}


