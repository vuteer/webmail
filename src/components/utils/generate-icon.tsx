import {Download} from "lucide-react"; 

import {AppImage} from "@/components"
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Heading3, Paragraph } from "../ui/typography";

import { icons } from "@/assets";
import { formatBytes } from "@/utils/size";
import {FileType} from "@/types"; 

const GenerateIcon = (
    {type, title, size}: 
    {type: FileType, title: string, size: number}
) => {

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
            <div className="flex flex-col flex-1">
                <Heading3 className={"text-sm lg:text-md line-clamp-1"}>{title}</Heading3>
                <Paragraph className="text-xs lg:text-xs uppercase">{formatBytes(size)}</Paragraph>
            </div>
            <Button variant="ghost" size="sm">
                <Download size={18}/>
            </Button>
        </Card>
    )
};

export default GenerateIcon; 