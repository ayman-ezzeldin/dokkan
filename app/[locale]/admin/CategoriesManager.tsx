"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type CategoryRow = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
};

function extractErrorMessage(data: any, fallback = "Failed") {
  if (!data) return fallback;
  if (data.details && Array.isArray(data.details)) {
    return data.details
      .map((d: any) => `${d.path?.join?.(".") || ""}: ${d.message}`)
      .join("; ");
  }
  if (data.error && data.key) {
    return `${data.error}: ${Object.entries(data.key)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`;
  }
  return data.error || fallback;
}

export default function CategoriesManager() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  }, []);

  async function addCategory() {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, isActive: true }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setCategories((c) => [data.category, ...c]);
      setName("");
      setSlug("");
      toast.success("Category created");
    } catch (e: any) {
      toast.error(extractErrorMessage(e, "Failed to create"));
    }
  }

  async function remove(id: string) {
    const prev = categories;
    setCategories((c) => c.filter((x) => x._id !== id));
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw data;
      }
      toast.success("Deleted");
    } catch (e: any) {
      setCategories(prev);
      toast.error(extractErrorMessage(e, "Delete failed"));
    }
  }

  if (loading) return <div className="text-sm">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div>
          <div className="text-xs font-medium mb-1">Name</div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-48"
          />
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Slug</div>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-48"
          />
        </div>
        <Button onClick={addCategory} disabled={!name || !slug}>
          Add category
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Active</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-b last:border-0">
                <td className="py-2 pr-4">{c.name}</td>
                <td className="py-2 pr-4">{c.slug}</td>
                <td className="py-2 pr-4">{c.isActive ? "Yes" : "No"}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(c._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
