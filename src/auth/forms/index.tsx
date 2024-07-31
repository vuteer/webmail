"use client";

import React from 'react'; 
import { useRouter, useSearchParams } from "next/navigation";

import * as z  from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm } from "react-hook-form";

import {Button} from "@/components/ui/button"; 
import { Form } from "@/components/ui/form";

import {useSignIn} from '../authHooks';

import GenerateAuthPageForm from "./auth-components/generate-auth-form"; 
// auth schemas
import { getSchema } from "./values"; 

// functions 
import { handleSubmit} from "./functions"
import {cn} from "@/lib/utils"; 

interface AuthProps {
    buttonText: string;   
    screen: string;
    values: any; 
    className?: string; 
    admin?: boolean; 
}



const AuthForm: React.FC<AuthProps> = ({buttonText, screen, values, className, admin}) => {
    const [loading, setLoading] = React.useState(screen === 'welcome' ? true: false); 
    const [activated, setActivated] = React.useState(false); 
    const [message, setMessage] = React.useState(""); 

    const {push, refresh} = useRouter(); 
    const signIn = useSignIn() 

    const searchParams = useSearchParams(); 
    const token = searchParams.get("token") || "";
    const registered = searchParams.get("registered"); 

    // React.useEffect(() => {
    //     if (token && screen === 'welcome' && !admin) handleActivation(token, setActivated, setMessage, setLoading, push)
    // }, [token]); 

    let schema = getSchema(screen)
   
    type AuthFormValues = z.infer<typeof schema>; 

    const form = useForm<AuthFormValues>({
        resolver: zodResolver(schema),
        defaultValues: values
    });

    const onSubmit = async (data: any) => {
        await handleSubmit(
            data, screen, setLoading, push, refresh, token, setMessage, signIn, admin
        )
    }
    
    return (
        <Form {...form}>
            {registered && <p className='text-sm font-bold mt-2'>NB: Make sure you activate your account before trying to login!</p>}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(className, 'mt-4 flex flex-col gap-4')}
            >
                <GenerateAuthPageForm 
                    activated={activated}
                    message={message}
                    form={form}
                    screen={screen}
                    loading={loading}
                />
                
                <Button 
                    type={'submit'} 
                    disabled={loading}>
                    {buttonText}
                </Button>
            </form>
        </Form>
    )
};

export default AuthForm; 