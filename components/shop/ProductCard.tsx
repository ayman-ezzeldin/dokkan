"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartProvider";
import FavoriteButton from "@/components/FavoriteButton";

export interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  rating?: number;
  badges?: string[];
}

export default function ProductCard(props: ProductCardProps) {
  const locale = useLocale();
  const { addToCart } = useCart();

  const primaryImage = props.images?.[0] || "/images/logo.png";

  return (
    <div className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-xl">
        <Image
          src={primaryImage}
          alt={props.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/10 to-transparent" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {props.badges?.map((b) => (
            <span
              key={b}
              className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
            >
              {b}
            </span>
          ))}
        </div>
        <div className="absolute right-2 top-2">
          <FavoriteButton
            productId={props.id}
            size="icon"
            item={{
              productId: props.id,
              slug: props.slug,
              title: props.title,
              price: props.price,
              image: primaryImage,
            }}
          />
        </div>
      </div>

      <div className="space-y-2 p-3">
        <Link href={`/${locale}/product/${props.slug}`} className="block">
          <div className="truncate text-sm text-muted-foreground">
            {props.brand}
          </div>
          <h3 className="line-clamp-2 text-base font-medium">{props.title}</h3>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">
            {props.price.toFixed(2)}
          </span>
          {props.compareAtPrice && props.compareAtPrice > props.price ? (
            <span className="text-sm text-muted-foreground line-through">
              {props.compareAtPrice.toFixed(2)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-0.5 text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {i < Math.round(props.rating || 0) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <Button
            size="sm"
            onClick={() =>
              addToCart({
                productId: props.id,
                slug: props.slug,
                title: props.title,
                price: props.price,
                image: primaryImage,
              })
            }
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
