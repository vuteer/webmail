// more popover 
import React from "react"; 
import {useRouter} from "next/navigation"; 

import {EllipsisVertical, Trash2 } from "lucide-react"; 
 
import {AppLinkButton} from "@/components";
import {Button} from "@/components/ui/button";
import PopoverContainer from "./container";
import Confirm from "../modals/confirm";
import { Paragraph } from "@/components/ui/typography";
import { deleteContact } from "@/lib/api-calls/contacts";
import { createToast } from "@/utils/toast";
import { ContactType } from "@/types";


const ContactPopover = (
    {type, email, id, contacts, setContacts}: 
    {
        type: "internal" | "external"; 
        email: string; 
        id: string;
        contacts: ContactType[];
        setContacts: React.Dispatch<ContactType[]>; 
    }) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false)
    const [loading, setLoading] = React.useState<boolean>(false);

    const {push} = useRouter(); 

    const handleDelete = async () => {
        setLoading(true); 

        let res = await deleteContact(id); 

        if (res) {
            setContacts([]); 
            setContacts([...contacts.filter(cnt => cnt.id !== id)]); 
            createToast("success", "Contact has been deleted!"); 
        };
        setLoading(false); 
    }
    return (
        <>
             <Confirm
                title="Delete contact"
                description="Do you wish to delete the contact from your contacts? The action is irreversible"
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
             >
                <div className="flex justify-end">
                    <Button 
                        className="gap-2 items-center" 
                        variant="destructive"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        <Trash2 /> Proceed
                    </Button>
                </div>
            </Confirm>

            <PopoverContainer
                contentClassName="w-[150px] absolute  -right-5"
                trigger={
                    <AppLinkButton
                        type="ghost"
                        size="icon"
                    >
                        <EllipsisVertical size={18} />
                    </AppLinkButton>
                }
            >
                <div className="flex flex-col gap-2">
                    <Paragraph 
                        className="text-xs lg:text-sm cursor-pointer duration-700 hover:text-main-color"
                        onClick={() => push(`/write?to=${email}`)}
                    >Send mail</Paragraph>
                    {type === "external" && (
                        <Paragraph 
                            className="text-xs lg:text-sm cursor-pointer duration-700 hover:text-destructive"
                            onClick={() => setOpenDeleteModal(true)}
                            
                        >
                            Delete
                        </Paragraph>
                    )}
                </div>
            </PopoverContainer>
        </>
    )
};

export default ContactPopover; 


 // send mail, delete 