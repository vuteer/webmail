import Protected from "../components/protected";
import Container from "./components/container";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sec: string }>;
}) {
  const sec = (await searchParams).sec || "Inbox";
  return generateDynamicMetadata(
    sec.charAt(0).toUpperCase() + sec.slice(1),
    "/",
  );
}

const Home = async () => {
  return (
    <Protected title={""}>
      <Container />
    </Protected>
  );
};

export default Home;
