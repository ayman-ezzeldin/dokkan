import { ModeToggle } from "@/components/ModeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocaleDisplay } from "@/components/LocaleDisplay";
import { Button } from "@/components/ui/button";
import Hero from "@/components/Hero";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "Hero" });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Rest of the content */}
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1>{t("title")}</h1>
            <p>{t("desc")}</p>

            <h1 className="max-w-xs text-5xl leading-10 tracking-tight font-extrabold text-green-500 dark:text-green-500">
              Ayman Ezz
            </h1>

            <Button>Click me</Button>
            <div className="flex gap-4 items-center">
              <ModeToggle />
              <LanguageSwitcher />
            </div>

            <LocaleDisplay />
          </div>
        </main>
      </div>
    </div>
  );
}
