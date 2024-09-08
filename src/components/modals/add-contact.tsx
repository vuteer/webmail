// add contact 
import React from "react"; 
import {Modal} from "./modal"; 

import {AppInput} from "@/components";
import {Button} from "@/components/ui/button";
import FormTitle from "@/components/forms/components/form-title";
import { ContactType } from "@/types";
import { validateEmail } from "@/utils/validation";
import { createToast } from "@/utils/toast";
import { saveContact } from "@/lib/api-calls/contacts";

interface AddContactProps {
    isOpen: boolean; 
    onClose: () => void; 
    contacts: ContactType[]; 
    setContacts: React.Dispatch<ContactType[]>; 
};

const AddContactModal: React.FC<AddContactProps> = (
    {isOpen, onClose, contacts, setContacts}
) => {
    const [name, setName] = React.useState<string>(""); 
    const [email, setEmail] = React.useState<string>(""); 
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleAddContact = async () => {
        if (!validateEmail(email)) {
            createToast("error", "Provide a valid email!"); 
            return; 
        }; 
        if (!name) {
            createToast("error", "Provide a name for the contact!");
            return; 
        };
        setLoading(true); 

        let res = await saveContact({email, name}); 
        if (res) {
            createToast("success", "Contact has been saved!"); 
            setContacts([
                {
                    avatar: "", 
                    email, 
                    name, 
                    type: "external", 
                    id: res.doc,
                    saved: true
                }, ...contacts]);
                setEmail("");
                setName("")
                onClose()
        };
        setLoading(false); 
    }
    return (
        <Modal
            title="Save Contact"
            description="Add contact to your list and access it with ease."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={"flex flex-col"}>
                <FormTitle title="Name"/>
                <AppInput 
                    value={name}
                    setValue={setName}
                    placeholder="John Wafula"
                    disabled={loading}
                />
                <FormTitle title="Email"/>
                <AppInput 
                    value={email}
                    setValue={setEmail}
                    placeholder="person@domain.com"
                    type="email"
                    disabled={loading}
                />

                <Button
                    disabled={loading}
                    className="mt-4 self-end w-[150px]"
                    onClick={handleAddContact}
                    
                >
                    Save
                </Button>
            </div>

        </Modal>
    )
};

export default AddContactModal;