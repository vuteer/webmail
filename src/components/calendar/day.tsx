import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { calendarStateStore } from "@/stores/calendar";
import { EventType } from "@/types";
import { Paragraph } from "../ui/typography";
import Events from "./events";
import { cn } from "@/lib/utils";
import { createToast } from "@/utils/toast";


export default function Day({ day, rowIdx }: {day: any, rowIdx: any}) {
  const [dayEvents, setDayEvents] = useState<EventType[]>([]);
  const {
    setDaySelected,
    setShowEventModal,
    monthIndex, 
    year,
    events
  } = calendarStateStore();


  useEffect(() => {
    const evnts: EventType[] = events.filter(
      (evt) =>
        dayjs(evt.date).format("DD-MM-YY") === day.format("DD-MM-YY")
    );
    setDayEvents(evnts);
  }, [events]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }

  // Check if the appointment time has passed
  const isPast = day.isBefore(dayjs());

  return (
    <div 
      className={cn("border-[0.05rem] flex flex-col items-center", isPast ? "cursor-not-allowed opacity-50": "")}
      onClick={() => {
        if (isPast) {
          createToast("error", "You cannot schedule an event that is in the past!");
          return; 
        }
        setDaySelected(undefined);
        setDaySelected(new Date(year, monthIndex, day.date()));
        setShowEventModal();
      }}
    >
      <div className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className={cn("text-sm mt-1")}>
            {day.format("ddd").toUpperCase()}
          </p>
        )}
        <p
          className={`text-xs p-1 my-1 text-center  ${getCurrentDayClass()}`}
        >
          {day.format("DD")}
        </p>
      </div>
      <Events events={dayEvents}/>
    </div>
  );
}