// events container
import React from "react";
import { EventType } from "@/types";
import { Paragraph } from "@/components/ui/typography";
// import AddEvent from "@/components/modals/add-event";
// import { getBg } from "./labels";
import { cn } from "@/lib/utils";

const Events = ({ events }: { events: EventType[] }) => {
  return (
    <div className="flex-1 cursor-pointer flex flex-col gap-2 justify-end w-full h-full">
      {events.map((event: EventType, index: number) => (
        <Event event={event} key={index} />
      ))}
    </div>
  );
};

export default Events;

const Event = ({ event }: { event: EventType }) => {
  const [showEventModal, setShowEventModal] = React.useState<boolean>(false);

  return (
    <>
      {/* <AddEvent
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        event={event}
      /> */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowEventModal(true);
        }}
        className={`cursor-pointer w-full py-1`}
        // style={{
        //   backgroundColor:
        //     event.status === "cancelled" ? "tomato" : getBg(event.label || ""),
        // }}
      >
        <Paragraph
          className={cn(
            "text-xs lg:text-sm line-clamp-1 text-center font-bold",
            event?.status === "cancelled"
              ? "text-white"
              : event.label === "work" || !event.label
                ? "!text-black"
                : "text-white",
          )}
        >
          {event.title}
        </Paragraph>
      </div>
    </>
  );
};
