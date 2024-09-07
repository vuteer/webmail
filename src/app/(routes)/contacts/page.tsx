// contact page 
import Protected from "../components/protected";
import Contacts from "./components/contacts"; 

const Page = () => {

    return (
        <Protected title="My contacts">
            <div className="flex flex-col lg:flex-row gap-2">
                <Contacts type="saved"/>
                {/* <Contacts type="organization"/> */}
            </div>
        </Protected>
    )
}; 

export default Page; 