// calender page

import { Calendar } from "./components";
import Protected from "../components/protected";
import { getCalendar } from "@/lib/api-calls/calendar";

const Page = async () => {
  return (
    <Protected title="📅  VuMail Calendar">
      <Calendar />
    </Protected>
  );
};

export default Page;
