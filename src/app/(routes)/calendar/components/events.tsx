// events container
import React from "react";
import dayjs from "dayjs";
import { EventType } from "@/types";
import { Paragraph } from "@/components/ui/typography";

import { cn } from "@/lib/utils";

const Events = ({
  events,
  setSelectedEvent,
  setOpenEventSheet,
}: {
  events: EventType[];
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventType | null>>;
  setOpenEventSheet: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex-1 cursor-pointer flex flex-col gap-2 w-full">
      {events.map((event: EventType, index: number) => (
        <Event
          event={event}
          key={index}
          setSelectedEvent={setSelectedEvent}
          setOpenEventSheet={setOpenEventSheet}
        />
      ))}
    </div>
  );
};

export default Events;

const Event = ({
  event,
  setSelectedEvent,
  setOpenEventSheet,
}: {
  event: EventType;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventType | null>>;
  setOpenEventSheet: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // const [openEventSheet, setOpenEventSheet] = React.useState(false);
  return (
    <>
      {/* <EventSheet
        event={event}
        open={openEventSheet}
        onClose={() => {
          setOpenEventSheet(false);
          setSelectedEvent(null);
        }}
      /> */}
      <div
        className={`cursor-pointer w-full py-1 hover:text-white duration-700 hover:bg-main-color rounded-full px-2`}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedEvent(event);
          setOpenEventSheet(true);
        }}
      >
        <Paragraph
          className={cn(
            "text-xs lg:text-xs line-clamp-1 text-center font-bold gap-1 flex items-center ",
          )}
        >
          <span
            className="block w-3 h-3 rounded-full"
            style={{ backgroundColor: event.calendar.color }}
          />
          <span>{dayjs(event.startDate).format("HH:mm")}</span>
          <span className="line-clamp-1">{event.summary}</span>
        </Paragraph>
      </div>
    </>
  );
};
