// saved contact items 
"use client"; 

import React from "react";
import { Plus, RefreshCcw } from "lucide-react"; 

import {AppInput} from "@/components"; 
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading2, Heading3, Paragraph } from "@/components/ui/typography";
  
import { Separator } from "@/components/ui/separator";

import { numberWithCommas, createArray } from "@/utils/format-numbers";
import ContactItem, { ContactItemPlaceholder }  from "./contact-item"; 
import AddContactModal from "@/components/modals/add-contact"; 

import { getContacts } from "@/lib/api-calls/contacts"
import { ContactType } from "@/types";
import { cn } from "@/lib/utils"; 
import { useCustomEffect } from "@/hooks"

const Contacts = ({type}: {type: "saved" | "organization"}) => {

    const [contacts, setContacts] = React.useState<ContactType[]>([]); 
    const [count, setCount] = React.useState<number>(0); 
    const [loading, setLoading] = React.useState<boolean>(true); 

    const [search, setSearch] = React.useState<string>("");

    const [openAddContactModal, setOpenAddContactModal] = React.useState<boolean>(false); 
    
    const fetchContacts = async () => {
        setLoading(true);

        let res = await getContacts();

        if (res) {
            setContacts(res.docs)
            setCount(res.count)
        };

        setTimeout(() => setLoading(false), 1500)
    }

    useCustomEffect(fetchContacts, [])

    return (
        <>
            <AddContactModal 
                isOpen={openAddContactModal}
                onClose={() => setOpenAddContactModal(false)}
            />
            <Card className={cn(type === "organization" ? "w-[30%]":"flex-1", "p-2 h-[89vh] flex-col flex gap-1")}>
                <Heading2 className="text-sm lg:text-md text-center py-2">
                    My Contacts
                    ({numberWithCommas(count)})
                </Heading2>
                <Separator />

                <div className="flex justify-between items-center my-2">
                    <Paragraph></Paragraph>
                    <div className="flex items-center gap-1">
                        <AppInput 
                            value={search}
                            setValue={setSearch}
                            placeholder="Search contact"
                            cls="w-[250px]"
                            disabled={loading}
                            containerClassName="rounded-full"
                        />
                         
                        <>
                            <Button 
                                variant="outline" 
                                size="icon"
                                className="rounded-full" 
                                disabled={loading}
                                onClick={() => setOpenAddContactModal(true)}
                            >
                                <Plus size={18}/>
                            </Button>
                            <Button 
                                variant="default" 
                                size="icon"
                                className="rounded-full"
                                onClick={fetchContacts}
                                disabled={loading}
                            >
                                <RefreshCcw size={18}/>
                            </Button>
                        </>
                         
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-[80vh]">
                    {
                        loading && (
                            <div className="flex flex-col gap-2">
                                {
                                    createArray(25).map((_, index) => (
                                        <ContactItemPlaceholder key={index} type={type}/>
                                    ))
                                }
                            </div>
                        )
                    }
                    {
                        !loading && count ? (
                            <div className="flex flex-col gap-2">
                                {
                                    contacts.map((contact, index) => (
                                        <ContactItem key={index} {...contact}/>
                                    ))
                                }
                            </div>
                        ): <></>
                    }
                    {
                        !loading && !count ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <Heading3 className="text-sm lg:text-md">You have no contacts.</Heading3>
                            </div> 
                        ): <></>
                    }
                </div>
            </Card>

        </>
    )
};

export default Contacts; 