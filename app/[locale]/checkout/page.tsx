import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import User from "@/models/User";
import CheckoutForm from "./CheckoutForm";

type SessionLike = { user?: { email?: string } };

export default async function CheckoutPage({
  params: _params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = (await getServerSession(authOptions)) as SessionLike;

  let defaultFormData = {
    recipientName: "",
    province: "",
    cityOrDistrict: "",
    streetInfo: "",
    landmark: "",
    phone: "",
    phoneAlternate: "",
    notesOrBooksList: "",
  };

  if (session?.user?.email) {
    try {
      await connectDB();
      const user = await User.findOne({ email: session.user.email }).lean();
      if (user) {
        defaultFormData = {
          recipientName: user.fullName || "",
          province: user.address?.province || "",
          cityOrDistrict: user.address?.cityOrDistrict || "",
          streetInfo: user.address?.streetInfo || "",
          landmark: user.address?.landmark || "",
          phone: user.phonePrimary || "",
          phoneAlternate: user.phoneSecondary || "",
          notesOrBooksList: "",
        };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  return <CheckoutForm defaultFormData={defaultFormData} />;
}
