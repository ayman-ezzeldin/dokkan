"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) return <div className="text-sm">Loading...</div>;

  return (
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
  );
}
