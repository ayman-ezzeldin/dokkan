"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type UserRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
};

function extractErrorMessage(data: any, fallback = "Failed") {
  if (!data) return fallback;
  if (data.error) return data.error;
  return fallback;
}

export default function UsersManager() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (q) params.set("q", q);
    fetch(`/api/admin/users?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || []);
        setTotal(d.total || 0);
      })
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [q, page, pageSize]);

  useEffect(() => {
    const t = setTimeout(() => setQ(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  async function setRole(userId: string, role: "user" | "admin") {
    const prev = users;
    setUsers((u) => u.map((x) => (x._id === userId ? { ...x, role } : x)));
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw data;
      }
      toast.success("Updated role");
    } catch (e: any) {
      setUsers(prev);
      toast.error(extractErrorMessage(e, "Failed to update role"));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <input
          value={searchInput}
          onChange={(e) => {
            setPage(1);
            setSearchInput(e.target.value);
          }}
          placeholder="Search users..."
          className="h-10 border rounded px-3 w-full max-w-sm text-sm"
        />
        <div className="text-xs text-muted-foreground">
          Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b last:border-0">
                <td className="py-2 pr-4">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4 font-mono">{u.role}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <Button
                    size="sm"
                    variant={u.role === "admin" ? "secondary" : "default"}
                    onClick={() => setRole(u._id, "admin")}
                  >
                    Make admin
                  </Button>
                  <Button
                    size="sm"
                    variant={u.role === "user" ? "secondary" : "outline"}
                    onClick={() => setRole(u._id, "user")}
                  >
                    Make user
                  </Button>
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
