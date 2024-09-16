import Appointments from "@/components/appointments";
import Protected from "../components/protected";


const Page = () => {

    return (
        <Protected title="Appointments">
            <Appointments />
        </Protected>
    )
}; 

export default Page; 