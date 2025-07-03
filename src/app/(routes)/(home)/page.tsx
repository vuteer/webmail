import Protected from "../components/protected";
import Container from "./components/container";

const Home = async ({
  searchParams,
}: {
  searchParams: Promise<{ sec: string }>;
}) => {
  const sec = (await searchParams).sec;
  return (
    <Protected title={""}>
      <Container sec={sec || "inbox"} />
    </Protected>
  );
};

export default Home;
