import React from "react";
import { Button } from "../ui/button";
import Confirm from "./confirm";

interface DeleteMessageModalProps {
    id: string; 
    isOpen: boolean; 
    draft?: boolean; 
    onClose: () => void; 
};

const DeleteMessageModal: React.FC<DeleteMessageModalProps> = (
    {id, isOpen, onClose, draft}
) => {
    const [loading, setLoading] = React.useState<boolean>(false); 

    return (
        <Confirm
            isOpen={isOpen}
            onClose={onClose}
            title={draft ? `Discard the draft`: "Delete mail"}
            description={`The mail will be ${draft ? "discarded": "deleted"} completely. This action is irreservible and access to the mail will not be possible.`}
        >
            <div className="flex justify-end">
                <Button
                    disabled={loading}
                    className="min-w-[150px] my-3"
                    variant={"destructive"}
                >
                    {draft ? "Discard": "Delet"}{loading ? "ing...": !draft ? "e": ""}
                </Button>
            </div>
        </Confirm>
    )
}

export default DeleteMessageModal; 