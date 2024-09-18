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
import { EventType } from "@/types";


interface AddEventProps {
    isOpen: boolean; 
    onClose: () => void; 
    event?: EventType; 
};


const AddEvent: React.FC<AddEventProps> = ({
    isOpen, onClose, event
}) => {
    const [title, setTitle] = React.useState<string>(event?.title || "");
    const [group, setGroup] = React.useState<boolean>(event?.group || false);
    const [list, setList] = React.useState<string>(event?.list?.join(", ") || "");
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

        let doc: any = {
            title,
            date: daySelected,
            time: selectedTime, 
        };


        if (group) doc.list = list; 


        let res = await createEvent(doc); 

        if (res) {
            createToast("success", "Event was created successfully!");
            // add event to state
            addEvent({...doc, id: res})
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
                        <Paragraph>{(daySelected || event?.date) ? dayjs(event?.date || daySelected).format("DD MMM, YYYY"): "Select date"}</Paragraph>
                        <Calendar size={19}/>
                    </div>
                }
                triggerClassName="w-full"
                date={event?.date || daySelected}
                setDate={setDaySelected}
            />
            <Separator />
            <FormTitle title="Actual time of event"/>
            <AppInput 
                value={event?.time || selectedTime}
                setValue={setSelectedTime}
                placeholder={"8:00 AM"}
                icon={<Clock size={19}/>}
                containerClassName="w-full"
                cls="py-0 px-1"

            />
            
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