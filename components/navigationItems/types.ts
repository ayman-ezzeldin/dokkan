export interface NavigationItem {
  href: string;
  labelKey: string;
}

export const navigationItems: NavigationItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/shop", labelKey: "shop" },
  { href: "/about", labelKey: "about" },
];
