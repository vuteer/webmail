// add event modal 

import React from "react";
import { Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";

import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import FormTitle from "../forms/components/form-title";
import { Separator } from "../ui/separator";
import { Paragraph } from "../ui/typography";
import { Checkbox } from "../ui/checkbox";

import { calendarStateStore } from "@/stores/calendar";
import CalendarPopover from "../popovers/calendar-popover";
import { createToast } from "@/utils/toast";
import { createEvent } from "@/lib/api-calls/events";


interface AddEventProps {
    isOpen: boolean; 
    onClose: () => void; 
};


const AddEvent: React.FC<AddEventProps> = ({
    isOpen, onClose
}) => {
    const [title, setTitle] = React.useState<string>("");
    const [group, setGroup] = React.useState<boolean>(false);
    const [list, setList] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);
     

    const {
        daySelected,
        setDaySelected,
        selectedTime, 
        setSelectedTime,
        addEvent
    } = calendarStateStore(); 

    const handleCreateEvent = async () => {
        if (!title) {
            createToast("error", "Provide a title for the event!");
            return; 
        }

        if (!daySelected || !selectedTime) {
            createToast("error", "Provide a date and a time for the event!");
            return; 
        };

        // validate list here
        if (group) {
            let listArr = list.trim().split(",");
            listArr = listArr.filter(lst => lst);
            if (listArr.length === 0) {
                createToast("error", "Unselect the group!");
                return 
            }
        }

        // validate time here

        setLoading(true); 

        let event: any = {
            title,
            date: daySelected,
            time: selectedTime, 
        };


        if (group) event.list = list; 


        let res = await createEvent(event); 

        if (res) {
            createToast("success", "Event was created successfully!");
            // add event to state
            addEvent({...event, id: res})
            setTitle("")
            setGroup(false);
            setList("")
            onClose(); 
        };

        setLoading(false); 
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose(); 
                setDaySelected(undefined); 
                setSelectedTime("8:00 AM"); 
            }}
            title="Add to schedule"
            description="Add an event to your schedule. You can add a group event such as an organization level event and add the people to be notified or group"
        >
            <AppInput 
                value={title}
                setValue={setTitle}
                placeholder={"Team building"}
                label="Event title"
            />
             
            <FormTitle title="Day of event"/>
                <CalendarPopover 
                    trigger={
                        <div className="px-1 py-2 rounded-lg flex w-full justify-between items-center cursor-pointer hover:bg-secondary">
                            <Paragraph>{daySelected ? dayjs(daySelected).format("DD MMM, YYYY"): "Select date"}</Paragraph>
                            <Calendar size={19}/>
                        </div>
                    }
                    triggerClassName="w-full"
                    date={daySelected}
                    setDate={setDaySelected}
                />
            <Separator />
            <FormTitle title="Actual time of event"/>
            <div className="flex justify-between items-center">
                <AppInput 
                    value={selectedTime}
                    setValue={setSelectedTime}
                    placeholder={"8:00 AM"}
                    icon={<Clock size={19}/>}
                    containerClassName="w-full"
                />
            </div>
            
            <Separator />

            <div 
                className={"flex gap-2 items-center cursor-pointer my-2"} 
                onClick={() => setGroup(!group)}
            >
                <Checkbox 
                    checked={group}
                    onCheckedChange={() => setGroup(!group)}
                />
                <FormTitle title="Group Event"/>
            </div>
            {
                group && (
                    <AppInput 
                        value={list}
                        setValue={setList}
                        placeholder={"accounts, hr@domain.com, ceo@domain.com..."}
                        label="List of people in event"
                        textarea={true}
                    />
                )
            }

            {/* <div className="flex items-center gap-2">
                <Checkbox 
                    checked={zoom}
                    onCheckedChange={() => {
                        let zoom_meet = !zoom; 

                        if (zoom_meet) setGoogleMeet(false);
                        setZoom(zoom_meet)
                    }}
                />
                <FormTitle title="Create Zoom Meeting"/>

            </div>
            <div className="flex items-center gap-2">
                <Checkbox 
                    checked={googleMeet}
                    onCheckedChange={() => {
                        let google_meet = !googleMeet; 

                        if (google_meet) setZoom(false);
                        setGoogleMeet(!googleMeet)
                    }}
                />
                <FormTitle title="Create Google Meet"/>

            </div> */}

            <div className="flex justify-end my-2">
                <Button
                    disabled={loading}
                    onClick={handleCreateEvent}
                    className="min-w-[150px]"
                >
                    Creat{loading ? "ing...": "e"}
                </Button>
            </div>

        </Modal>
    )
};

export default AddEvent; 