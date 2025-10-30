import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UsersManager from "./UsersManager";
import ProductsManager from "./ProductsManager";
import CategoriesManager from "./CategoriesManager";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const role = (session as any)?.user?.role;
  const locale = "en";
  if (role !== "admin") {
    redirect(`/${locale}`);
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
      <section>
        <h2 className="text-xl font-medium mb-3">Users</h2>
        <UsersManager />
      </section>
      <section>
        <h2 className="text-xl font-medium mb-3">Products</h2>
        <ProductsManager />
      </section>
      <section>
        <h2 className="text-xl font-medium mb-3">Categories</h2>
        <CategoriesManager />
      </section>
    </div>
  );
}
