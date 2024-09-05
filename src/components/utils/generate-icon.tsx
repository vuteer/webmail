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

const GenerateIcon = (
    {id, type, title, size}: 
    {id: string, type: FileType, title: string, size: number}
) => {
    const [loading, setLoading] = React.useState<boolean>(false); 
    let src: string = icons[type as FileType]; 
  
    const handleDownload = async () => {
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
            <div className="flex flex-col flex-1">
                <Heading3 className={"text-sm lg:text-md line-clamp-1"}>{title}</Heading3>
                <Paragraph className="text-xs lg:text-xs uppercase">{formatBytes(size)}</Paragraph>
            </div>
            <Button 
                variant="ghost" 
                size="sm" 
                disabled={loading}
                onClick={handleDownload}
            >
                <Download size={18}/>
            </Button>
        </Card>
    )
};

export default GenerateIcon; 