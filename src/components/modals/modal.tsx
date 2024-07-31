"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ModalProps {
    title: string;
    description?: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    width?: string; 
}

export const Modal: React.FC<ModalProps> = ({
    title, description, isOpen, onClose, children, width
}) => {
    const onChange = (open: boolean) => {
        if (!open) onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className={`${width ? "max-w-[80vw]": ""}`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {description && <DialogDescription >{description}</DialogDescription>}
                <div className="w-full">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}