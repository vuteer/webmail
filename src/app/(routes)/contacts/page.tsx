// contact page
import Protected from "../components/protected";
import { Contacts } from "./components/container";

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
