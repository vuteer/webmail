import React from "react";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { getWeek } from "@/utils/month"
import { Paragraph } from "../ui/typography";
import {cn} from "@/lib/utils"; 
import { calendarStateStore } from "@/stores/calendar";


dayjs.extend(weekOfYear);

export const isToday = (date: any) => dayjs(new Date()).format("DD MMM, YYYY") === date; 

export const selectCubeTime = (
    day: Date | undefined, time: string,
    setSelectedTime: any, setDaySelected: any
) => {
    setSelectedTime(time); 
    setDaySelected(day); 
}
const Week = () => {
    const [currentWeek, setCurrentWeek] = React.useState<any>(getWeek())
    const [mounted, setMounted] = React.useState<boolean>(false); 

    // const week = dayjs().week();
    // console.log(`Current week:`, week, dayjs(new Date()).week(week));

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const hours = Array.from({ length: 24 }, (_, i) => i)

    const { week, setWeek, setShowEventModal, selectedTime, setSelectedTime, setDaySelected, daySelected } = calendarStateStore(); 

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
                <div className="w-[89px]"/>
                <div className="flex-1 grid grid-cols-7 ">
                    {days.map((day, index) => (
                        <div key={day} className={cn(
                            "text-center flex flex-col items-center border-l pb-2",
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
                        <div className="border-r px-4 p-7 text-xs text-gray-500 w-[90px] h-full flex flex-col justify-center">
                            {generateHour(hour)}
                        </div>
                        <div className="flex-1 grid grid-cols-7 -mr-1">
                            {Array.from({ length: 7 }).map((_, index) => (
                                <div 
                                    key={index} className="border-r px-4 p-7 cursor-pointer" 
                                    onClick={() => {
                                         
                                        let time = generateHour(hour);
                                        let date = currentWeek[index].format("D");
                                        let month = currentWeek[index].format("M"); 
                                        let year = currentWeek[index].format("YYYY"); 

                                        selectCubeTime(
                                            new Date(year, month, date),
                                            time,
                                            setSelectedTime, setDaySelected
                                        );
                                        setShowEventModal()
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
      </div>
    )
};

export default Week; 


export const generateHour = (hour: number) => hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;