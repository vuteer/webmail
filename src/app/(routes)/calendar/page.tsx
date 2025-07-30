// calender page

import Calendar from "./components";
import Protected from "../components/protected";

const Page = async () => {
  return (
    <Protected title="📅  VuMail Calendar">
      <Calendar />
    </Protected>
  );
};

export default Page;
