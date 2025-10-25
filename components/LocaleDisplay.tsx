"use client";

import { usePathname } from "next/navigation";

export function LocaleDisplay() {
  const pathname = usePathname();

  const getCurrentLocale = () => {
    return pathname.split("/")[1] || "en";
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Current Locale:</h3>
      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        {getCurrentLocale().toUpperCase()}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        Full path: {pathname}
      </p>
    </div>
  );
}
