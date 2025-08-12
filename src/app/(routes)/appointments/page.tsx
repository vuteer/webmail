// import Appointments from "@/components/appointments";
import Protected from "../components/protected";

import { generateDynamicMetadata } from "@/lib/generate-metadata";

export async function generateMetadata() {
  return generateDynamicMetadata("Appointments", "/");
}

const Page = () => {
  return <Protected title="Appointments">{/*<Appointments />*/}</Protected>;
};

export default Page;
