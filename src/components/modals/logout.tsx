
import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import Confirm from "./confirm";

import { useSignOut } from '@/auth/authHooks';
import { removeCookie } from '@/helpers/cookies';
import { createToast } from "@/utils/toast";

interface LogoutProps { 
    isOpen: boolean; 
    onClose: () => void; 
}

const Logout: React.FC<LogoutProps> = ({isOpen, onClose}) => {
    const signOut = useSignOut(); 
    const {refresh, push} = useRouter(); 
    const [loading, setLoading] = React.useState(false)

    const handleLogout = () => {
        setLoading(true)
        signOut();
        removeCookie("_auth_state");
        createToast("success", "You have been logged out!"); 
        push("/auth/login")
        refresh()
    }

    return (
        <Confirm
            title={`Log out`}
            description={`You will be logged out from the system and all data erased. Do you wish to proceed?!`}
            isOpen={isOpen}
            onClose={onClose}
        >
            <Button
                variant={`destructive`}
                className="w-full my-2"
                onClick={handleLogout}
            >
                Log{loading ? "ging out": "out"}
            </Button>
        </Confirm>
    )
}

export default Logout; 