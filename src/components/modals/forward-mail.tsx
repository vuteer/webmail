
import React from "react"; 
import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import { Paragraph } from "../ui/typography";
import { X } from "lucide-react";
import { validateEmail } from "@/utils/validation";
import { createToast } from "@/utils/toast";


interface ForwardMailModalProps {
    id: string; 
    isOpen: boolean; 
    onClose: () => void; 
}

const ForwardMailModal: React.FC<ForwardMailModalProps> = ({
    id, isOpen, onClose
}) => {
    const [emails, setEmails] = React.useState<string[]>([]); 
    const [current, setCurrent] = React.useState<string>(""); 
    const [loading, setLoading] = React.useState<boolean>(false); 

    return (
        <Modal
            title="Forward mail"
            description="The mail will be forwarded to the list of emails you provide below!"
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="flex gap-2 flex-wrap">
                {
                    emails.map((mail: string, index: number) => (
                        <Paragraph
                            key={index}
                            className="px-2 text-xs lg:text-sm cursor-pointer hover:text-destructive hover:border-destructive rounded-full flex gap-2 items-center border duration-700"
                            onClick={() => setEmails([...emails.filter(ml => ml !== mail)])}
                        >
                            {mail}
                            <X size={18}/>
                        </Paragraph>
                    ))
                }

            </div>
            <div className="flex items-end gap-1">
                <div className="flex-1">
                    <AppInput 
                        value={current}
                        setValue={setCurrent}
                        placeholder={"user@gmail.com"}
                        label="Enter email"
                    />
                </div>
                <Button
                    onClick={() => {
                        if (validateEmail(current)) {
                            if (emails.includes(current)) {
                                createToast("error", "Email is already in list");
                                return; 
                            }
                            setEmails([ ...emails, current]);
                            setCurrent("")
                        } else {
                            createToast("error", "Enter a valid email.");
                            return; 
                        }
                    }}
                    variant="outline"
                >
                    Add
                </Button>
            </div>
            <div className="my-3 flex justify-end">
                <Button className="w-[150px]">
                    Forward
                </Button>
            </div>
        </Modal>
    )
};

export default ForwardMailModal; 