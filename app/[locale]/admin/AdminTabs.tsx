"use client";

import { useState } from "react";
import UsersManager from "./UsersManager";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";
import { Button } from "@/components/ui/button";

const tabs = [
  { key: "users", label: "Users", component: UsersManager },
  { key: "categories", label: "Categories", component: CategoriesManager },
  { key: "products", label: "Products", component: ProductsManager },
];

export default function AdminTabs() {
  const [active, setActive] = useState<string>("users");
  const ActiveComp = tabs.find((t) => t.key === active)?.component || UsersManager;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b pb-2">
        {tabs.map((t) => (
          <Button
            key={t.key}
            variant={active === t.key ? "default" : "secondary"}
            onClick={() => setActive(t.key)}
            className="rounded-b-none"
          >
            {t.label}
          </Button>
        ))}
      </div>
      <div>
        <ActiveComp />
      </div>
    </div>
  );
}


