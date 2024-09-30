// password info 
"use client"; 
import React from "react";
import { Card } from "@/components/ui/card"
import { AppInput } from "@/components";
import { Button } from "@/components/ui/button";
import { Heading2 } from "@/components/ui/typography";
import { PasswordInput } from "@/auth/forms/auth-components/Password";
import FormTitle from "@/components/forms/components/form-title";
import { updatePassword } from "@/lib/api-calls/user";
import { createToast } from "@/utils/toast";
import { useSignOut } from '@/auth/authHooks';

const Password = () => {
    const [loading, setLoading] = React.useState<boolean>(false); 

    const [current, setCurrent] = React.useState<string>(""); 
    const [password, setPassword] = React.useState<string>(""); 
    const [confirmPassword, setConfirmPassword] = React.useState<string>(""); 

    const signOut = useSignOut(); 
    const handleUpdatePassword = async () => {
        if (current === password) {
            createToast("error", "Current password cannot be similar to new password");
            return; 
        };
        if (password.length < 6) {
            createToast("error", "Password is too short!");
            return; 
        }
        if (confirmPassword !== password) {
            createToast("error", "Passwords do not match!");
            return; 
        };

        setLoading(true); 
        let res = await updatePassword({
            currentPassword: current, 
            password, 
            passwordConfirm: confirmPassword
        }); 

        if (res) {
            createToast("success", "Password has been updated.")
            createToast("success", "Login in again!")
            signOut(); 
        };
        setLoading(false); 
    }
    return (
        <Card className="p-3 flex-1 h-fit flex flex-col gap-2">
            <Heading2 className="text-md lg:text-base text-center">Change Password</Heading2>
            <PasswordInput 
                value={current}
                setValue={setCurrent}
                label="Current Password"
                loading={loading}
            />
            <PasswordInput 
                value={password}
                setValue={setPassword}
                label="New Password"
                loading={loading}
            />
            <PasswordInput 
                value={confirmPassword}
                setValue={setConfirmPassword}
                label="Confirm Password"
                loading={loading}
            />

            <Button 
                className="self-end w-[200px]"
                onClick={handleUpdatePassword}
                disabled={loading}
            >
                Submit{loading ? "ing...": ""}
            </Button>
        </Card>
    )
};

export default Password; 


 