// contact item
import React from "react";
import { EllipsisVertical } from "lucide-react";

import { AppAvatar } from "@/components";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Paragraph } from "@/components/ui/typography";
import ContactPopover from "@/components/popovers/contact-popover";

import { ContactType } from "@/types";

interface ContactItemProps extends ContactType {
    contacts: ContactType[]; 
    setContacts: React.Dispatch<ContactType[]>; 
};

export const ContactItemPlaceholder = () => (
    <div className="flex items-center gap-2">
        <Skeleton className="w-9 h-9 rounded-full"/>
        <Skeleton className="ml-8 flex-1 h-[15px] rounded-lg"/>
        <Skeleton className="flex-1 h-[15px] rounded-lg"/>
        <Button size={"icon"} variant="ghost">
            <EllipsisVertical size={18}/>
        </Button>
    </div>
)

const ContactItem: React.FC<ContactItemProps> = ({
    id, avatar, name, email, type, contacts, setContacts
}) => {

    return (
        <>
            <div className="flex items-center gap-2 my-1">
                <AppAvatar src={avatar} name={name} dimension="w-9 h-9"/>
                <Paragraph className="ml-8 flex-1 line-clamp-1">{name}</Paragraph>
                <Paragraph className="flex-1 line-clamp-1">{email}</Paragraph>
                <Paragraph className="flex-1 line-clamp-1 capitalize">{type}</Paragraph>
                <ContactPopover type={type} email={email} id={id} contacts={contacts} setContacts={setContacts}/>
            </div>
            <Separator />
        </>
    )
};

export default ContactItem; 