// profile page
import Protected from "../components/protected";
import { Profile } from "./components/container";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("Profile", "/");
}

const Page = () => {
  return (
    <Protected title="Profile">
      <Profile />
    </Protected>
  );
};

export default Page;
