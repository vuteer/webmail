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
import { AppointmentType } from "@/types";
import { appointmentStateStore } from "@/stores/appointment";
import { cn } from "@/lib/utils";
import { createToast } from "@/utils/toast";

dayjs.extend(weekOfYear);

const Week = () => {
    const [currentWeek, setCurrentWeek] = React.useState<any>(getWeek());
    const [mounted, setMounted] = React.useState<boolean>(false);

    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const { week, setWeek } = calendarStateStore();
    const { appointments } = appointmentStateStore();

    React.useEffect(() => setMounted(true), []);
    React.useEffect(() => {
        if (!mounted) return;
        setWeek(dayjs().week())
    }, [mounted]);

    React.useEffect(() => {
        if (!mounted) return;
        setCurrentWeek(getWeek(week))
    }, [week, mounted])

    const getHourAppointment = (apps: AppointmentType[], current: any, hour: string) => {
        let filtered = [];

        for (let i = 0; i < apps.length; i++) {
            let app = apps[i];
            let appDate = dayjs(new Date(app.date)).format("DD MMM YYYY");
            let appTime = app.time;
            // console.log(appDate, appTime)
            if (appDate === current.format("DD MMM YYYY") && hour === appTime) {
                filtered.push(app);
                break;
            }
        }
        if (filtered.length > 0) return filtered[0];
        return undefined;
    }

    function handlePrev() {

        let newWeek = week - 1;

        if (newWeek > 0) setWeek(week - 1);
    }
    function handleNext() {

        let newWeek = week + 1;

        setWeek( newWeek);
    }

    return (
        <>
            <FetchAppointments week={week} year={2024} />
            <div className="p-3 h-full">
                <div className="flex justify-between items-center gap-2">
                    <Button
                        size="icon"
                        variant={"outline"}
                        className="rounded-full"
                        onClick={handlePrev}
                    >
                        <ChevronLeft size={18} />
                    </Button>
                    <div className="flex-1 grid grid-cols-7 ">
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
                        onClick={handleNext}
                    >
                        <ChevronRight size={18} />
                    </Button>
                    <div />
                </div>
                <Separator />
                <div className="flex gap-2 py-3 overflow-auto h-[70vh] pb-[5rem]">
                    <Button variant={"ghost"} />
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
                                                        </Card> :
                                                        <Hour
                                                            hour={hour}
                                                            current={currentWeek[index]}
                                                            appointment={getHourAppointment(appointments, currentWeek[index], hour)}
                                                        />
                                                }
                                            </React.Fragment>
                                        ))
                                    }
                                    <div className="my-5"/>
                                </div>
                            ))
                        }
                    </div>
                    <Button variant={"ghost"} />
                </div>
            </div>
        </>
    )
};

export default Week;


const hours = [
    "08:00 AM",
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
];

const Hour = ({ hour, current, appointment }: { hour: string, current: any, appointment?: AppointmentType }) => {
    const [openAppointmentModal, setOpenAppointmentModal] = React.useState<boolean>(false);

    const appointmentTime = dayjs(`${current.format("DD MMM YYYY")} ${hour}`, 'hh:mm A DD MMM YYYY');
    // Check if the appointment time has passed
    const isPast = appointmentTime.isBefore(dayjs());

    return (
        <>
            <AppointmentModal
                isOpen={openAppointmentModal}
                onClose={() => setOpenAppointmentModal(false)}
                date={new Date(current.format("DD MMM YYYY"))}
                time={hour}
                appointment={appointment}
            />
            <Card
                className={cn(
                    "cursor-pointer hover:border-main-color duration-700 p-2 pl-4 w-[90%] flex items-center justify-center", 
                    appointment ? "bg-main-color text-white border-none" : "", 
                    appointment?.status === "cancelled" ? "bg-destructive": "",
                    isPast ? "opacity-50 cursor-not-allowed": ""
                )}
                onClick={() => {
                    if (isPast) {
                        createToast("error", "Appointment cannot be booked in the past");
                        return
                    } 
                    setOpenAppointmentModal(true)
                }}
            >
                <Paragraph className="text-xs lg:text-xs">{hour}</Paragraph>
            </Card>
        </>
    )
}