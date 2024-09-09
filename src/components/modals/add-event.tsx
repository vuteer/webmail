// add event modal 

import React from "react";
import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import FormTitle from "../forms/components/form-title";
import SmallCalendar from "../calendar/small-calendar";
import { Separator } from "../ui/separator";
import { Paragraph } from "../ui/typography";
import { ChevronDown } from "lucide-react";
import { Checkbox } from "../ui/checkbox";


interface AddEventProps {
    isOpen: boolean; 
    onClose: () => void; 
};


const AddEvent: React.FC<AddEventProps> = ({
    isOpen, onClose
}) => {
    const [title, setTitle] = React.useState<string>("");
    const [date, setDate] = React.useState<Date>();
    const [group, setGroup] = React.useState<boolean>(false);
    const [list, setList] = React.useState<string>("");
    const [loading, setLoading] = React.useState<boolean>(false);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
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
            <div className="px-1 py-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-secondary">
                <Paragraph>Select date</Paragraph>
                <ChevronDown size={19}/>
            </div>
            <Separator />
            <FormTitle title="Actual time of event"/>
            <div className="px-1 py-2 rounded-lg flex justify-between items-center cursor-pointer hover:bg-secondary">
                <Paragraph className="text-xs lg:text-xs">Select time</Paragraph>
                <ChevronDown size={19}/>
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

            <div className="flex justify-end my-2">
                <Button>
                    Create Event
                </Button>
            </div>

        </Modal>
    )
};

export default AddEvent; 