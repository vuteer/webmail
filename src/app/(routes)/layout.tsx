// public layout

import AuthProvider from "@/auth/auth-provider";
import SideMenu from "./components/side-menu";
import Contacts from "./components/contacts";

import FinalizeSetup from "@/components/utils/setup";
import SetupSocket from "@/components/utils/setup-socket";
import Notifications from "@/components/notifications";
import NetworkStatusIndicator from "@/components/utils/network-indicator";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider authType="cookie" authName="_auth">
      <FinalizeSetup />
      <Notifications />
      <SetupSocket />
      <NetworkStatusIndicator />
      <main className="h-full w-full flex">
        <SideMenu />
        {children}
        <Contacts />
      </main>
    </AuthProvider>
  );
}
