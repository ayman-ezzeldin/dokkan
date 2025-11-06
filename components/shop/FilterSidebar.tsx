"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";

interface Props {
  categories: { _id: string; name: string }[];
}

export default function FilterSidebar({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.set("page", "1");
    router.push(`?${next.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Category</label>
        <select
          className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          value={category}
          onChange={(e) => update("category", e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Price</label>
        <div className="space-y-2">
          <Input type="number" placeholder="Min" defaultValue={minPrice} onBlur={(e) => update("minPrice", e.target.value)} />
          <Input type="number" placeholder="Max" defaultValue={maxPrice} onBlur={(e) => update("maxPrice", e.target.value)} />
        </div>
      </div>
      <button
        className="h-9 w-full rounded-md border border-input text-sm"
        onClick={() => {
          const next = new URLSearchParams(searchParams.toString());
          ["category", "minPrice", "maxPrice", "q"].forEach((k) => next.delete(k));
          next.set("page", "1");
          router.push(`?${next.toString()}`);
        }}
      >
        Clear filters
      </button>
    </div>
  );
}


