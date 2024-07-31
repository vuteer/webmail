// thread item
import React from "react"; 
import { useRouter } from "next/navigation";
import { Paperclip } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading3, Paragraph } from "@/components/ui/typography";

import { formatDateToString } from "@/utils/dates";
import { cn } from "@/lib/utils";
import { ThreadType } from "@/types";
 
import { useSearch } from "@/hooks/useSearchParams";
import ThreadSelect from "@/components/popovers/thread-select";
import { useMailNumbersStore } from "@/stores/mail-numbers";

interface ThreadProps extends ThreadType {
    selected: string[];
    setSelected: React.Dispatch<string[]>;
}; 

const Thread: React.FC<ThreadProps> = ({
    id, from, subject, attachments, 
    last_message, createdAt, unread, info,
    selected,
    setSelected
}) => {
    const {push} = useRouter(); 
    const queryParams = useSearch(); 

    const [actualUnread, setActualUnread] = React.useState<number>(unread)

    React.useEffect(() => {setActualUnread(unread)}, [unread])

    const threadID = queryParams?.get("threadId"); 

    // zustand state
    const {inbox, lessFromNumber} = useMailNumbersStore(); 


    const handleOpenMail = () => {
        const entries: any = queryParams?.entries(); 

        let queryStr = '?'; 

        for (const [key, value] of entries) {
             
            if (key !== "threadId") queryStr = queryStr + `${key}=${value}&`
        }
        queryStr = queryStr + `threadId=${id}`;
        setActualUnread(0)
        if (inbox && actualUnread) lessFromNumber("inbox", unread)
        push(queryStr);
    }

    return (
        <div 
            className={cn( "p-1 pb-0 rounded-lg my-1 w-full cursor-pointer duration-500 overflow-hidden")}
            onClick={handleOpenMail}
        >
            <div className="flex items-start gap-1 py-2 w-full overflow-hidden">
                <div className=" w-full flex flex-col gap-1 flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center overflow-hidden max-w-[68%]">
                        {
                                selected.length > 0 && (
                                      
                                        <Checkbox 
                                            id="terms1" 
                                            checked={selected.includes(id)}
                                            onClick={(e: any) => {
                                                e.stopPropagation(); 
                                            }}
                                            onCheckedChange={(e: any) => {
                    
                                                let present = selected.includes(id);
                    
                                                if (present) setSelected([...selected.filter(itm => itm !== id)]);
                                                else setSelected([...selected, id])
                                            }}
                                        
                                        />
                                )
                            } 
                            <Heading3 className="text-sm lg:text-md font-normal text-gray-500 line-clamp-1">{from.name.slice(0, 40)}</Heading3>
                            <span className={cn(actualUnread ? "bg-main-color": "", "block w-2 h-2 rounded-full")}/>

                        </div>
                        <div className="flex gap-2 items-center ">
                            {attachments && <Paperclip size={15}/>}
                            <span className="text-xs">{formatDateToString(new Date(createdAt))}</span>
                            <ThreadSelect 
                                id={id}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>
                    </div>
                    <Heading3 className="text-md lg:text-base line-clamp-1">{subject}</Heading3>
                    <div className="flex items-end w-full">
                        <Paragraph className="line-clamp-2 flex-1 text-gray-500 max-w-[360px]">{last_message?.text || "Click to open"}...</Paragraph>
                    </div>
                </div>
            </div>
            <Separator className={cn(threadID === id ? "bg-main-color": "", "duration-700")}/>
        </div>
    )
};

export default Thread; 

export const ThreadPlaceholder = () => (
    <>
        <div className="flex gap-1 my-2 w-full">
            <Skeleton className="w-8 h-8 rounded-full"/>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center">
                    <Skeleton className="w-[100px] rounded-full h-[13px]"/>
                    <div className="flex gap-2 items-center">
                        {/* <Paperclip size={18}/> */}
                        <Skeleton className="w-[70px] h-[12px] rounded-full"/>
                    </div>
                </div>
                <Skeleton className="w-[150px] rounded-full h-[13px]"/>
                <div className="flex items-end w-full">
                    <div className="w-full">
                        <Skeleton className="w-full h-[10px] rounded-full my-1"/>
                        <Skeleton className="w-full h-[10px] rounded-full my-1"/>
                        <Skeleton className="w-[80%] h-[10px] rounded-full my-1"/>
                    </div>
                     
                </div>
            </div>
        </div>
        <Separator />

    </>
)