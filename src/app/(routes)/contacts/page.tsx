// contact page
import Protected from "../components/protected";
import { Contacts } from "./components/container";
import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("📇 My Contacts", "/");
}
const Page = () => {
  return (
    <Protected title="📇 My Contacts">
      <div className="flex flex-col lg:flex-row gap-2">
        <Contacts />
        {/* <Contacts type="saved"/> */}
        {/* <Contacts type="organization"/> */}
      </div>
    </Protected>
  );
};

export default Page;
