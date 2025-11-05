"use client";

import { useTranslations } from "next-intl";

export default function MissionStatement() {
  const t = useTranslations("About");
  return (
    <section className="py-16 bg-[--color-custom-bg] text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-white"
          >
            <path
              d="M3 4h18v12a4 4 0 01-4 4H7a4 4 0 01-4-4V4z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 8h10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 12h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          {t("mission.title")}
        </h2>
        <p className="text-lg leading-8 text-white/90 max-w-3xl mx-auto">
          {t("mission.body")}
        </p>
      </div>
    </section>
  );
}
