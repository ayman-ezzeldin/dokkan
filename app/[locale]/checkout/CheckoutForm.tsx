"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { egyptPhoneRegex } from "@/lib/validation/shipping";
import { useCart } from "@/components/CartProvider";

type CheckoutFormData = {
  recipientName: string;
  province: string;
  cityOrDistrict: string;
  streetInfo: string;
  landmark: string;
  phone: string;
  phoneAlternate: string;
  notesOrBooksList: string;
};

type CheckoutFormProps = {
  defaultFormData: CheckoutFormData;
};

export default function CheckoutForm({ defaultFormData }: CheckoutFormProps) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { cart, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>(defaultFormData);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const totalWithShipping = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!formData.recipientName || formData.recipientName.length < 5) {
      return alert(t("fullNameRequired"));
    }
    if (
      !formData.province ||
      !formData.cityOrDistrict ||
      !formData.streetInfo
    ) {
      return alert(t("addressRequired"));
    }
    if (!egyptPhoneRegex.test(formData.phone)) {
      return alert(t("invalidPhone"));
    }
    setConfirmOpen(true);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          customer: { name: formData.recipientName, phone: formData.phone },
          shippingDetails: formData,
          shipping,
          currency: "EGP",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        clearCart();
        toast.success(t("orderCreated"));
        setTimeout(() => {
          window.open(data.whatsappUrl, "_blank");
        }, 300);
      } else {
        const error = await res.json();
        if (error?.details && Array.isArray(error.details)) {
          error.details.forEach(
            (d: { message?: string; path?: string | string[] }) => {
              const path = Array.isArray(d.path)
                ? d.path.join(".")
                : d.path || "";
              toast.error(`${d.message || ""}${path ? ` (${path})` : ""}`);
            }
          );
        } else if (error?.error) {
          toast.error(error.error);
        } else {
          toast.error(t("orderFailed"));
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error(t("unexpectedError"));
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen py-8 px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t("orderPlaced")}</h1>
          <p className="text-lg mb-4">
            {t("orderNumber")}: {orderId}
          </p>
          <Button asChild>
            <Link href={`/${locale}/shop`}>{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4" dir={isRTL ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t("cartEmpty")}</h1>
          <Button asChild>
            <Link href={`/${locale}/shop`}>{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("shippingInfo")}
                </h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder={t("fullNamePlaceholder")}
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientName: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="tel"
                    placeholder={t("phonePlaceholder")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    dir={isRTL ? "rtl" : "ltr"}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="tel"
                      placeholder={t("phoneAlternatePlaceholder")}
                      value={formData.phoneAlternate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneAlternate: e.target.value,
                        })
                      }
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">{t("address")}</h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder={t("provincePlaceholder")}
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                  />
                  <Input
                    required
                    placeholder={t("cityOrDistrictPlaceholder")}
                    value={formData.cityOrDistrict}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cityOrDistrict: e.target.value,
                      })
                    }
                  />
                  <Input
                    required
                    placeholder={t("streetInfoPlaceholder")}
                    value={formData.streetInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, streetInfo: e.target.value })
                    }
                  />
                  <Input
                    placeholder={t("landmarkPlaceholder")}
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? t("processing") : t("placeOrder")}
              </Button>
            </form>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent dir={isRTL ? "rtl" : "ltr"}>
                <DialogHeader>
                  <DialogTitle>{t("confirmDialogTitle")}</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button onClick={submitOrder} disabled={loading}>
                    {t("continue")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t("cartReview")}</h2>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-md text-gray-300 hover:underline cursor-pointer"
                      aria-label={t("remove")}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("subtotal")}</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("shipping")}</span>
                  <span>{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>{totalWithShipping.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
