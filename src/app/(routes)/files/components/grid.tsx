import React from "react";
import { useRouter } from "next/navigation";

import { AppImage } from "@/components";
import { Heading3, Paragraph } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";

import { icons } from "@/assets";
import { formatBytes } from "@/utils/size";

import {AttachmentType, FileType} from "@/types"; 
import FileButtons from "./buttons";
import { cn } from "@/lib/utils";

interface GridProps {
    file: AttachmentType; 
    files: AttachmentType[];
    setFiles: React.Dispatch<AttachmentType[]>;
};


export const GridPlaceholder = () => {

    return (
        <div className="flex flex-col flex-1 gap-1 items-center">
            <Skeleton className="relative w-full h-[30px] lg:h-[100px]"/>
            <Skeleton className="w-[70%] h-[14px] rounded-full self-center"/>
            <Skeleton className="w-[30%] h-[10px] rounded-full self-center"/>
            {/* <SkeletonButtons /> */}
        </div>
    )
}

const Grid: React.FC<GridProps> = ({
    file, files, setFiles
}) => {
    let src: string = icons[file.type as FileType]; 
    const {push} = useRouter(); 


    return (
        <div 
            className={cn("flex flex-col items-center gap-1 cursor-pointer ", file.type === "folder" ? "hover:text-main-color": "")}
            onClick={() => {
                file.type === "folder" ? 
                    push(`/files?folder=${file.id}`):
                    {}
            }}
        >
            <div className="relative w-[30px] h-[40px] lg:w-[30px] lg:h-[30px] overflow-hidden">
                <AppImage 
                    src={src}
                    fill
                    title={file.title}
                    alt={file.title}
                    objectFit="contain"
                    nonBlur={true}
                />
            </div>
            <div className="flex flex-col flex-1">
                <Paragraph className={"text-center text-xs lg:text-sm line-clamp-1"}>{file.title}</Paragraph>
                {file.type !== "folder" && <Paragraph className="text-center text-xs lg:text-xs uppercase">{formatBytes(file.size)}</Paragraph>}
            </div>
            {/* <Buttons /> */}
        </div>
    )
};

export default Grid; 



export const SkeletonButtons = () => (
    <div className="flex gap-2 justify-center">
        <Skeleton className="w-9 h-9 rounded-lg"/>
        <Skeleton className="w-9 h-9 rounded-lg"/>
        <Skeleton className="w-9 h-9 rounded-lg"/>
        <Skeleton className="w-9 h-9 rounded-lg"/>
    </div>
)