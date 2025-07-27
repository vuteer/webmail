// profile page
import Protected from "../components/protected";
import { Profile } from "./components/container";

const Page = () => {
  return (
    <Protected title="Profile">
      <Profile />
    </Protected>
  );
};

export default Page;
