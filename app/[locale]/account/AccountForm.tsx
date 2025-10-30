"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type UserLite = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

export default function AccountForm({
  initialUser,
}: {
  initialUser: UserLite;
}) {
  const [user, setUser] = useState(initialUser);
  const [editField, setEditField] = useState<null | keyof UserLite>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [loading, setLoading] = useState(false);

  function startEdit(field: keyof UserLite) {
    setEditField(field);
    setPendingValue(user[field] || "");
  }

  function cancel() {
    setEditField(null);
  }

  async function save() {
    setLoading(true);
    try {
      const updates: Partial<UserLite> = {};
      updates[editField as keyof UserLite] = pendingValue;
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setUser((u) => ({ ...u, ...updates }));
      setEditField(null);
      toast.success("Saved");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const fields: { field: keyof UserLite; label: string; type?: string }[] = [
    { field: "firstName", label: "First name" },
    { field: "lastName", label: "Last name" },
    { field: "email", label: "Email", type: "email" },
    { field: "phoneNumber", label: "Phone" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {fields.map(({ field, label, type }) => (
          <div key={field} className="col-span-2 flex items-center gap-2 group">
            <div className="w-32 font-medium text-sm">{label}</div>
            {editField === field ? (
              <>
                <Input
                  className="w-52 h-8 px-2"
                  value={pendingValue}
                  type={type || "text"}
                  onChange={(e) => setPendingValue(e.target.value)}
                  autoFocus
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading && pendingValue.trim()) {
                      e.preventDefault();
                      save();
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label="Save"
                  className="px-1 disabled:opacity-60"
                  onClick={save}
                  disabled={loading || !pendingValue.trim()}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M7.5 14.5l-4-4 1.4-1.4 2.6 2.58L15.1 6.08l1.4 1.4z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Cancel"
                  className="px-1"
                  onClick={cancel}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M6.3 6.3l7.4 7.4m0-7.4l-7.4 7.4"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <span
                  className="w-52 truncate text-foreground"
                  title={user[field] || "-"}
                >
                  {user[field] || "-"}
                </span>
                <button
                  type="button"
                  aria-label={`Edit ${label}`}
                  className="opacity-80 hover:opacity-100 px-1"
                  onClick={() => startEdit(field)}
                >
                  <svg width="16" height="16" viewBox="0 0 20 20">
                    <path
                      fill="currentColor"
                      d="M14.7 5.3l-1-1c-.4-.4-1-.4-1.4 0l-7 7c-.2.2-.3.4-.3.7v2.3c0 .6.4 1 1 1h2.3c.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4zm-7 8.2H6v-.7l6.3-6.3.7.7-6.3 6.3z"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
