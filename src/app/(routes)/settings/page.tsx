// settings page
import Protected from "../components/protected";

import Security from "./components/security";
import Notifications from "./components/notifications";
import MailSignature from "./components/mail-signature";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("Settings", "/");
}
const Page = () => {
  return (
    <Protected title="Settings">
      <Security />
      <Notifications />
      <MailSignature />
    </Protected>
  );
};

export default Page;
