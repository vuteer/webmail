// calender page

import Calendar from "./components";
import Protected from "../components/protected";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("📅  VuMail Calendar", "/");
}

const Page = async () => {
  return (
    <Protected title="📅  VuMail Calendar">
      <Calendar />
    </Protected>
  );
};

export default Page;
