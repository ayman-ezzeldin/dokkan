"use client";

import * as React from "react";
import { useCart } from "@/components/CartProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay, DialogPortal } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: Props) {
  const { cart, total } = useCart() as any;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black/40" />
        <DialogContent className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-background p-0">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Cart</h2>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-4">
            {cart?.length ? (
              cart.map((item: any) => (
                <div key={item.productId} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm text-muted-foreground">{item.slug}</div>
                    <div className="truncate font-medium">{item.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">x{item.quantity}</div>
                    <div className="font-semibold">{(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground">Your cart is empty</div>
            )}
          </div>
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-lg font-semibold">{Number(total || 0).toFixed(2)}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1">Checkout</Button>
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Continue</Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}


