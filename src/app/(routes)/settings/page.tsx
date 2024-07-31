// settings page 
import Protected from "../components/protected";

import Security from "./components/security";
import Notifications from "./components/notifications"; 

const Page = () => {

    return (
        <Protected title="Settings">
             <Security />
             <Notifications />
        </Protected>
    )
}; 

export default Page; 