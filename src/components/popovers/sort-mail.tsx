// sort popover 
"use client"; 
import React from "react";
import { useRouter } from "next/navigation";

import { CheckCheck, ChevronDown } from "lucide-react";
import {Paragraph} from "@/components/ui/typography";

import PopoverContainer from "./container";
import {AppLinkButton} from "@/components";

import {useSearch} from "@/hooks";

type SortTypes = "recent" | "unread"; 

const SortPopover = () => {
    const [current, setCurrent] = React.useState<SortTypes>("recent");

    const searchParams = useSearch(); 
    let sort: any = searchParams?.get("sort") || "recent"; 

    const {push} = useRouter(); 

    React.useEffect(() => {
        setCurrent(sort)
    }, [sort])

    const handleItemSwitch = (item: SortTypes) => {
        setCurrent(item);
        
        // let entries = Object.entries(searchParams?.entries());
        let entries: any = searchParams?.entries(); 

        let queryStr =  '?'

        for (const [key, value] of entries) {
            console.log(key, value);
            if (key !== "sort" && key !== "threadId") queryStr = queryStr + `${key}=${value}&`
        }
        queryStr = queryStr + `sort=${item}`
        push(`/${queryStr}`); 

    }

    const list = (["recent", "unread"] as const); 

    return (
        <PopoverContainer
            contentClassName="w-[150px] absolute  -right-12"
            trigger={
                <AppLinkButton
                    type="outline"
                    size="sm"
                    className="flex items-center justify-between gap-2 w-[100px]"
                >
                    <span className="capitalize">{current}</span>
                    <ChevronDown size={18}/>
                </AppLinkButton>
            }
        >

            <div className="flex flex-col gap-2">
                {
                    list.map((item: SortTypes, index: number) => (
                        <Paragraph 
                            key={index} 
                            className="duration-700 cursor-pointer hover:text-main-color flex items-center gap-2"
                            onClick={() => handleItemSwitch(item)}
                        >
                            <CheckCheck size={18} color={item === current ? "#1C63EA": "transparent"}/>
                            <span className={"text-xs lg:text-sm capitalize"}>{item}</span>
                        </Paragraph>
                    ))
                }
            </div>
        </PopoverContainer>
    )
};

export default SortPopover; 