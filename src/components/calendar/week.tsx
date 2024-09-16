import React from "react";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { getWeek } from "@/utils/month"
import { Paragraph } from "../ui/typography";
import { cn } from "@/lib/utils";
import { calendarStateStore } from "@/stores/calendar";
import { EventType } from "@/types";
import Events from "./events";


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
                <div className="w-[89px]" />
                <div className="flex-1 grid grid-cols-7">
                    {days.map((day, index) => (
                        <Day
                            key={index}
                            day={day}
                            current={currentWeek[index]}
                        />
                    ))}

                </div>
            </div>
            <div className="border-t overflow-auto h-[80vh] pb-8">
                {hours.map((hour) => (
                    <Hour
                        key={hour}
                        currentWeek={currentWeek}
                        hour={hour}
                    />
                ))}
            </div>
        </div>
    )
};

export default Week;

export const generateHour = (hour: number) => hour === 0 ? '12:00 AM' : hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;

export const Day = (
    { day, current, noBorder }:
        {
            day: string;
            current: any;
            noBorder?: boolean; 
        }
) => {

    return (
        <div className={cn(
            "text-center flex flex-col items-center  pb-2", noBorder ? "": "border-l",
        )}>
            <div className=" text-gray-500 mb-1">
                <Paragraph>{day}</Paragraph>
            </div>
            <div
                className={cn(
                    `text-2xl font-semibold`,
                    "rounded-full w-8 h-8 flex items-center justify-center",
                    isToday(current.format("DD MMM, YYYY")) ? 'bg-blue-500 text-white  mx-auto' : '',

                )}

            >
                <Paragraph>{current.format("DD")}</Paragraph>
            </div>
        </div>
    )
};

export const checkEvent = (event: EventType, hour: number) => {

    let actualTimeArr = event.time.split(" ");
    let actualTime = actualTimeArr[0];
    let timeOfDay = actualTimeArr[1];

    let providedTimeArr = generateHour(hour).split(" ");
    let providedTime = providedTimeArr[0];
    let providedTimeOfDay = providedTimeArr[1];

    if (timeOfDay === providedTimeOfDay) {
        let actualHourArr = actualTime.split(":");
        let actualHour = actualHourArr[0];
        let actualMinutes = actualHourArr[1];

        let providedHourArr = providedTime.split(":");
        let providedHour = providedHourArr[0];
        let providedMinutes = providedHourArr[1];

        if (actualHour === providedHour) return event; 

    }
}

const Hour = (
    { hour, currentWeek }:
        {
            hour: number;
            currentWeek: any
        }
) => {
    const { events } = calendarStateStore();
    const [hourEvents, setHourEvents] = React.useState<EventType[]>([]);


    React.useEffect(() => {
        let currentEvents: EventType[] = [];
        for (let i = 0; i < events.length; i++) {
            let event =  checkEvent(events[i], hour);
            if (event) currentEvents.push(event);
        }

        setHourEvents(currentEvents)
    }, [events])

    return (
        <div key={hour} className="flex border-b h-[100px]">
            <div className="border-r px-4 p-7 text-xs text-gray-500 w-[90px] h-full flex flex-col justify-center">
                {generateHour(hour)}
            </div>
            <div className="flex-1 grid grid-cols-7 -mr-1">
                {Array.from({ length: 7 }).map((_, index) => (
                    <HourGrid
                        hour={hour}
                        currentIndex={index}
                        currentWeek={currentWeek}
                        key={index}
                        events={getEventsOfBox(hourEvents, index)}
                    />
                ))}
            </div>
        </div>
    )
};

const HourGrid = (
    { hour, currentIndex, currentWeek, events }:
        {
            hour: number;
            currentIndex: number;
            currentWeek: any;
            events: EventType[]
        }
) => {
    const { setShowEventModal, setSelectedTime, setDaySelected } = calendarStateStore();

    return (
        <div
            className="border-r px-4 p-7 cursor-pointer flex flex-col w-full"
            onClick={() => {
                let time = generateHour(hour);
                let date = currentWeek[currentIndex].format("D");
                let month = currentWeek[currentIndex].format("M");
                let year = currentWeek[currentIndex].format("YYYY");

                selectCubeTime(
                    new Date(year, month - 1, date),
                    time,
                    setSelectedTime, setDaySelected
                );
                setShowEventModal()
            }}
        >

            <Events events={events}/>
        </div>
    )
}

const getEventsOfBox = (events: EventType[], index: number) => {
    let items: EventType[] = []; 

    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        let date = event.date; 
        let day = dayjs(new Date(date)).day(); 
        if (day === index) items.push(event)
    }

    return items;
}


// nyoko ya njeri, mk, joyce, samidoh, gathee wa njeri, jn