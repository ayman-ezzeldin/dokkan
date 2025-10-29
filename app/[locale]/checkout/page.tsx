"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/CartProvider";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const totalWithShipping = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
          },
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state || undefined,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          shipping,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        clearCart();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen py-8 px-4">
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
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
          <Button asChild>
            <Link href={`/${locale}/shop`}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("customerInfo")}
                </h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder={t("name")}
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <Input
                    required
                    type="email"
                    placeholder={t("email")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <Input
                    type="tel"
                    placeholder={t("phone")}
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">
                  {t("shippingAddress")}
                </h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder={t("street")}
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      required
                      placeholder={t("city")}
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                    />
                    <Input
                      placeholder={t("state")}
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      required
                      placeholder={t("zipCode")}
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData({ ...formData, zipCode: e.target.value })
                      }
                    />
                    <Input
                      required
                      placeholder={t("country")}
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : t("placeOrder")}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t("cartReview")}</h2>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4">
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
