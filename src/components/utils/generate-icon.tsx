import React from "react";
import {Download} from "lucide-react"; 

import {AppImage} from "@/components"
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Heading3, Paragraph } from "../ui/typography";

import { icons } from "@/assets";
import { formatBytes } from "@/utils/size";
import {FileType} from "@/types"; 
import { getFile } from "@/lib/api-calls/files";
import { createToast } from "@/utils/toast";

export const handleDownload = async (id: string, setLoading: React.Dispatch<boolean>) => {
    setLoading(true); 

    let res = await getFile(id);
    
    if (res) {
        // Create a temporary <a> element
        const link = document.createElement('a');
        link.target = "_blank";
        link.href = res.download_url;
        link.download = ''; // Optional: specify a default filename if desired
        document.body.appendChild(link);
        
        // Trigger a click event on the link to start the download
        link.click();
        
        // Remove the link from the document
        document.body.removeChild(link);
        createToast("success", "Download has been initiated!");
    };

    setLoading(false)
}

export const ActualGenerateIcon = ({type}: {type: FileType}) => (
    <div className="relative w-[20px] h-[30px] overflow-hidden">
        <AppImage 
            src={icons[type as FileType]}
            fill
            title={"icon"}
            alt={"icon"}
            objectFit="contain"
            nonBlur={true}
        />
    </div>
)
const GenerateIcon = (
    {id, type, title, size, onRemove}: 
    {id: string, type: FileType, title: string, size: number, onRemove?: (fileId: string) => void}
) => {
    const [loading, setLoading] = React.useState<boolean>(false); 
    let src: string = icons[type as FileType]; 
  
    
    return (
        <Card className="flex gap-2 items-center min-w-[200px] w-fit max-w-[250px] px-2">
            <div className="relative w-[30px] h-[40px] lg:w-[50px] lg:h-[60px] overflow-hidden">
                <AppImage 
                    src={src}
                    fill
                    title={title}
                    alt={title}
                    objectFit="contain"
                    nonBlur={true}
                />
            </div>
            <div className="flex flex-col flex-1 max-w-[50%]">
                <Heading3 className={"text-sm lg:text-md line-clamp-1"}>{title}</Heading3>
                <Paragraph className="text-xs lg:text-xs uppercase">{formatBytes(size)}</Paragraph>
                {
                    onRemove && (
                        <span 
                            className="text-[.8rem] lg:text-xs cursor-pointer hover:text-destructive duration-700"
                            onClick={() => onRemove(id)}
                        >Remove</span>
                    )
                }
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                disabled={loading}
                onClick={() => handleDownload(id, setLoading)}
            >
                <Download size={18}/>
            </Button>
        </Card>
    )
};

export default GenerateIcon; 

// Function to get the file extension
const getFileExtension = (filename: string) => {
    const parts: string[] = filename.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() : '';
};

// Function to categorize the file type
export const categorizeFileType = (filename: string) => {
    const extension: any = getFileExtension(filename);

    if (extension === '') {
        return 'other'; // If no extension, categorize as "other"
    }

    if (['mp3', 'wav', 'aac', 'ogg'].includes(extension)) {
        return 'audio';
    }
    if (['doc', 'docx', 'txt', 'ppt', 'pptx'].includes(extension)) {
        return 'document';
    }
    if (['pdf'].includes(extension)) {
        return 'PDF';
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
        return 'image';
    }
    if (['mp4', 'avi', 'mkv', 'mov'].includes(extension)) {
        return 'video';
    }
    if (['xls', 'xlsx'].includes(extension)) {
        return 'excel';
    }
    if (['csv'].includes(extension)) {
        return 'CSV';
    }
    if (['zip', 'rar', 'tar', 'gz'].includes(extension)) {
        return 'zip';
    }

    return 'other'; // Default category for unrecognized extensions
};