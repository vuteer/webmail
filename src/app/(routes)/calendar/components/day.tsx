import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { calendarStateStore } from "@/stores/calendar";
import { EventType } from "@/types";
// import { Paragraph } from "../ui/typography";
import Events from "./events";
import { cn } from "@/lib/utils";
import { createToast } from "@/utils/toast";
import { eventStateStore } from "@/stores/events";
import { EventSheet } from "@/components/sheets/event-sheet";

export default function Day({ day, rowIdx }: { day: any; rowIdx: any }) {
  const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  const [showEventSheet, setShowEventSheet] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const { setDaySelected } = calendarStateStore();
  const { events } = eventStateStore();
  useEffect(() => {
    const evnts: EventType[] = events.filter((event: EventType) => {
      const startDate = dayjs(event.startDate).format("DD-MM-YY");
      // const endDate = dayjs(new Date(event.endDate * 1000)).format("DD-MM-YY");
      const currentDay = day.format("DD-MM-YY");
      return startDate === currentDay;
    });

    setDayEvents(evnts);
  }, [day, events]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  // Check if the appointment time has passed
  const isPast = day.isBefore(dayjs());

  return (
    <>
      <EventSheet
        event={selectedEvent}
        open={showEventSheet}
        onClose={() => {
          setShowEventSheet(false);
          setSelectedEvent(null);
        }}
      />

      <div
        className={cn(
          "border-[0.05rem] flex flex-col items-center w-full pt-3",
          isPast
            ? "bg-secondary/40 cursor-not-allowed opacity-50"
            : "cursor-pointer",
        )}
        onClick={(e) => {
          e.stopPropagation();
          if (isPast) {
            createToast(
              "Schedule Error",
              "You cannot schedule an event that is in the past!",
              "danger",
            );
            return;
          }
          setDaySelected(undefined);

          // setDaySelected(new Date(year, monthIndex, day.date()));
          setDaySelected(new Date(day.format("YYYY-MM-DD")));
          if (!showEventSheet) setShowEventSheet(true);
        }}
      >
        <div className=" flex flex-col items-center">
          {rowIdx === 0 && (
            <p className={cn("text-sm mt-1 font-bold ")}>
              {day.format("ddd").toUpperCase()}
            </p>
          )}
          {/* <Separator className="w-full my-3" /> */}
          <p
            className={`text-xs p-1 my-1 text-center  ${getCurrentDayClass()}`}
          >
            {day.format("DD")}
          </p>
          <Events
            events={dayEvents}
            setOpenEventSheet={setShowEventSheet}
            setSelectedEvent={setSelectedEvent}
          />
        </div>
      </div>
    </>
  );
}
