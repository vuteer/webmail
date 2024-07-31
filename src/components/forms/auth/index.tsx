"use client"; 

import React from "react"
import { useRouter } from "next/navigation";

import FormContainer from "../components/form-container"
import { LoginFormValues, defaultValues, loginFormSchema, values } from "./values"
import { Button } from "@/components/ui/button";
import { validateEmail } from '@/utils/validation';
import { createToast } from "@/utils/toast";
import {login} from "@/lib/api-calls/auth"; 
import {useAuthUser, useSignIn} from '@/auth/authHooks';


const AuthForm = () => {
    const [loading, setLoading] = React.useState<boolean>(false)
    const signIn = useSignIn(); 
    const auth = useAuthUser(); 
    let user = auth(); 
    const {push} = useRouter(); 

    React.useEffect(() => {
        if (user) {
            createToast("success", "Welcome back!"); 
            push("/?sec=inbox")
        }
    }, [])
    
    const handleSubmit = async (data: LoginFormValues) => {
        let {email} = data;

        if (!validateEmail(email)) {
            createToast("error", "Invalid email!"); 
            return; 
        }
        setLoading(true); 

        let res = await login(data); 
        if (res) {
            createToast("success", "Login was successful!"); 
            signIn({
                token: res.token, 
                expiresIn: 60 * 60 * 1000, 
                tokenType: 'Bearer',
                authState: res.user, 
                // refreshToken: res.session, 
                // refreshTokenExpireIn: 60 * 60 * 1000,
            }); 
            push("/?sec=inbox")
        }
        setLoading(false);

    }
    return (
        <FormContainer 
            formSchema={loginFormSchema}
            defaultValues={defaultValues}
            buttonPosition="bottom"
            className="w-full"
            button={
                <Button className={"w-full"}>
                    Submit{loading ? "ing...": ""}
                </Button>
            }
            values={values}
            loading={loading}
            onSubmit={handleSubmit}
        />

    )
}

export default AuthForm; 