"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type ProductRow = {
  _id: string;
  title: string;
  slug: string;
  image?: string;
  images?: string[];
  price: number;
  stock: number;
  isActive: boolean;
  categoryId?: string;
  author?: { _id: string; name: string } | string;
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
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  // slug auto-generated on server
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newAuthorId, setNewAuthorId] = useState("");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [authors, setAuthors] = useState<{ _id: string; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [edit, setEdit] = useState<{
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string;
    price: string;
    amount: string;
    categoryId: string;
    author?: string;
  } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (q) params.set("q", q);
    Promise.all([
      fetch(`/api/admin/products?${params.toString()}`).then((r) => r.json()),
      fetch("/api/admin/categories")
        .then((r) => r.json())
        .catch(() => ({ categories: [] })),
      fetch("/api/authors")
        .then((r) => r.json())
        .catch(() => ({ authors: [] })),
    ])
      .then(([p, c, a]) => {
        setProducts(p.products || []);
        setTotal(p.total || 0);
        setCategories(c.categories || []);
        setAuthors(a.authors || []);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setLoading(false));
  }, [q, page, pageSize]);

  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function addProduct() {
    try {
      const body = {
        title: newTitle,
        // slug generated server-side
        description: newDescription,
        image: newImage,
        images: [],
        price: Number(newPrice),
        currency: "USD",
        categoryId: newCategoryId,
        author: newAuthorId,
        amount: Number(newAmount),
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

      setNewPrice("");
      setNewDescription("");
      setNewImage("");
      setNewAmount("");
      setNewCategoryId("");
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

  function startEdit(p: ProductRow) {
    const authorId =
      typeof p.author === "object" && p.author?._id
        ? p.author._id
        : typeof p.author === "string"
        ? p.author
        : "";
    setEdit({
      id: p._id,
      title: p.title,
      slug: p.slug,
      description: "",
      image: p.image || (p.images && p.images[0]) || "",
      price: String(p.price),
      amount: String(p.stock),
      categoryId: (p as any).categoryId || "",
      author: authorId,
    });
    setEditOpen(p._id);
  }

  async function saveEdit() {
    if (!edit) return;
    try {
      const body: any = {
        title: edit.title,
        slug: edit.slug,
        description: edit.description || edit.title,
        image: edit.image,
        price: Number(edit.price),
        amount: Number(edit.amount),
        stock: Number(edit.amount),
      };
      if (edit.categoryId) body.categoryId = edit.categoryId;
      if (edit.author && edit.author.trim()) body.author = edit.author.trim();
      const res = await fetch(`/api/admin/products/${edit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (q) params.set("q", q);
      const [p, a] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`).then((r) => r.json()),
        fetch("/api/authors")
          .then((r) => r.json())
          .catch(() => ({ authors: [] })),
      ]);
      setProducts(p.products || []);
      setAuthors(a.authors || []);
      setEditOpen(null);
      toast.success("Product updated");
    } catch (e: any) {
      toast.error(extractErrorMessage(e, "Failed to update"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          value={searchInput}
          onChange={(e) => {
            setPage(1);
            setSearchInput(e.target.value);
          }}
          placeholder="Search products..."
          className="h-10 border rounded px-3 w-full max-w-sm text-sm"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Product</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <div>
                <div className="text-xs font-medium mb-1">Title</div>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div>
                <div className="text-xs font-medium mb-1">Description</div>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="h-24 border rounded px-3 py-2 w-full"
                />
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Image</div>
                <Dropzone
                  onFile={async (file) => {
                    const fd = new FormData();
                    fd.append("file", file);
                    if (newTitle) fd.append("title", newTitle);
                    setUploading(true);
                    try {
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: fd,
                      });
                      const data = await res.json();
                      if (!res.ok) throw data;
                      setNewImage(data.url);
                    } catch (err) {
                      toast.error("Upload failed");
                    } finally {
                      setUploading(false);
                    }
                  }}
                  previewUrl={newImage}
                  uploading={uploading}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs font-medium mb-1">Price</div>
                  <Input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                  />
                </div>
                <div>
                  <div className="text-xs font-medium mb-1">Amount</div>
                  <Input
                    type="number"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Category</div>
                <Select value={newCategoryId} onValueChange={setNewCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Author</div>
                <Select value={newAuthorId} onValueChange={setNewAuthorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select author" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={async () => {
                  await addProduct();
                  setOpen(false);
                }}
                disabled={
                  uploading ||
                  !newTitle ||
                  !newDescription ||
                  !newImage ||
                  !newPrice ||
                  !newAmount ||
                  !newCategoryId ||
                  !newAuthorId
                }
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Title</th>
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Author</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Active</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-0">
                <td className="py-2 pr-4">
                  {(p as any).image || (p as any).images?.[0] ? (
                    <img
                      src={(p as any).image || (p as any).images?.[0]}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : null}
                </td>
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.slug}</td>
                <td className="py-2 pr-4">
                  {categories.find((c) => c._id === p.categoryId)?.name || "-"}
                </td>
                <td className="py-2 pr-4">
                  {typeof p.author === "object" && p.author?.name
                    ? p.author.name
                    : typeof p.author === "string"
                    ? p.author
                    : "-"}
                </td>
                <td className="py-2 pr-4">{p.price}</td>
                <td className="py-2 pr-4">{p.stock}</td>
                <td className="py-2 pr-4">{p.isActive ? "Yes" : "No"}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <Dialog
                    open={editOpen === p._id}
                    onOpenChange={(v) => setEditOpen(v ? p._id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => startEdit(p)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      {edit ? (
                        <div className="grid gap-3 text-sm">
                          <div>
                            <div className="text-xs font-medium mb-1">
                              Title
                            </div>
                            <Input
                              value={edit.title}
                              onChange={(e) =>
                                setEdit({ ...edit, title: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">
                              Category
                            </div>
                            <Select
                              value={edit.categoryId || ""}
                              onValueChange={(v) =>
                                setEdit({ ...edit, categoryId: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((c) => (
                                  <SelectItem key={c._id} value={c._id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">
                              Author
                            </div>
                            <Select
                              value={edit.author || ""}
                              onValueChange={(v) =>
                                setEdit({ ...edit, author: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select author" />
                              </SelectTrigger>
                              <SelectContent>
                                {authors.map((a) => (
                                  <SelectItem key={a._id} value={a._id}>
                                    {a.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">Slug</div>
                            <Input
                              value={edit.slug}
                              onChange={(e) =>
                                setEdit({ ...edit, slug: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">
                              Description
                            </div>
                            <textarea
                              value={edit.description}
                              onChange={(e) =>
                                setEdit({
                                  ...edit,
                                  description: e.target.value,
                                })
                              }
                              className="h-24 border rounded px-3 py-2"
                            />
                          </div>
                          <div>
                            <div className="text-xs font-medium mb-1">
                              Image
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append("file", file);
                                if (edit?.title) fd.append("title", edit.title);
                                try {
                                  const res = await fetch("/api/upload", {
                                    method: "POST",
                                    body: fd,
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw data;
                                  setEdit({ ...edit, image: data.url });
                                } catch {
                                  toast.error("Upload failed");
                                }
                              }}
                            />
                            {edit.image ? (
                              <div className="flex items-center gap-3 mt-2">
                                <img
                                  src={edit.image}
                                  className="w-16 h-16 object-cover rounded"
                                />
                                <div className="text-xs break-all">
                                  {edit.image}
                                </div>
                              </div>
                            ) : null}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs font-medium mb-1">
                                Price
                              </div>
                              <Input
                                type="number"
                                value={edit.price}
                                onChange={(e) =>
                                  setEdit({ ...edit, price: e.target.value })
                                }
                              />
                            </div>
                            <div>
                              <div className="text-xs font-medium mb-1">
                                Stock
                              </div>
                              <Input
                                type="number"
                                value={edit.amount}
                                onChange={(e) =>
                                  setEdit({ ...edit, amount: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ) : null}
                      <DialogFooter>
                        <Button
                          onClick={saveEdit}
                          disabled={
                            !edit ||
                            !edit.title ||
                            !edit.slug ||
                            !edit.price ||
                            !edit.amount
                          }
                        >
                          Save
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={confirmDeleteId === p._id}
                    onOpenChange={(v) => setConfirmDeleteId(v ? p._id : null)}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm delete</DialogTitle>
                      </DialogHeader>
                      <div className="text-sm">
                        Are you sure you want to delete “{p.title}”?
                      </div>
                      <DialogFooter>
                        <Button
                          variant="secondary"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            await remove(p._id);
                            setConfirmDeleteId(null);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= Math.ceil(total / pageSize)}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="text-xs text-muted-foreground">
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
        </div>
        <div className="w-[140px]">
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPage(1);
              setPageSize(Number(v));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Dropzone({
  onFile,
  previewUrl,
  uploading,
}: {
  onFile: (file: File) => void;
  previewUrl?: string;
  uploading?: boolean;
}) {
  const [drag, setDrag] = useState(false);
  const inputId = "file-input-" + Math.random().toString(36).slice(2);
  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onFile(file);
        }}
        className={`border-2 border-dashed rounded px-4 py-6 flex flex-col items-center justify-center cursor-pointer text-center ${
          drag ? "border-blue-500 bg-blue-50" : "border-muted"
        }`}
      >
        <div className="text-sm">
          Drag & drop image here, or click to select
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          PNG, JPG, GIF up to 5MB
        </div>
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      {uploading ? (
        <div className="text-xs text-muted-foreground mt-1">Uploading...</div>
      ) : null}
      {previewUrl ? (
        <div className="flex items-center gap-3 mt-2">
          <img
            src={previewUrl}
            alt="preview"
            className="w-16 h-16 object-cover rounded"
          />
          <div className="text-xs break-all">{previewUrl}</div>
        </div>
      ) : null}
    </div>
  );
}

// removed custom CategorySelect in favor of shadcn Select
