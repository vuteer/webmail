// files page
import Protected from "../components/protected";
import { FilesContainer } from "./components";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("🗂️  My Files", "/");
}

const Page = () => {
  return (
    <Protected title="🗂️  My Files">
      <FilesContainer />
    </Protected>
  );
};

export default Page;
