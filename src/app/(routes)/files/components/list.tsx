import React from "react";
import { useRouter } from "next/navigation";
// list type layout 
import { AppImage } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Heading3, Paragraph } from "@/components/ui/typography";
 

import {Buttons, SkeletonButtons} from "./grid"; 
import { icons } from "@/assets";
import { formatBytes } from "@/utils/size";
import {formatDateToString} from "@/utils/dates"
import {AttachmentType, FileType} from "@/types"; 
import { cn } from "@/lib/utils";


interface ListProps extends AttachmentType {};

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
    id, type, title, size, visibility, createdAt
}) => {
    const [loading, setLoading] = React.useState<boolean>(false); 
    const {push} = useRouter(); 

    let src: string = icons[type as FileType]; 

    return (
        <>
            <div 
                className={cn("flex items-center gap-2 my-2 cursor-pointer", type == "folder" ? "hover:text-main-color": "")}
                onClick={() => {
                    type === "folder" ? 
                        push(`/files?folder=${id}`):
                        {}
                }}
            >
                <div className="mr-3 relative w-[20px] h-[30px] lg:w-[30px] lg:h-[40px] overflow-hidden">
                    <AppImage 
                        src={src}
                        fill
                        title={title}
                        alt={title}
                        objectFit="contain"
                        nonBlur={true}
                    />
                </div>
                <Paragraph className={"flex-1 text-sm lg:text-md max-w-[60%]"}>{title}</Paragraph>
                
                <Paragraph className="min-w-[70px] text-xs lg:text-xs">{type}</Paragraph>
                <Paragraph className="min-w-[100px] text-xs lg:text-xs">{formatDateToString(createdAt)}</Paragraph>
                {type !== "folder" && <Paragraph className="min-w-[70px] text-xs lg:text-xs uppercase">{formatBytes(size)}</Paragraph>}
                
                {
                    type !== "folder" ? <Buttons fileId={id}/>: <></>
                }

            </div>
            <Separator />
        </>
    )
};

export default List; 