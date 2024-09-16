"use client";

import React from "react";
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { calendarStateStore } from "@/stores/calendar";
import { getWeek } from "@/utils/month";
import { Day } from "../calendar/week";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "../ui/separator";
import { Card } from "../ui/card";
import { Paragraph } from "../ui/typography";
import AppointmentModal from "../modals/appointment-modal";
import FetchAppointments from "./fetch-appointments";

dayjs.extend(weekOfYear);

const Week = () => {
    const [currentWeek, setCurrentWeek] = React.useState<any>(getWeek()); 
    const [mounted, setMounted] = React.useState<boolean>(false);
    
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
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
        <>
            <FetchAppointments week={week} year={2024}/>
            <div className="p-3 h-full">
                <div className="flex justify-between items-center gap-2">
                    <Button
                        size="icon"
                        variant={"outline"}
                        className="rounded-full"
                    >
                        <ChevronLeft size={18}/>
                    </Button>
                    <div className="flex-1 grid grid-cols-7">
                        {
                            days.map((day, index) => (
                                <Day
                                    key={index}
                                    day={day}
                                    current={currentWeek[index]}
                                    noBorder={true}
                                />
                            ))
                        }
                    </div>
                    <Button
                        size="icon"
                        variant={"outline"}
                        className="rounded-full"

                    >
                        <ChevronRight size={18}/>
                    </Button>
                    <div />
                </div>
                <Separator />
                <div className="flex gap-2 py-3 overflow-auto h-[70vh] pb-5">
                    <Button variant={"ghost"}/>
                    <div className="flex-1 grid grid-cols-7 gap-3">
                        {
                            days.map((day: any, index) => (
                                <div className="flex flex-col items-center justify-between gap-2" key={index}>
                                    {
                                        hours.map((hour, idx) => (
                                            <React.Fragment key={idx}>
                                                {
                                                    day === "SUN" || day === "SAT" ?
                                                        <Card className="w-[90%] p-2 pl-4 shadow-none flex items-center justify-center">
                                                            <Paragraph className="">----</Paragraph>
                                                        </Card>:
                                                        <Hour hour={hour} current={currentWeek[index]}/>
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                </div>
                            ))
                        }
                    </div>
                    <Button variant={"ghost"}/>
                </div>
            </div>
        </>
    )
};

export default Week; 

const hours = [
    "08:00AM",
    "08:30AM",
    "09:00AM",
    "09:30AM",
    "10:00AM",
    "10:30AM",
    "11:00AM",
    "11:30AM",
    "1:00PM",
    "01:30PM",
    "02:00PM",
    "02:30PM",
    "03:00PM",
    "03:30PM",
    "04:00PM",
    "04:30PM",
];

const Hour = ({hour, current}: {hour: string, current: any}) => {
     const [openAppointmentModal, setOpenAppointmentModal] = React.useState<boolean>(false); 

    return (
        <>
            <AppointmentModal 
                isOpen={openAppointmentModal}
                onClose={() => setOpenAppointmentModal(false)}
                date={new Date(current.format("DD MMM YYYY"))}
                time={hour}
            />
            <Card 
                className="cursor-pointer hover:border-main-color duration-700 p-2 pl-4 w-[90%] flex items-center justify-center" 
                onClick={() => {
                    setOpenAppointmentModal(true)
                    console.log(current.format("DD MMM YYYY"), hour);
                }}
            >
                <Paragraph>{hour}</Paragraph>
            </Card>
        </>
    )
}