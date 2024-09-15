// more popover 
import React from "react"; 
import Link from "next/link"; 

import {CheckCheck, ChevronDown } from "lucide-react"; 
 
import {AppLinkButton} from "@/components";
import PopoverContainer from "./container";
import { useSearch } from "@/hooks";

const CalendarPopover = () => {
    const searchParams = useSearch(); 
    const cal = searchParams?.get("cal") || "week"; 

    return (
        <>
            <PopoverContainer
                contentClassName="w-[150px] absolute  -right-[4rem]"
                trigger={
                    <AppLinkButton
                        type="outline"
                        size="sm"
                        className="w-[130px] flex gap-2 items-center rounded-full capitalize justify-between"
                    >
                        {cal} <ChevronDown size={20}/>
                    </AppLinkButton>
                }
            >
                <div className="flex flex-col gap-2">
                   {
                        calendarItems.map((item, index) => (
                            <Link
                                key={index}
                                href={`/calendar${item.href}`}
                                title={item.title}
                                className="flex gap-2 items-center justify-between text-xs lg:text-sm hover:text-main-color duration"
                            >
                                <span className="flex justify-between items-center gap-2">
                                    <CheckCheck size={18} color={`?cal=${cal}`=== item.href ? "#1C63EA": "transparent"}/>
                                    {item.title}
                                </span>
                                <span className="text-xs lg:text-xs text-gray-500">{item.abbrv}</span>
                            </Link>
                        ))
                   }
                </div>
            </PopoverContainer>
        </>
    )
};

export default CalendarPopover; 


type CalendarPopoverType = {
    title: string; 
    href: string; 
    abbrv: string; 
}

const calendarItems: CalendarPopoverType[] = [
    {
        title: "Day",
        href: "?cal=day",
        abbrv: "D"

    },
    {
        title: "Week",
        href: "?cal=week",
        abbrv: "W"
        
    },
    {
        title: "Month",
        href: "?cal=month",
        abbrv: "M"

    },
    {
        title: "Year",
        href: "?cal=year",
        abbrv: "Y"

    },
  
]
//  Day, Week, Month, Year, Schedule, 1 Week