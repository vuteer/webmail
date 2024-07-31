// more popover 
import React from "react"; 
import Link from "next/link"; 

import {CheckCheck, ChevronDown } from "lucide-react"; 
 
import {AppLinkButton} from "@/components";
import PopoverContainer from "./container";
import { useSearch } from "@/hooks";

const CalendarPopover = () => {
    const searchParams = useSearch(); 
    const cal = searchParams?.get("cal") || "day"; 

    return (
        <>
            <PopoverContainer
                contentClassName="w-[150px] absolute  -right-12"
                trigger={
                    <AppLinkButton
                        type="outline"
                        size="sm"
                        className="w-[100px] flex gap-2 items-center"
                    >
                        Day <ChevronDown size={20}/>
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
                                className="flex gap-2 items-center text-xs lg:text-sm hover:text-main-color duration"
                            >
                                <CheckCheck size={18} color={`?cal=${cal}`=== item.href ? "#1C63EA": "transparent"}/>
                                {item.title}
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
}

const calendarItems: CalendarPopoverType[] = [
    {
        title: "Day",
        href: "?cal=day"
    },
    {
        title: "Week",
        href: "?cal=week"
    },
    {
        title: "Month",
        href: "?cal=month"
    },
    {
        title: "Year",
        href: "?cal=year"
    },
    {
        title: "1 Week",
        href: "?cal=1week"
    }
]
//  Day, Week, Month, Year, Schedule, 1 Week