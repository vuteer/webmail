// password info 
"use client"; 
import React from "react";
import { Card } from "@/components/ui/card"
import { AppInput } from "@/components";
import { Button } from "@/components/ui/button";
import { Heading2 } from "@/components/ui/typography";
import { PasswordInput } from "@/auth/forms/auth-components/Password";
import FormTitle from "@/components/forms/components/form-title";


const Password = () => {
    const [loading, setLoading] = React.useState<boolean>(false); 

    const [current, setCurrent] = React.useState<string>(); 
    const [password, setPassword] = React.useState<string>(); 
    const [confirmPassword, setConfirmPassword] = React.useState<string>(); 

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

            <Button className="self-end w-[200px]">
                Submit
            </Button>
        </Card>
    )
};

export default Password; 


 