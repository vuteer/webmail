"use client";
import React from "react"; 
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import { InputPair } from "@/components/forms/new-mail";
import { Heading2, Heading3, Paragraph } from "@/components/ui/typography";

import { createToast } from "@/utils/toast";
import { validateEmail } from "@/utils/validation";
import { finalizeUserSetup } from "@/lib/api-calls/user";

import { useSignOut } from "@/auth/authHooks";
import { userStateStore } from "@/stores/user-store";

const FinalizeSetup = ({}) => {
    const {finalized_setup, loading} = userStateStore(); 
    const {push} = useRouter(); 
    const signOut = useSignOut(); 

    const [cLoading, setCLoading] = React.useState<boolean>(false); 
    const [password, setPassword] = React.useState<string>("")
    const [passwordConfirm, setPasswordConfirm] = React.useState<string>(""); 

    const [email, setEmail] = React.useState<string>(""); 

  const [errors, setErrors] = React.useState<string[]>([]);


    const handleSubmit = async () => {
        if (!password) {
            setErrors([...errors, "password"]); 
            createToast("error", "Enter a valid password.")
            setTimeout(() => {setErrors([...errors.filter(err => err !== "password")])}, 2000)
            return; 
        }
        if (!passwordConfirm) {
            setErrors([...errors, "passwordConfirm"]); 
            createToast("error", "Confirm password.")
            setTimeout(() => {setErrors([...errors.filter(err => err !== "passwordConfirm")])}, 2000)
            return; 
        }

        if (password.length < 6) {
            setErrors([...errors, "password"]); 
            createToast("error", "Password must be at least 6 characters long.")
            setTimeout(() => {setErrors([...errors.filter(err => err !== "password")])}, 2000)
            return; 
        }

        if (password !== passwordConfirm) {
            setErrors([...errors, "passwordConfirm"]); 
            createToast("error", "Passwords do not match.")
            setTimeout(() => {setErrors([...errors.filter(err => err !== "passwordConfirm")])}, 2000)
            return; 
        }

        if (!validateEmail(email)) {
            setErrors([...errors, "email"]); 
            setTimeout(() => {setErrors([...errors.filter(err => err !== "email")])}, 2000)
            return; 
        }

        setCLoading(true); 
        let data = {
            password, passwordConfirm, email
        }

        console.log(data)
         
        let res = await finalizeUserSetup(data); 

        if (res) {
            createToast("success", "Done, Login again!"); 
            signOut(); 
            push("/")
        }
        setCLoading(false)
    }

    return (
        <>
            {
                !loading && !finalized_setup && (
                    <div
                        className="absolute top-0 left-0 z-40 w-[100vw] h-[100vh] flex items-center justify-center bg-black-transparent z-40"
                    >
                        <Card
                            className="max-w-[30%] w-full h-fit p-4 flex flex-col gap-3"
                        >
                            <Heading2>
                                Welcome to you personal business mail.
                            </Heading2>
                           
                            <Paragraph>

                                Before we can proceed, you need to update your password and add a personal email address that you can be reached at and then click on submit.
                            </Paragraph>
                            
                            <Paragraph>

                                The email is used to send you notifications of new mails.
                            </Paragraph>
                                 
                            
                            <div className="my-1"/>
                            <Heading3>
                            Update password
                            </Heading3>
                                 
                            <InputPair 
                                value={password}
                                setValue={setPassword}
                                error={errors.includes("password")}
                                placeholder="Enter a new password"
                                type={"password"}
                            />
                            <InputPair 
                                value={passwordConfirm}
                                setValue={setPasswordConfirm}
                                error={errors.includes("passwordConfirm")}
                                placeholder="Confirm password"
                                type={"password"}
                            />
                            <div className="my-1"/>
                            <Heading3>Contact email</Heading3>
                            <InputPair 
                                value={email}
                                setValue={setEmail}
                                error={errors.includes("email")}
                                placeholder="Enter email"
                            />

                            <Button className="min-w-[150px] my-2" onClick={handleSubmit}>
                                Submit{cLoading ? "ing...": ""}
                            </Button>
                        </Card> 
                    </div>
                )
            }
        </>
    )
}; 


export default FinalizeSetup;