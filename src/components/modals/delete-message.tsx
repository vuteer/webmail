import React from "react";
import { Button } from "../ui/button";
import Confirm from "./confirm";
import { deleteOne } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";
import { MailType } from "@/types";
import { useSearch } from "@/hooks";
import { useRouter } from "next/navigation";
import { useMailStoreState } from "@/stores/mail-store";

interface DeleteMessageModalProps {
    id: string; 
    isOpen: boolean; 
    draft?: boolean; 
    onClose: () => void;
    mails: MailType[]; 
    setMails: React.Dispatch<MailType[]>; 
};

const DeleteMessageModal: React.FC<DeleteMessageModalProps> = (
    {id, isOpen, onClose, draft, mails, setMails}
) => {
    const [loading, setLoading] = React.useState<boolean>(false);

    const {push} = useRouter(); 
    const searchParams = useSearch(); 
    const sec = searchParams?.get("get") || "inbox";
    const threadId = searchParams?.get("threadId") || "";

    const {addDeletedThreads} = useMailStoreState(); 
    
    const handleDelete = async () => {
        setLoading(true); 
        let res = await deleteOne(id); 
        if (res) {
            createToast("success", `Mail ${draft ? "discarded": "deleted"}!`); 
            let updated = [...mails.filter(ml => ml.id !== id)];

            if (updated.length === 0) {
                push(`/?sec=${sec}`);
                addDeletedThreads(threadId);
            } else setMails([...updated]); 
            onClose(); 
        };
        setLoading(false)
    }

    return (
        <Confirm
            isOpen={isOpen}
            onClose={onClose}
            title={draft ? `Discard the draft`: "Delete mail"}
            description={`The mail will be ${draft ? "discarded": "deleted"} completely. This action is irreservible and access to the mail will not be possible. If a mail has an attachment, it will also be deleted!`}
        >
            <div className="flex justify-end">
                <Button
                    disabled={loading}
                    className="min-w-[150px] my-3"
                    variant={"destructive"}
                    onClick={handleDelete}
                >
                    {draft ? "Discard": "Delet"}{loading ? "ing...": !draft ? "e": ""}
                </Button>
            </div>
        </Confirm>
    )
}

export default DeleteMessageModal; 