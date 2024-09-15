import React from "react";
import dayjs from 'dayjs';

import { Paragraph } from "../ui/typography";
import {cn} from "@/lib/utils"; 
import { calendarStateStore } from "@/stores/calendar";

import {checkEvent, generateHour, isToday, selectCubeTime} from "./week"; 
import Events from "./events";
import { EventType } from "@/types";

const DayContainer = () => {
    const [mounted, setMounted] = React.useState<boolean>(false); 

    const {day, setDay, monthIndex, year, setSelectedTime, setDaySelected, setShowEventModal} = calendarStateStore(); 
    const [currentDay, setCurrentDay] = React.useState<Date>(new Date())

    const hours = Array.from({ length: 24 }, (_, i) => i);
    React.useEffect(() => setMounted(true), []); 


    React.useEffect(() => {
        if (!mounted) return; 
        setDay(dayjs().date())
    }, [mounted]);

    React.useEffect(() => {
        setCurrentDay(new Date(year, monthIndex, day))
    }, [day]);

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


    return (
        <div className="w-full p-4">
            <div className="flex">
                <div className="w-[89px]"/>
                
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
                        <div className="border-r px-4 p-7 text-xs text-gray-500 w-[90px] h-full flex flex-col justify-center">
                            {generateHour(hour)}
                        </div>
                        <div 
                            className="flex-1 grid grid-cols-1 -mr-1 cursor-pointer"
                            onClick={() => {
                                        
                                selectCubeTime(
                                    new Date(year, monthIndex, day),
                                    generateHour(hour),
                                    setSelectedTime, setDaySelected
                                );
                                setShowEventModal()
                            }}
                        >
                            <HourEvents hour={hour} currentDay={currentDay}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default DayContainer; 

const HourEvents = ({hour, currentDay}: {hour: number, currentDay: Date}) => {
    const [hourEvents, setHourEvents] = React.useState<EventType[]>([]); 
    const {events} = calendarStateStore(); 

    React.useEffect(() => {
        let currentEvents = [];
        setHourEvents([])
        for (let i = 0; i < events.length; i++) {
            let event = events[i]; 
            let date = event.date; 

            if (dayjs(new Date(date)).format("DD MMM, YYYY") !== dayjs(new Date(currentDay)).format("DD MMM, YYYY")) return; 

            let checkedEvent = checkEvent(event, hour); 
            if (checkedEvent) currentEvents.push(checkedEvent);

            setHourEvents(currentEvents)
        }
    }, [events, currentDay])

    return (
        <Events events={hourEvents}/>
    )
}