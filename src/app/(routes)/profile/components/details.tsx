// personal info 
"use client"; 

import React from "react";

import { AppInput } from "@/components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import ImageUpload from "@/components/forms/components/image-upload";
import FormTitle from "@/components/forms/components/form-title";

import { useAuthUser } from "@/auth/authHooks";
import { cn } from "@/lib/utils";

const PersonalDetails = () => {
    const [avatar, setAvatar] = React.useState<string>(""); 
    const [name, setName] = React.useState<string>(""); 
    const [email, setEmail] = React.useState<string>(""); 
    const [phone, setPhone] = React.useState<string>(""); 

    const auth = useAuthUser(); 
    const user = auth(); 

    React.useEffect(() => {
        if (!user) return; 

        setAvatar(user.avatar)
        setName(user.name); 
        setEmail(user.email)
        setPhone(user.phone || "");
    }, [user])

    return (
        <Card className="p-3 flex flex-col gap-2 flex-1">
            <ImageUpload 
                images={[avatar]}
                avatar={true}
                onChange={(str: string) => setAvatar(str)}
                onRemove={(str: string) => setAvatar(user?.avatar)}
                text="Change avatar"
            />

            <PersonalDetailsInput 
                value={name}
                setValue={setName}
                title="Phone"
            />
            <PersonalDetailsInput 
                value={email}
                setValue={setEmail}
                title="Email"
                disabled={true}
            />
            <PersonalDetailsInput 
                value={phone}
                setValue={setPhone}
                title="Phone number"
                placeholder="+254 711 000 222"
            />
            
            <Button className="self-end w-[200px]">
                Update
            </Button>
        </Card>
    )
};

export default PersonalDetails; 


const PersonalDetailsInput = (
    {value, setValue, title, placeholder, disabled}: 
    {
        value: string, 
        setValue: React.Dispatch<string>, 
        title: string,
        placeholder?: string,
        disabled?: boolean
    }) => {
    const [active, setActive] = React.useState<boolean>(false); 

    return (
        <>
            <FormTitle title={title}/>
            {/* <div className={cn(active ? "border-prim-color": "", "border rounded-lg overflow-hidden")}> */}
                <AppInput 
                    value={value}
                    setValue={setValue}
                    disabled={disabled}
                    placeholder={placeholder}
                />
            {/* </div> */}
        </>
    )
}