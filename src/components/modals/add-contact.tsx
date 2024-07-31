// add contact 
import React from "react"; 
import {Modal} from "./modal"; 

import {AppInput} from "@/components";
import {Button} from "@/components/ui/button";
import FormTitle from "@/components/forms/components/form-title";

interface AddContactProps {
    isOpen: boolean; 
    onClose: () => void; 
};

const AddContactModal: React.FC<AddContactProps> = ({isOpen, onClose}) => {
    const [name, setName] = React.useState<string>(""); 
    const [email, setEmail] = React.useState<string>(""); 
    const [loading, setLoading] = React.useState<boolean>(false);


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
                    value={name}
                    setValue={setName}
                    placeholder="person@domain.com"
                    type="email"
                    disabled={loading}

                />

                <Button
                    disabled={loading}
                    className="mt-4"
                >
                    Save
                </Button>
            </div>

        </Modal>
    )
};

export default AddContactModal;