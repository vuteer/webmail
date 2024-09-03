// files page 
import Protected from "../components/protected";
import FilesContainer from "./components/container"; 

const Page = () => {

    return (
        <Protected title="My Files">
            <FilesContainer />
        </Protected>
    )
}; 

export default Page; 