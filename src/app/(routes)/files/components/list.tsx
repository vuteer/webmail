import React from "react";
import { useRouter } from "next/navigation";
// list type layout 
import { AppImage } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Paragraph } from "@/components/ui/typography";
import FileButtons from "./buttons";
import { SkeletonButtons } from "./grid";

import { icons } from "@/assets";
import { formatBytes } from "@/utils/size";
import { formatDateToString } from "@/utils/dates"
import { AttachmentType, FileType } from "@/types";
import { cn } from "@/lib/utils";
import { getFileName } from "./utils";


interface ListProps {
    file: AttachmentType; 
    files: AttachmentType[];
    setFiles: React.Dispatch<AttachmentType[]>;
 };

export const ListPlaceholder = () => (
    <div className="flex items-center gap-2 my-1">
        <Skeleton className="relative w-[30px] h-[30px] lg:w-[50px] lg:h-[50px] overflow-hidden" />
        <div className="flex-1 flex flex-col gap-1">
            <Skeleton className="w-full h-[12px] rounded-full" />
            <Skeleton className="w-[150px] h-[10px] rounded-full" />
            <Skeleton className="w-[100px] h-[10px] rounded-full" />
        </div>
        <SkeletonButtons />
    </div>
);

const List: React.FC<ListProps> = ({
    file, files, setFiles
}) => {
    // const [loading, setLoading] = React.useState<boolean>(false); 
    const [fileName, setFileName] = React.useState<string>(getFileName(file.title))
    const { push } = useRouter();

    let src: string = icons[file.type as FileType];

    const handleOpenFolder = () => {
        file.type === "folder" ?
            push(`/files?folder=${file.id}`) :
            {}
    }
    return (
        <>
            <div
                className={cn("flex items-center gap-2 my-2 cursor-pointer", file.type == "folder" ? "hover:text-main-color" : "")}
            >
                <div 
                    className="mr-3 relative w-[20px] h-[30px] lg:w-[30px] lg:h-[40px] overflow-hidden"
                    onClick={handleOpenFolder}
                >
                    <AppImage
                        src={src}
                        fill
                        title={file.title}
                        alt={file.title}
                        objectFit="contain"
                        nonBlur={true}
                    />
                </div>
                <Paragraph 
                    className={cn("flex-1 text-sm lg:text-md max-w-[55%]")}
                    onClick={handleOpenFolder}
                >{fileName}</Paragraph>
                
                <Paragraph className="min-w-[70px] text-xs lg:text-xs capitalize">{file.type}</Paragraph>
                <Paragraph className="min-w-[100px] text-xs lg:text-xs">{formatDateToString(file.createdAt)}</Paragraph>
                <Paragraph className={cn("min-w-[70px] text-xs lg:text-xs uppercase", file.type === "folder" ? "text-transparent ": "")}>{file.type !== "folder" ? formatBytes(file.size): "34.5KB"}</Paragraph>


                <div className="min-w-[30%] flex justify-end">
                    {
                        file.type === "folder" && (file.title === "sent" || file.title === "received") ? (
                            <></>
                        ): (
                            <FileButtons 
                                fileId={file.id} 
                                setFileName={setFileName} 
                                fileName={fileName} 
                                type={file.type}
                                files={files}
                                setFiles={setFiles}
                                visibility={file.visibility || "private"}
                                sharedWith={file.sharedWith || []}
                            /> 
                        )
                    }
                </div>

                

            </div>
            <Separator />
        </>
    )
};

export default List; 