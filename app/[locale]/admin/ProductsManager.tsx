"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type ProductRow = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
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

export default function ProductsManager() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  async function addProduct() {
    try {
      const body = {
        title: newTitle,
        slug: newSlug,
        description: newTitle,
        images: [],
        price: Number(newPrice),
        currency: "USD",
        stock: 0,
        isActive: true,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setProducts((p) => [data.product, ...p]);
      setNewTitle("");
      setNewSlug("");
      setNewPrice("");
      toast.success("Product created");
    } catch (e: any) {
      toast.error(extractErrorMessage(e, "Failed to create"));
    }
  }

  async function remove(id: string) {
    const prev = products;
    setProducts((p) => p.filter((x) => x._id !== id));
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw data;
      }
      toast.success("Deleted");
    } catch (e: any) {
      setProducts(prev);
      toast.error(extractErrorMessage(e, "Delete failed"));
    }
  }

  if (loading) return <div className="text-sm">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <div>
          <div className="text-xs font-medium mb-1">Title</div>
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-48"
          />
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Slug</div>
          <Input
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            className="w-48"
          />
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Price</div>
          <Input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-32"
          />
        </div>
        <Button
          onClick={addProduct}
          disabled={!newTitle || !newSlug || !newPrice}
        >
          Add product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Active</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.slug}</td>
                <td className="py-2 pr-4">{p.price}</td>
                <td className="py-2 pr-4">{p.stock}</td>
                <td className="py-2 pr-4">{p.isActive ? "Yes" : "No"}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => remove(p._id)}
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
