// personal info 
"use client"; 

import React from "react";

import { AppInput } from "@/components";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"
import ImageUpload from "@/components/forms/components/image-upload";
import FormTitle from "@/components/forms/components/form-title";

import { useAuthUser } from "@/auth/authHooks";
import { useCustomEffect } from "@/hooks";
import { getUser, updateUser } from "@/lib/api-calls/user";

import { createToast } from "@/utils/toast";

const PersonalDetails = () => {
    const [currentUser, setCurrentUser] = React.useState<string>(""); 
    const [avatar, setAvatar] = React.useState<string>("https://res.cloudinary.com/dyo0ezwgs/image/upload/v1701015303/defaults/user-avatar_fjqn4g.png"); 
    const [name, setName] = React.useState<string>(""); 
    const [email, setEmail] = React.useState<string>(""); 
    const [phone, setPhone] = React.useState<string>(""); 

    const [mounted, setMounted] = React.useState<boolean>(true); 
    const [loading, setLoading] = React.useState<boolean>(false); 
    const [edited, setEdited] = React.useState<boolean>(false); 

    const auth = useAuthUser(); 
    const user = auth(); 

    React.useEffect(() => setMounted(true), []); 

     
    const fetchUser = async () => {
        if (!mounted) return; 
        setLoading(true); 

        let res = await getUser(); 
        if (res) {
            let user = res.user
            setAvatar(user.avatar); 
            setEmail(user.email);
            setName(user.name); 
            setPhone(user.phone);

            setCurrentUser(JSON.stringify({
                avatar: user.avatar, 
                email: user.email, 
                name: user.name, 
                phone: user.phone
            }))
        };

        setLoading(false)
    }

    useCustomEffect(fetchUser, [mounted])

    React.useEffect(() => {
        if (!mounted) return; 

        let updated = JSON.stringify({
            avatar, email, name, phone
        });

        if (updated !== currentUser) setEdited(true);
        else setEdited(false)
    }, [avatar, name, email, phone]);

    const handleUpdate = async () => {
        let updateStr = JSON.stringify({
            avatar, email, name, phone
        })
        if (currentUser === updateStr) {
            createToast("error", "Nothing to update!");
            return; 
        };
        setLoading(true); 

        let res = await updateUser({
            avatar, name, phone
        }); 

        if (res) createToast("success", "Details have been updated!")
        setLoading(false)
    }

    return (
        <Card className="p-3 flex flex-col gap-2 flex-1">
            <ImageUpload 
                images={[avatar]}
                avatar={true}
                onChange={(str: string) => setAvatar(str)}
                onRemove={(str: string) => setAvatar("https://res.cloudinary.com/dyo0ezwgs/image/upload/v1701015303/defaults/user-avatar_fjqn4g.png")}
                text="Change avatar"
            />

            <PersonalDetailsInput 
                value={name}
                setValue={setName}
                title="Phone"
                disabled={loading}
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
                disabled={loading}
            />
            {
                edited && (
                    <Button 
                        className="self-end w-[200px]"
                        disabled={loading}
                        onClick={handleUpdate}
                    >
                        Updat{loading ? "ing...": "e"}
                    </Button>
                )
            }
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