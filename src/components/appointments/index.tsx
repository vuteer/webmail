// appointments container 
"use client"; 
import { Clock } from "lucide-react"
import { Heading2, Paragraph } from "../ui/typography"
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import SmallCalendar from "../calendar/small-calendar";
import Week from "./week";
import { appointmentStateStore } from "@/stores/appointment";

const Appointments = () => {
    const {count} = appointmentStateStore(); 

    return (
        <Card className="py-4 px-2 min-h-[89vh] overflow-hidden">
            <div className="w-full flex items-end justify-between my-2">
                <div>
                    <Paragraph className="flex items-center gap-2 mb-2">
                        <Clock size={18}/>
                        30 min appointments
                    </Paragraph>
                    <Paragraph>Select an appointment time</Paragraph>
                </div>
                <Paragraph>(GMT+03:00) East Africa Time</Paragraph>
            </div>
            <Separator />
            <div className="flex w-full h-full my-3">
                <div className="w-[250px]">
                    <Heading2 className="text-md lg:text-base">Total appointments: {count}</Heading2>
                    <Separator className="my-3"/>
                    <SmallCalendar />
                </div>
                <div className="w-[1px] h-full bg-secondary"/>
                <div className="flex-1 h-full">
                    <Week />
                </div>
            </div>
        </Card>
    )
};

export default Appointments; 