"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  return (
    <footer className="mt-16 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Dokkan Logo"
              width={42}
              height={42}
              className="w-20 h-12"
            />
          </Link>
          <p className="text-sm text-muted-foreground mt-2">{t("tagline")}</p>
        </div>
        <div>
          <div className="font-semibold mb-3">{t("links")}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/${locale}/shop`} className="hover:underline">
                {t("shop")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/about`} className="hover:underline">
                {t("about")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/favorites`} className="hover:underline">
                {t("favorites")}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3">{t("legal")}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href={`/${locale}/privacy`} className="hover:underline">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/terms`} className="hover:underline">
                {t("terms")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Dokkan
      </div>
    </footer>
  );
}
