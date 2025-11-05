"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function PersistentCTA() {
  const t = useTranslations("CTA");
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-full shadow-lg border border-border/50 bg-background/80 backdrop-blur px-3 py-3">
        <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
          {t("getStarted")}
        </Button>
      </div>
    </div>
  );
}


