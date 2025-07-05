import Protected from "../components/protected";
import Container from "./components/container";

const Home = async () => {
  return (
    <Protected title={""}>
      <Container />
    </Protected>
  );
};

export default Home;
