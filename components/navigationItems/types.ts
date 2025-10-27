export interface NavigationItem {
  href: string;
  labelKey: string;
}

export const navigationItems: NavigationItem[] = [
  { href: "/", labelKey: "home" },
  { href: "/categories", labelKey: "categories" },
  { href: "/about", labelKey: "about" },
  { href: "/contact", labelKey: "contact" },
];
