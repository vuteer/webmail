import { AttachmentType, FileType } from "@/types";
import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import React from "react";
import { createToast } from "@/utils/toast";
import { renameFile } from "@/lib/api-calls/files";


interface FileRenameModalProps {
    fileId: string; 
    type: FileType;
    fileName: string; 
    files: AttachmentType[];
    setFiles: React.Dispatch<AttachmentType[]>;
    setFileName: React.Dispatch<string>;
    isOpen: boolean; 
    onClose: () => void; 
}; 


const FileRenameModal: React.FC<FileRenameModalProps> = ({
    fileId, type, fileName, setFileName, isOpen, onClose, files, setFiles
}) => {
    const [loading, setLoading] = React.useState<boolean>(false); 

    const handleUpdateFile = async () => {
        let file: any = files.filter(fl => fl.id === fileId); 
        file = file[0];

        if (!file) {
            createToast("error", "No such file was found!");
            return; 
        }
        if (file.title.toLowerCase() === fileName.toLowerCase()) {
            createToast("error", "File names are the same!"); 
            return; 
        }

        setLoading(true); 

        let res = await renameFile(fileId, fileName); 

        if (res) {
            createToast("success", "File has been renamed successfully!");
            onClose(); 
        };

        setLoading(false); 
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Rename ${type === "folder" ? "folder": "file"}`}
        >
            <AppInput 
                value={fileName}
                setValue={setFileName}
                placeholder={"Type file name"}
            />
            <Button 
                className="w-full my-3"
                disabled={loading}
                onClick={handleUpdateFile}
            >
                Save
            </Button>
        </Modal>
    )
};


export default FileRenameModal; 