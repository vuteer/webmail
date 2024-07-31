// contacts column
"use client";

import React from "react";
import {  usePathname, useRouter } from "next/navigation";
import { Plus, ExternalLink } from 'lucide-react';

import {AppAvatar} from "@/components";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AddContactModal from '@/components/modals/add-contact';
import { Skeleton } from "@/components/ui/skeleton";
 
import User from "./user";

import { getContacts } from "@/lib/api-calls/contacts";
import { createArray } from "@/utils/format-numbers";
import { useAuthUser } from '@/auth/authHooks';
import { useCustomEffect } from "@/hooks/useEffect";

import {ContactType} from "@/types"; 

const Contacts = () => {
    const pathname = usePathname(); 
    const {push} = useRouter(); 

    const [mounted, setMounted] = React.useState<boolean>(false); 
    const [openContactModal, setOpenContactModal] = React.useState<boolean>(false)
    
    const [loading, setLoading] = React.useState<boolean>(true); 
    const [contacts, setContacts] = React.useState<ContactType[]>([]); 

    const auth = useAuthUser();
    const user = auth(); 

    React.useEffect(() => setMounted(true), []);

    const fetchContacts = async () => {
        setLoading(true); 
        let res = await getContacts("0", "5"); 

        if (res) {
            setContacts(res.docs)
        };

        setLoading(false); 
    }

    useCustomEffect(fetchContacts, [mounted]); 

    if (!mounted) return null; 

    return (
        <>
            {
                user && !pathname.includes("auth") && (
                    <div className="px-2 pb-5 border-l-[0.01rem] flex flex-col items-center gap-2">
                        <AddContactModal
                            isOpen={openContactModal}
                            onClose={() => setOpenContactModal(false)}
                        />
                        <User />
                        <Separator />

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className=' my-1'
                            onClick={() => setOpenContactModal(true)}
                        >
                            <Plus />
                        </Button>
                        <Separator  />
                        <div className="flex-1 flex flex-col gap-3 items-center">
                            {loading && <ContactsPlaceholder />}
                            {
                                !loading && (
                                    <>
                                        {
                                            contacts.map((contact, index) => (
                                                <div
                                                    key={index}
                                                    className="flex flex-col gap-2 items-center cursor-pointer hover:text-main-color duration-700"
                                                    onClick={() => push(`/write?to=${contact.email}`)}
                                                    
                                                >
                                                    <AppAvatar 
                                                        src={contact.avatar}
                                                        name={contact.name}
                                                        dimension={"w-10 h-10"}
                                                        key={index}
                                                        
                                                    />
                                                    <span className="text-xs">{contact.name.split(" ")[0]?.slice(0, 5)}..</span>
                                                    <Separator />
                                                </div>
                                            ))
                                        }
                                    </>
                                )
                            }
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => push("/contacts")}
                        >
                            <ExternalLink size={20}/>
                        </Button>
                    </div>

                )
            }
        </>
    )
};

export default Contacts; 


// placeholder 

const ContactsPlaceholder = () => {

    return (
        <>
            {
                createArray(6).map((_, index) => (
                    <Skeleton className="w-10 h-10 rounded-full" key={index}/>
                ))
            }
        </>
    )
}