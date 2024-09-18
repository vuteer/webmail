// events container
import React from "react";
import { EventType } from "@/types";
import { Paragraph } from "../ui/typography";
import AddEvent from "../modals/add-event";

const Events = ({
    events
}:
    {
        events: EventType[]
    }
) => {
    return (
        <div
            className="flex-1 cursor-pointer flex flex-col gap-2 justify-end w-full h-full p-1"
        >
            {
                events.map((event: EventType, index: number) => (
                    <Event event={event}/>
                ))
            }
        </div>
    )
};

export default Events; 

const Event = ({event}: {event: EventType}) => {
    const [showEventModal, setShowEventModal] = React.useState<boolean>(false); 
    return (
        <>
            <AddEvent 
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                event={event}
            />
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    setShowEventModal(true);
                }}
                className={`cursor-pointer bg-main-color w-full p-1`}
            >
                <Paragraph className="text-xs lg:text-sm line-clamp-1 text-center text-white font-bold">{event.title}</Paragraph>
            </div>
        </>
    )
}