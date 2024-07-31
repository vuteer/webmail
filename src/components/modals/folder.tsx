"use client";

import React from "react";

import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import { Modal } from "./modal";

interface AddFolderModalProps {
    isOpen: boolean; 
    onClose: () => void; 
     
}

const AddFolderModal: React.FC<AddFolderModalProps> = ({isOpen, onClose}) => {
    const [folderName, setFolderName] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false)

     
    return (
        <Modal
            title="Add Folder"
            isOpen={isOpen}
            onClose={onClose}
        >
            <>
                <AppInput 
                    value={folderName}
                    setValue={setFolderName}
                    label="Folder Name"
                    disabled={loading}
                />

                <div className="mt-2 flex justify-end">
                    <Button
                        disabled={loading}
                    >
                        Create
                    </Button>
                </div>
            </>
        </Modal>
)}; 

export default AddFolderModal; 