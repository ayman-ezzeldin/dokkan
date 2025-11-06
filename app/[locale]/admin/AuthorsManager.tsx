"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

type Author = { _id: string; name: string; bio?: string; image?: string };

export default function AuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [edit, setEdit] = useState<Author | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/authors")
      .then((r) => r.json())
      .then((d) => setAuthors(d.authors || []))
      .catch(() => toast.error("Failed to load authors"))
      .finally(() => setLoading(false));
  }, []);

  async function addAuthor() {
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, image }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setAuthors((a) => [data.author, ...a]);
      setName("");
      setBio("");
      setImage("");
      toast.success("Author created");
    } catch (e: any) {
      toast.error(e?.error || "Failed to create author");
    }
  }

  async function remove(id: string) {
    const prev = authors;
    setAuthors((a) => a.filter((x) => x._id !== id));
    try {
      const res = await fetch(`/api/authors/${id}`, { method: "DELETE" });
      if (!res.ok) throw await res.json().catch(() => ({}));
      toast.success("Deleted");
    } catch (e: any) {
      setAuthors(prev);
      toast.error(e?.error || "Delete failed");
    }
  }

  async function saveEdit() {
    if (!edit?._id) return;
    try {
      const res = await fetch(`/api/authors/${edit._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: edit.name, bio: edit.bio, image: edit.image }),
      });
      const data = await res.json();
      if (!res.ok) throw data;
      setAuthors((prev) => prev.map((a) => (a._id === edit._id ? (data.author as Author) : a)));
      setEditOpen(null);
      toast.success("Author updated");
    } catch (e: any) {
      toast.error(e?.error || "Failed to update author");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Manage authors</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add author</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Author</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3 text-sm">
              <div>
                <div className="text-xs font-medium mb-1">Name</div>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Bio</div>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="h-24 border rounded px-3 py-2 w-full resize-none" />
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Upload Image</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append("file", file);
                    if (name) fd.append("title", name);
                    setUploading(true);
                    try {
                      const res = await fetch("/api/upload", { method: "POST", body: fd });
                      const data = await res.json();
                      if (!res.ok) throw data;
                      setImage(data.url);
                      toast.success("Image uploaded");
                    } catch {
                      toast.error("Upload failed");
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
                {image ? (
                  <div className="flex items-center gap-3 mt-2">
                    <img src={image} alt="preview" className="w-16 h-16 object-cover rounded" />
                    <div className="text-xs break-all">{image}</div>
                  </div>
                ) : null}
                {uploading ? (
                  <div className="text-xs text-muted-foreground mt-1">Uploading...</div>
                ) : null}
              </div>
              <div>
                <div className="text-xs font-medium mb-1">Image URL</div>
                <Input value={image} onChange={(e) => setImage(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={async () => { await addAuthor(); setOpen(false); }} disabled={!name || uploading}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-sm">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Image</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Bio</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((a) => (
                <tr key={a._id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{a.image ? (<img src={a.image} className="w-10 h-10 object-cover rounded" />) : null}</td>
                  <td className="py-2 pr-4">{a.name}</td>
                  <td className="py-2 pr-4 max-w-[360px] truncate" title={a.bio}>{a.bio}</td>
                  <td className="py-2 pr-4 flex gap-2">
                    <Dialog open={editOpen === a._id} onOpenChange={(v) => {
                      if (v) {
                        setEditOpen(a._id);
                        setEdit(a);
                      } else {
                        setEditOpen(null);
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="secondary">Edit</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Author</DialogTitle>
                        </DialogHeader>
                        {edit ? (
                          <div className="grid gap-3 text-sm">
                            <div>
                              <div className="text-xs font-medium mb-1">Name</div>
                              <Input value={edit.name} onChange={(e) => setEdit({ ...edit!, name: e.target.value })} />
                            </div>
                            <div>
                              <div className="text-xs font-medium mb-1">Bio</div>
                              <textarea value={edit.bio || ''} onChange={(e) => setEdit({ ...edit!, bio: e.target.value })} className="h-24 border rounded px-3 py-2 w-full resize-none" />
                            </div>
                            <div>
                              <div className="text-xs font-medium mb-1">Upload Image</div>
                              <input type="file" accept="image/*" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const fd = new FormData();
                                fd.append("file", file);
                                if (edit?.name) fd.append("title", edit.name);
                                setUploading(true);
                                try {
                                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                                  const data = await res.json();
                                  if (!res.ok) throw data;
                                  setEdit({ ...edit!, image: data.url });
                                  toast.success("Image uploaded");
                                } catch {
                                  toast.error("Upload failed");
                                } finally {
                                  setUploading(false);
                                }
                              }} />
                              {edit.image ? (
                                <div className="flex items-center gap-3 mt-2">
                                  <img src={edit.image} alt="preview" className="w-16 h-16 object-cover rounded" />
                                  <div className="text-xs break-all">{edit.image}</div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                        <DialogFooter>
                          <Button onClick={saveEdit} disabled={!edit?.name || uploading}>Save</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => remove(a._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


