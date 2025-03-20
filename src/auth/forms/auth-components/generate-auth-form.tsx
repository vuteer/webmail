import { FormField } from "@/components/ui/form";

import {Email, Name, Password, Phone} from "."; 
// import Loader from "@/utils/loader"; 
import React from "react";

const GenerateAuthPageForm = ({
    activated, message, form, screen, loading
}: {
    activated?: boolean, message?: string, form: any, screen: string, loading: boolean
}) => {

    return (
        <>
            {screen === "login" && <Login form={form} loading={loading}/>}
            {screen === "forgot" && <Forgot form={form} loading={loading}/>}
        </>
    )
}

export default GenerateAuthPageForm; 

// components 
interface AuthProps {
    form: any; 
    activated?: boolean; 
    message?: string; 
    loading: boolean; 
}
const Login: React.FC<AuthProps> = ({form, loading}) => {

    return (
        <>
            <FormField
                control={form.control}
                name='email'
                render={({ field }: {field: object}) => <Email loading={loading} field={{...field}} />}
            />
            <FormField
                disabled={loading}
                control={form.control}
                name='password'
                render={({ field }: {field: object}) => <Password loading={loading} field={{...field}} />}
            />
        </>
    )
}

 

const Forgot: React.FC<AuthProps> = ({form, loading}) => {
    return (
        <FormField
            control={form.control}
            name='email'
            render={({ field }: {field: object}) => <Email loading={loading} field={{...field}} />}
        />
    )
}

 