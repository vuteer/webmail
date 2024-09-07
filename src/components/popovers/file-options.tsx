import { MoreVertical } from "lucide-react";
import AppLinkButton from "../common/app-link-button";
import PopoverContainer from "./container";
import { Paragraph } from "../ui/typography";
import React from "react";


interface FileOptionsProps {
    fileId: string; 
    fileName: string; 
    setFileName: React.Dispatch<string>; 
    setOpenRenameModal: React.Dispatch<boolean>;
    setOpenDeleteModal: React.Dispatch<boolean>;
}
const FileOptions: React.FC<FileOptionsProps> = (
    {fileId, fileName, setFileName, setOpenRenameModal, setOpenDeleteModal}
) => {

    return (
        <PopoverContainer
            contentClassName="w-[100px] absolute -right-6"
            trigger={
                <AppLinkButton
                    type="ghost"
                    size="sm"
                >
                    <MoreVertical />
                </AppLinkButton>
            }
        >
            <Paragraph 
                className="text-sm lg:text-md cursor-pointer my-2 hover:text-main-color"
                onClick={(e: any) => {
                    e.stopPropagation(); 
                    setOpenRenameModal(true)
                }}
            >Rename</Paragraph>
            <Paragraph 
                className="text-sm lg:text-md cursor-pointer my-2 hover:text-destructive"
                onClick={(e: any) => {
                    e.stopPropagation();
                    setOpenDeleteModal(true)
                }}
            >Delete</Paragraph>
        </PopoverContainer>
    )
};

export default FileOptions; 