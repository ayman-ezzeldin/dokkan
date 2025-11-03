import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminTabs from "./AdminTabs";

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
      <AdminTabs />
    </div>
  );
}
