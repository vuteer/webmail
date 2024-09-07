// file buttons 
"use client";

import React from "react";
import { Download, FilePenLine, Share2, Trash2 } from "lucide-react";

import Confirm from "@/components/modals/confirm";
import { Button } from "@/components/ui/button";
import { handleDownload } from "@/components/utils/generate-icon";
import FileOptions from "@/components/popovers/file-options";
import { AttachmentType, FileType, VisibilityType } from "@/types";
import FileRenameModal from "@/components/modals/file-rename";
import { deleteFile } from "@/lib/api-calls/files";
import { createToast } from "@/utils/toast";
import ShareSheet from "@/components/sheets/share";

interface FileButtonsProps {
    grid?: boolean;
    fileId: string;
    fileName: string;
    visibility: VisibilityType; 
    sharedWith: string[]; 
    setFileName: React.Dispatch<string>;
    type: FileType;
    files: AttachmentType[];
    setFiles: React.Dispatch<AttachmentType[]>;
}

const FileButtons: React.FC<FileButtonsProps> = (
    { grid, fileId, fileName, setFileName, type, files, setFiles, visibility, sharedWith }
) => {
    const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false);
    const [openRenameModal, setOpenRenameModal] = React.useState<boolean>(false); 

    const [loading, setLoading] = React.useState<boolean>(false);

    const handleDelete = async () => {
        setLoading(true); 

        let res = await deleteFile(fileId); 

        if (res) {
            // handle filtering the file by id
            setFiles([...files.filter(fl => fl.id !== fileId)])
            createToast("success", `The ${type} was deleted!`); 
            setOpenDeleteModal(false);
        };

        setLoading(false); 
    }
    return (
        <>
             
            <FileRenameModal 
                fileId={fileId}
                type={type}
                isOpen={openRenameModal}
                onClose={() => setOpenRenameModal(false)}
                fileName={fileName}
                setFileName={setFileName}
                files={files}
                setFiles={setFiles}
            />
            <Confirm
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                title={`Delete the ${type} ${fileName}`}
                description={`Deleting the ${type} - ${fileName} is irreversible. ${type === "folder" ? "As for folders, all its contents will be deleted as well!": ""} Do you wish to proceed?`}
            >
                <div className="flex justify-end">
                    <Button
                        variant="destructive"
                        disabled={loading}
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </Confirm>

            <div className="flex gap-2 items-center">
                {
                    type !== "folder" ? (
                        <>
                            <Button
                                variant="ghost"
                                size={"sm"}
                                disabled={loading}
                                onClick={() => handleDownload(fileId, setLoading)}
                            >
                                <Download size={18} />
                            </Button>
                             
                            <ShareSheet 
                                fileId={fileId}
                                title={fileName}
                                visibility={visibility}
                                sharedWith={sharedWith}
                            />

                            {
                                grid ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            onClick={() => setOpenDeleteModal(true)}
                                            disabled={loading}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            onClick={() => setOpenDeleteModal(true)}
                                            disabled={loading}
                                        >
                                            <FilePenLine size={18} />
                                        </Button>
                                    </>
                                ) : (
                                    <FileOptions
                                        fileId={fileId}
                                        fileName={fileName}
                                        setFileName={setFileName}
                                        setOpenRenameModal={setOpenRenameModal}
                                        setOpenDeleteModal={setOpenDeleteModal}
                                    />
                                )
                            }

                        </>
                    ) : (
                        <>
                            <Button variant={"ghost"} size="sm" className="text-transparent" disabled={true}>GH</Button>
                            <Button variant={"ghost"} size="sm" className="text-transparent" disabled={true}>GH</Button>
                            {
                                grid ? (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            onClick={() => setOpenDeleteModal(true)}
                                            disabled={loading}
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size={"sm"}
                                            onClick={() => setOpenDeleteModal(true)}
                                            disabled={loading}
                                        >
                                            <FilePenLine size={18} />
                                        </Button>
                                    </>
                                ) : (
                                    <FileOptions
                                        fileId={fileId}
                                        fileName={fileName}
                                        setFileName={setFileName}
                                        setOpenRenameModal={setOpenRenameModal}
                                        setOpenDeleteModal={setOpenDeleteModal}
                                    />
                                )
                            }
                        </>
                    )
                }
            </div>
        </>
    )
};

export default FileButtons; 