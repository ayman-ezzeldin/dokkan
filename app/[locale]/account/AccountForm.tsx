"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type UserLite = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  defaultShipping?: {
    recipientName?: string;
    province?: string;
    cityOrDistrict?: string;
    streetInfo?: string;
    landmark?: string;
    phone?: string;
    phoneAlternate?: string;
    whatsapp?: string;
    notesOrBooksList?: string;
  };
};

export default function AccountForm({
  initialUser,
}: {
  initialUser: UserLite;
}) {
  type EditableField = "firstName" | "lastName" | "email" | "phoneNumber";
  const [user, setUser] = useState(initialUser);
  const [shipping, setShipping] = useState<UserLite["defaultShipping"]>(initialUser.defaultShipping || {});
  const [editField, setEditField] = useState<null | EditableField>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [loading, setLoading] = useState(false);

  function startEdit(field: EditableField) {
    setEditField(field);
    setPendingValue(user[field] || "");
  }

  function cancel() {
    setEditField(null);
  }

  async function save() {
    setLoading(true);
    try {
      const updates: Partial<Record<EditableField, string>> = {};
      if (editField) {
        updates[editField] = pendingValue;
      }
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

  async function saveShipping() {
    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultShipping: shipping }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setUser((u) => ({ ...u, defaultShipping: shipping }));
      toast.success("تم حفظ عنوان الشحن");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const fields: { field: EditableField; label: string; type?: string }[] = [
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
                  title={(user[field] as string | undefined) || "-"}
                >
                  {(user[field] as string | undefined) || "-"}
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

      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">العنوان وأرقام التواصل الافتراضية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3" dir="rtl">
          <Input placeholder="أدخل الاسم الثلاثي" value={shipping?.recipientName || ""} onChange={(e) => setShipping({ ...shipping, recipientName: e.target.value })} />
          <Input placeholder="مثال: 01012345678" value={shipping?.phone || ""} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} />
          <Input placeholder="مثال: 01087654321" value={shipping?.phoneAlternate || ""} onChange={(e) => setShipping({ ...shipping, phoneAlternate: e.target.value })} />
          <Input placeholder="رقم واتساب" value={shipping?.whatsapp || ""} onChange={(e) => setShipping({ ...shipping, whatsapp: e.target.value })} />
          <Input placeholder="المحافظة" value={shipping?.province || ""} onChange={(e) => setShipping({ ...shipping, province: e.target.value })} />
          <Input placeholder="المدينة/الحي" value={shipping?.cityOrDistrict || ""} onChange={(e) => setShipping({ ...shipping, cityOrDistrict: e.target.value })} />
          <Input placeholder="تفاصيل الشارع" value={shipping?.streetInfo || ""} onChange={(e) => setShipping({ ...shipping, streetInfo: e.target.value })} />
          <Input placeholder="علامة مميزة (اختياري)" value={shipping?.landmark || ""} onChange={(e) => setShipping({ ...shipping, landmark: e.target.value })} />
          <Input placeholder="ملاحظات (اختياري)" value={shipping?.notesOrBooksList || ""} onChange={(e) => setShipping({ ...shipping, notesOrBooksList: e.target.value })} />
        </div>
        <div className="mt-3">
          <button onClick={saveShipping} className="px-4 py-2 rounded bg-primary text-white disabled:opacity-60" disabled={loading}>
            حفظ عنوان الشحن
          </button>
        </div>
      </div>
    </div>
  );
}
