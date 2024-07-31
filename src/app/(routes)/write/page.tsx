import NewMailForm from "@/components/forms/new-mail";
import Protected from "../components/protected";


const Page = () => {

    return (
        <Protected
            title={"New Mail"}
        >
            <NewMailForm />
        </Protected>
    )
};

export default Page; 