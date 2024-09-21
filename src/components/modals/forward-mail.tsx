
import React from "react"; 
import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import { Paragraph } from "../ui/typography";
import { Plus, X } from "lucide-react";
import { validateEmail } from "@/utils/validation";
import { createToast } from "@/utils/toast";
import { forwardMail } from "@/lib/api-calls/mails";


interface ForwardMailModalProps {
    id: string; 
    isOpen: boolean; 
    onClose: () => void; 
    setForwarded: React.Dispatch<boolean>; 
}

const ForwardMailModal: React.FC<ForwardMailModalProps> = ({
    id, isOpen, onClose, setForwarded
}) => {
    const [emails, setEmails] = React.useState<string[]>([]); 
    const [current, setCurrent] = React.useState<string>(""); 
    const [loading, setLoading] = React.useState<boolean>(false); 

    const handleForwardingMail = async () => {
        setLoading(true); 
        let res = await forwardMail(id, emails); 

        if (res) {
            createToast("success", "Mail has been forwarded.");
            setForwarded(true)
            setEmails([]);
            setCurrent("")
            onClose(); 
        };
        setLoading(false); 
    }
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
                        disabled={loading}
                    />
                </div>
                <Button
                    disabled={loading}
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
                    size="icon"
                >
                    <Plus size={18}/>
                </Button>
            </div>
            <div className="my-3 flex justify-end my-2">
                <Button 
                    className="w-[150px]"
                    disabled={loading}
                    onClick={handleForwardingMail}
                >
                    Forward{loading ? "ing...":""}
                </Button>
            </div>
        </Modal>
    )
};

export default ForwardMailModal; 