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
  author?: string | { name?: string } | null;
  images: string[];
  price: number;
  compareAtPrice?: number;
  badges?: string[];
}

export default function ProductCard(props: ProductCardProps) {
  const locale = useLocale();
  const { addToCart } = useCart();

  const primaryImage = props.images?.[0] || "/images/logo.png";

  return (
    <div className="group relative rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-4/5 overflow-hidden rounded-t-xl">
        <Image
          src={primaryImage}
          alt={props.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/10 to-transparent" />
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
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/${locale}/product/${props.slug}`}
            className="block min-w-0 flex-1"
          >
            <h3 className="line-clamp-2 text-base font-medium">
              {props.title}
            </h3>
            {props.author ? (
              <div className="truncate text-sm text-muted-foreground mt-0.5">
                {typeof props.author === "string"
                  ? props.author
                  : props.author?.name}
              </div>
            ) : null}
          </Link>
          <div className="shrink-0 text-right">
            <span className="text-lg font-semibold">
              {props.price.toFixed(2)}
            </span>
            {props.compareAtPrice && props.compareAtPrice > props.price ? (
              <div className="text-xs text-muted-foreground line-through">
                {props.compareAtPrice.toFixed(2)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
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
            Add to cart
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/product/${props.slug}`}>Details</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
