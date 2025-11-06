"use client";

import { useRouter, useSearchParams } from "next/navigation";

const options = [
  { value: "createdAt", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popularity", label: "Popularity" },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") || "createdAt";

  const onChange = (value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("sort", value);
    next.set("page", "1");
    router.push(`?${next.toString()}`);
  };

  return (
    <select
      className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      value={current}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Sort by"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}


