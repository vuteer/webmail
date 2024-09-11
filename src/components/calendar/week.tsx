import React from "react";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { getWeek } from "@/utils/month"
import { Paragraph } from "../ui/typography";
import {cn} from "@/lib/utils"; 
import { calendarStateStore } from "@/stores/calendar";


dayjs.extend(weekOfYear);

export const isToday = (date) => dayjs(new Date()).format("DD MMM, YYYY") === date; 


const Week = () => {
    const [currentWeek, setCurrentWeek] = React.useState<any>(getWeek())
    const [mounted, setMounted] = React.useState<boolean>(false); 

    // const week = dayjs().week();
    // console.log(`Current week:`, week, dayjs(new Date()).week(week));

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const { week, setWeek } = calendarStateStore(); 

    React.useEffect(() => setMounted(true), []);
    React.useEffect(() => {
        if (!mounted) return; 
        setWeek(dayjs().week())
    }, [mounted]);

    React.useEffect(() => {
        if (!mounted) return;
        setCurrentWeek(getWeek(week))
    }, [week, mounted])

 
   
    return (
        <div className="w-full p-4">
            <div className="flex">
                <div className="w-[70px]"/>
                <div className="flex-1 grid grid-cols-7 ">
                    {days.map((day, index) => (
                        <div key={day} className={cn(
                            "text-center flex flex-col items-center border-l pb-2",
                            // index === 5 ? "pr/-3": ""
                        )}>
                            <div className=" text-gray-500 mb-1">
                                <Paragraph>{day}</Paragraph>
                            </div>
                            <div
                                className={cn(
                                    `text-2xl font-semibold`,
                                    "rounded-full w-8 h-8 flex items-center justify-center",
                                    isToday(currentWeek[index].format("DD MMM, YYYY")) ? 'bg-blue-500 text-white  mx-auto' : '',
                                    
                                )}
                                    
                            >
                                {/* {console.log(currentWeek[index])} */}
                                <Paragraph>{currentWeek[index].format("DD")}</Paragraph>
                            </div>
                        </div>
                    ))}

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
                                <div key={index} className="border-r px-4 p-7"></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
      </div>
    )
};

export default Week; 