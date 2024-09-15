import dayjs from "dayjs";
import React, { useState, useEffect } from "react";
import { calendarStateStore } from "@/stores/calendar";
import { EventType } from "@/types";
import { Paragraph } from "../ui/typography";
import Events from "./events";


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
  return (
    <div 
      className="border-[0.05rem] flex flex-col items-center"
      onClick={() => {
        setDaySelected(undefined);
        setDaySelected(new Date(year, monthIndex, day.date()));
        setShowEventModal();
      }}
    >
      <div className="flex flex-col items-center">
        {rowIdx === 0 && (
          <p className="text-sm mt-1">
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