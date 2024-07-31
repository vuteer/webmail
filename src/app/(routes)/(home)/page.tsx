import Protected from "../components/protected";
import Container from "./components/container";

export default function Home({searchParams}: {searchParams: {sec: string}}) {
  return (
    <Protected
      title={""}
    >
      <Container sec={searchParams.sec || "inbox"}/>
    </Protected>
  );
}
