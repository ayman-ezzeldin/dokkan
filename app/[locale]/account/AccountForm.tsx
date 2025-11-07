"use client";

import { useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type UserLite = {
  fullName: string;
  email: string;
  phonePrimary: string;
  phoneSecondary?: string;
  address?: {
    province: string;
    cityOrDistrict: string;
    streetInfo: string;
    landmark?: string;
  };
};

export default function AccountForm({
  initialUser,
}: {
  initialUser: UserLite;
}) {
  const t = useTranslations("Account");
  const locale = useLocale();
  const isRTL = locale === "ar";
  type EditableField = "fullName" | "email" | "phonePrimary" | "phoneSecondary";
  const [user, setUser] = useState(initialUser);
  const [address, setAddress] = useState(
    initialUser.address || {
      province: "",
      cityOrDistrict: "",
      streetInfo: "",
      landmark: "",
    }
  );
  const [editField, setEditField] = useState<null | EditableField>(null);
  const [pendingValue, setPendingValue] = useState("");
  const [loading, setLoading] = useState(false);
  const lastSavedAddress = useRef(JSON.stringify(initialUser.address || {}));

  function startEdit(field: EditableField) {
    setEditField(field);
    setPendingValue(user[field] || "");
  }

  function cancel() {
    setEditField(null);
  }

  async function save(field?: EditableField, value?: string) {
    const fieldToSave = field || editField;
    const valueToSave = value !== undefined ? value : pendingValue;

    if (!fieldToSave || !valueToSave.trim()) return;

    setLoading(true);
    try {
      const updates: Partial<Record<EditableField, string>> = {};
      updates[fieldToSave] = valueToSave;

      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");
      setUser((u) => ({ ...u, ...updates }));
      if (fieldToSave === editField) {
        setEditField(null);
      }
      toast.success(t("saved"));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("updateFailed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleBlur(field: EditableField) {
    if (
      editField === field &&
      pendingValue.trim() &&
      pendingValue !== (user[field] || "")
    ) {
      save(field, pendingValue);
    }
  }

  async function saveAddress() {
    if (
      !address.province?.trim() ||
      !address.cityOrDistrict?.trim() ||
      !address.streetInfo?.trim()
    ) {
      toast.error(t("addressRequired"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) {
        let errorMsg = data?.error || t("updateFailed");
        if (data?.message) {
          errorMsg = data.message;
        } else if (data?.details && Array.isArray(data.details)) {
          const details = data.details
            .map((d: any) => d.message || `${d.path}: ${d.message}`)
            .join(", ");
          errorMsg = `${errorMsg}: ${details}`;
        }
        throw new Error(errorMsg);
      }
      setUser((u) => ({ ...u, address }));
      lastSavedAddress.current = JSON.stringify(address);
      toast.success(t("addressSaved"));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("updateFailed");
      toast.error(msg);
      console.error("Address save error:", e);
    } finally {
      setLoading(false);
    }
  }

  function handleAddressBlur() {
    const currentAddressStr = JSON.stringify(address);
    if (currentAddressStr !== lastSavedAddress.current) {
      saveAddress();
    }
  }

  const fields: { field: EditableField; label: string; type?: string }[] = [
    { field: "fullName", label: t("fullName") },
    { field: "email", label: t("email"), type: "email" },
    { field: "phonePrimary", label: t("phonePrimary") },
    { field: "phoneSecondary", label: t("phoneSecondary") },
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
                  onBlur={() => handleBlur(field)}
                  autoFocus
                  disabled={loading}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !loading && pendingValue.trim()) {
                      e.preventDefault();
                      save();
                    }
                    if (e.key === "Escape") {
                      cancel();
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label={t("save")}
                  className="px-1 disabled:opacity-60"
                  onClick={() => save()}
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
                  aria-label={t("cancel")}
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
                  aria-label={`${t("edit")} ${label}`}
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

      <div className="mt-6 border-t pt-6" dir={isRTL ? "rtl" : "ltr"}>
        <h3 className="text-lg font-semibold mb-3">{t("address")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder={t("province")}
            value={address.province || ""}
            onChange={(e) =>
              setAddress({ ...address, province: e.target.value })
            }
            onBlur={handleAddressBlur}
          />
          <Input
            placeholder={t("cityOrDistrict")}
            value={address.cityOrDistrict || ""}
            onChange={(e) =>
              setAddress({ ...address, cityOrDistrict: e.target.value })
            }
            onBlur={handleAddressBlur}
          />
          <Input
            placeholder={t("streetInfo")}
            value={address.streetInfo || ""}
            onChange={(e) =>
              setAddress({ ...address, streetInfo: e.target.value })
            }
            onBlur={handleAddressBlur}
          />
          <Input
            placeholder={t("landmark")}
            value={address.landmark || ""}
            onChange={(e) =>
              setAddress({ ...address, landmark: e.target.value })
            }
            onBlur={handleAddressBlur}
          />
        </div>
      </div>
    </div>
  );
}
