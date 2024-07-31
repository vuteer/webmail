// profile page 
import Protected from "../components/protected";
import PersonalDetails from "./components/details";
import Password from "./components/password";


const Page = () => {

    return (
        <Protected title="Profile">
            <div className="flex gap-2">
                <PersonalDetails />
                <Password />
            </div>
        </Protected>
    )
}; 

export default Page; 