"use client";

import React from "react";

import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import { Modal } from "./modal";

import { AttachmentType } from "@/types";
import { createToast } from "@/utils/toast";
import { useSearch } from "@/hooks";
import { createFolder } from "@/lib/api-calls/files";

interface AddFolderModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    setFiles: React.Dispatch<AttachmentType[]>;
    files: AttachmentType[]; 
    count: number; 
    setCount: React.Dispatch<number>; 
     
}

const AddFolderModal: React.FC<AddFolderModalProps> = (
    {isOpen, onClose, setFiles, files, count, setCount}
) => {
    const [folderName, setFolderName] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);

    const searchParams = useSearch(); 
    const folder = searchParams?.get("folder") || ""; 

     const handleCreateFolder = async () => {
        if (!folderName) {
            createToast("error", "Provide a folder name");
            return
        }

        setLoading(true); 
        let title = folderName;
        let res = await createFolder(title, folder); 

        if (res) {
            createToast('success', 'Folder has been created!'); 

            let f: AttachmentType = {
                id: res.doc, 
                title: folderName, 
                size: 0, 
                type: "folder",
                createdAt: new Date()
            };

             
            let newFiles = [...files, f];
            setFiles([])
            setFiles(newFiles);

            setCount(count + 1); 
            setFolderName("")
            onClose(); 
        };
        setLoading(false)
     }
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
                        onClick={handleCreateFolder}
                    >
                        Creat{loading ? 'ing...': "e"}
                    </Button>
                </div>
            </>
        </Modal>
)}; 

export default AddFolderModal; 