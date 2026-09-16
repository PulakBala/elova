import type { Metadata } from "next";
import { AccountContent } from "@/components/account/AccountContent";

export const metadata: Metadata = {
  title: "My Account Dashboard | ELVOA Store",
  description: "Manage your profile, view order history, and edit saved delivery addresses.",
};

export default function AccountPage() {
  return <AccountContent />;
}

