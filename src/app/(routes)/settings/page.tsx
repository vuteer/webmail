// settings page 
import Protected from "../components/protected";

import Security from "./components/security";
import Notifications from "./components/notifications"; 
import MailSignature  from "./components/mail-signature"; 

const Page = () => {

    return (
        <Protected title="Settings">
             <Security />
             <Notifications />
             <MailSignature />
        </Protected>
    )
}; 

export default Page; 