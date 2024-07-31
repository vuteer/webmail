// thread select 
"use client"; 
import React from "react";
import { useRouter } from "next/navigation";

import PopoverContainer from "./container";
import AppLinkButton from "../common/app-link-button";
import { EllipsisVertical } from "lucide-react";
import { Paragraph } from "../ui/typography";
import { useSearch } from "@/hooks";

interface ThreadSelectProps {
    selected: string[]; 
    setSelected: React.Dispatch<string[]>; 
    id: string; 
}; 

const ThreadSelect: React.FC<ThreadSelectProps> = ({
    selected, setSelected, id
}) => {
    const {push} = useRouter(); 
    const searchParams = useSearch(); 

    const sec = searchParams?.get("sec");

    return (
        <PopoverContainer
            contentClassName="w-[100px] absolute  -right-5"

            trigger={
                <AppLinkButton
                    type="ghost"
                    size="sm"
                    
                >
                    <EllipsisVertical size={18}/>
                </AppLinkButton>
            }
        >
            <Paragraph 
                className="py-1 duration-700 cursor-pointer hover:text-main-color flex items-center gap-2"
                onClick={(e: any) => {
                    e.stopPropagation();

                    push(`/?sec=${sec || "inbox"}&threadId=${id}`)
                }}
            >
                <span className={"text-xs lg:text-sm"}>Open</span>
            </Paragraph>
            <Paragraph 
                className="py-1 duration-700 cursor-pointer hover:text-main-color flex items-center gap-2"
                onClick={(e: any) => {
                    e.stopPropagation();

                    let present = selected.includes(id);
                    if (present) setSelected([...selected.filter(itm => itm !== id)]);
                    else setSelected([...selected, id])
                }}
            >
                <span className={"text-xs lg:text-sm"}>{selected.includes(id) ? "Unselect": "Select"}</span>
            </Paragraph>

        </PopoverContainer>
    )
}; 


export default ThreadSelect; 