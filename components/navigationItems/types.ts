export interface NavigationItem {
  href: string;
  labelKey: string;
}

export const navigationItems: NavigationItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/shop", labelKey: "shop" },
  { href: "/favorites", labelKey: "favorites" },
  { href: "/about", labelKey: "about" },
];
