"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    // Extract current locale from pathname
    const currentLocale = pathname.split("/")[1];
    const newLocale = currentLocale === "ar" ? "en" : "ar";

    // Replace the locale in the pathname
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const getCurrentLocale = () => {
    return pathname.split("/")[1] || "en";
  };

  return (
    <Button
      onClick={switchLanguage}
      variant="outline"
      className="flex items-center gap-2"
    >
      {getCurrentLocale() === "ar" ? "En" : "Ar"}
    </Button>
  );
}
