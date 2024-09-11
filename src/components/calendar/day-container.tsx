import React from "react";
import dayjs from 'dayjs';

import { Paragraph } from "../ui/typography";
import {cn} from "@/lib/utils"; 
import { calendarStateStore } from "@/stores/calendar";

import {isToday} from "./week"; 

const DayContainer = () => {
    const {day, setDay, monthIndex, year} = calendarStateStore(); 
    const [currentDay, setCurrentDay] = React.useState<Date>(new Date())

    const hours = Array.from({ length: 24 }, (_, i) => i);

    React.useEffect(() => {
        setDay(dayjs().date())
    }, []);

    React.useEffect(() => {
        setCurrentDay(new Date(year, monthIndex, day))
    }, [day]);

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


    return (
        <div className="w-full p-4">
            <div className="flex">
                <div className="w-[70px]"/>
                
                <div className={cn(
                    "text-center flex flex-col items-center border-l pb-2 px-5",
                )}>
                    <div className=" text-gray-500 mb-1">
                        <Paragraph>{days[dayjs(new Date(year, monthIndex, currentDay.getDay())).day() || 0]}</Paragraph>
                    </div>
                    <div
                        className={cn(
                            `text-2xl font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto`,
                            isToday(dayjs(new Date(year, monthIndex, currentDay.getDate())).format("DD MMM, YYYY")) ? "bg-blue-500 text-white": "border"
                        )}
                            
                    >
                        <Paragraph>{currentDay.getDate()}</Paragraph>
                    </div>
                </div>
                 
            </div>
            <div className="border-t overflow-auto h-[80vh]">
                {hours.map((hour) => (
                    <div key={hour} className="flex border-b h-[100px]">
                        <div className="border-r px-4 p-7 text-xs text-gray-500 w-[70px] h-full flex flex-col justify-center">
                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </div>
                        <div className="flex-1 grid grid-cols-7 -mr-1">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div key={index} className="px-4 p-7"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default DayContainer; 