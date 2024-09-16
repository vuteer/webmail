// appointment modal 
import React from "react"; 
import { AppointmentType, WithType } from "@/types";
import { Modal } from "./modal";
import Badge from "../utils/badge";
import AppInput from "../common/app-input";
import FormTitle from "../forms/components/form-title";
import CalendarPopover from "../popovers/calendar-popover";
import { Paragraph } from "../ui/typography";
import { Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";
import AppCheckbox from "../common/app-checkbox";
import { Button } from "../ui/button";

interface AppointmentModalProps {
    isOpen: boolean; 
    onClose: () => void; 
    date?: Date; 
    time?: string; 
    appointment?: AppointmentType; 
};

const AppointmentModal: React.FC<AppointmentModalProps> = (
    {isOpen, onClose, appointment, date, time}
) => {
    const [loading, setLoading] = React.useState<boolean>(false);
    const [title, setTitle] = React.useState<string>(appointment?.title || "");
    const [selectedTime, setSelectedTime] = React.useState<string>(appointment?.time || time || "");
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(appointment?.date || date || undefined)
    const [selectedWith, setSelectedWith] = React.useState<WithType[]>(appointment?.with || []); 
    const [googleOrZoom, setGoogleOrZoom] = React.useState<"google" | "zoom" | undefined>();
    const [onlineURL, setOnlineURL] = React.useState<string>(appointment?.google_meet || appointment?.zoom_url || "");
    const [onlinePassword, setOnlinePassword] = React.useState<string>(appointment?.google_meet_password || appointment?.zoom_password || ""); 


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Appointment overview"
            description="You can create or edit an appointment from here."
            height="h-fit"
        >
            {
                appointment && (
                    <Badge 
                        type={appointment.status === "active" ? "primary": "danger"}
                        text={appointment.status}
                    />
                )
            }

            <AppInput 
                value={title}
                setValue={setTitle}
                label="Appointment subject"
            />
            <FormTitle title="Day of appointment"/>
            <CalendarPopover 
                trigger={
                    <div className="px-1 py-2 rounded-lg flex w-full justify-between items-center cursor-pointer hover:bg-secondary">
                        <Paragraph>{date ? dayjs(date).format("DD MMM, YYYY"): "Select date"}</Paragraph>
                        <Calendar size={19}/>
                    </div>
                }
                triggerClassName="w-full"
                date={selectedDate}
                setDate={setSelectedDate}
            />
            <FormTitle title="Actual time of event"/>
             
            <AppInput 
                value={selectedTime}
                setValue={setSelectedTime}
                placeholder={"8:00AM"}
                icon={<Clock size={18}/>}
                containerClassName="w-full"
                cls="py-0 pb-1 px-1"
            />
             
            <FormTitle title="Online meeting?"/>
            <div className="flex flex-col gap-2">
                {
                    googleOrZoom && (
                        <AppCheckbox 
                            checked={typeof googleOrZoom === "string"}
                            onCheck={() => setGoogleOrZoom(undefined)}
                            text="Not an online meeting"
                        />
                    )
                }
                <div className="flex gap-2 w-full">
                    <AppCheckbox 
                        checked={googleOrZoom === "google"}
                        onCheck={() => setGoogleOrZoom("google")}
                        text="Google meet"
                    />
                    <AppCheckbox 
                        checked={googleOrZoom === "zoom"}
                        onCheck={() => setGoogleOrZoom("zoom")}
                        text="Zoom meeting"
                    />
                </div>
                {
                    googleOrZoom && (
                        <div className="w-full flex gap-2">
                            <div className="flex-1">
                                <AppInput 
                                    value={onlineURL}
                                    setValue={setOnlineURL}
                                    label={`${capitalize(googleOrZoom)} URL`}
                                    placeholder={"Paste URL"}

                                />
                            </div>
                            <div className="flex-1">
                                <AppInput 
                                    placeholder={"Paste password"}
                                    value={onlinePassword}
                                    setValue={setOnlinePassword}
                                    label={`${capitalize(googleOrZoom)} Password`}
                                />
                            </div>
                        </div>
                    )
                }


            </div>

            <div className="flex justify-end gap-2 my-3">
                <Button className="min-w-[130px]">
                    {appointment ? "Updat": "Creat"}{loading ? "ing...": "e"}
                </Button>
                {
                    appointment && (
                        <Button variant="destructive" className="min-w-[130px]">
                            Cancel{loading ? "ing...": ""}
                        </Button>
                    )
                }
            </div>
        </Modal>
    )
};

export default AppointmentModal; 



  
// with??,  

const capitalize = (value: string) => (
    `${value.charAt(0).toUpperCase()}${value.slice(1,)}`
)
