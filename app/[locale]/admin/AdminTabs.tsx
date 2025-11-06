"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const tabs = [
  { key: "users", label: "Users" },
  { key: "categories", label: "Categories" },
  { key: "products", label: "Products" },
  { key: "authors", label: "Authors" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  const activeKey =
    tabs.find((t) => pathname?.includes(`/admin/${t.key}`))?.key || "users";

  return (
    <div className="flex gap-2 border-b pb-2">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={
            pathname?.replace(
              /\/admin\/(users|categories|products|authors).*/,
              `/admin/${t.key}`
            ) || `/admin/${t.key}`
          }
        >
          <Button
            variant={activeKey === t.key ? "default" : "secondary"}
            className="rounded-b-none"
          >
            {t.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
