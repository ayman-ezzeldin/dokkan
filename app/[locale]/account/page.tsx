import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale || "en";
  const session = await getServerSession();
  if (!session?.user?.email) {
    redirect(`/${safeLocale}/login?next=/${safeLocale}/account`);
  }

  await connectDB();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) {
    redirect(`/${safeLocale}/login?next=/${safeLocale}/account`);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Your account</h1>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="font-medium">First name</div>
        <div>{user.firstName}</div>
        <div className="font-medium">Last name</div>
        <div>{user.lastName}</div>
        <div className="font-medium">Email</div>
        <div>{user.email}</div>
        <div className="font-medium">Phone</div>
        <div>{user.phoneNumber || "-"}</div>
        <div className="font-medium">Role</div>
        <div>{user.role}</div>
        <div className="font-medium">Created</div>
        <div>{new Date(user.createdAt).toLocaleString()}</div>
      </div>
    </div>
  );
}
