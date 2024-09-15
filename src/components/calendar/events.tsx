// events container
import { EventType } from "@/types";
import { Paragraph } from "../ui/typography";

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
                    <div
                        key={index}
                        // onClick={() => setSelectedEvent(evt)}
                        className={`cursor-pointer bg-main-color w-full p-1`}
                    >
                        <Paragraph className="text-xs lg:text-sm line-clamp-1 text-center text-white font-bold">{event.title}</Paragraph>
                    </div>
                ))
            }
        </div>
    )
};

export default Events; 