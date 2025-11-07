import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AccountForm from "./AccountForm";

type SessionLike = { user?: { email?: string } };

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale || "en";
  const t = await getTranslations("Account");
  const session = (await getServerSession(authOptions)) as SessionLike;
  console.log("session is : ", session.user);
  if (!session?.user?.email) {
    redirect(`/${safeLocale}/login?next=/${safeLocale}/account`);
  }

  await connectDB();
  const user = await User.findOne({ email: session.user!.email }).lean();
  if (!user) {
    redirect(`/${safeLocale}/login?next=/${safeLocale}/account`);
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div className="pt-2">
        <AccountForm
          initialUser={{
            fullName: user.fullName,
            email: user.email,
            phonePrimary: user.phonePrimary,
            phoneSecondary: user.phoneSecondary,
            address: user.address,
          }}
        />
      </div>
    </div>
  );
}
