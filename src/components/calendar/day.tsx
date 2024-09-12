import dayjs from "dayjs";
import React, { useContext, useState, useEffect } from "react";
import { calendarStateStore } from "@/stores/calendar";


export default function Day({ day, rowIdx }: {day: any, rowIdx: any}) {
  const [dayEvents, setDayEvents] = useState([]);
  const {
    setDaySelected,
    setShowEventModal,
    monthIndex, 
    year
  } = calendarStateStore();

  

//   useEffect(() => {
//     const events = filteredEvents.filter(
//       (evt) =>
//         dayjs(evt.day).format("DD-MM-YY") === day.format("DD-MM-YY")
//     );
//     setDayEvents(events);
//   }, [filteredEvents, day]);

  function getCurrentDayClass() {
    return day.format("DD-MM-YY") === dayjs().format("DD-MM-YY")
      ? "bg-blue-600 text-white rounded-full w-7"
      : "";
  }
  return (
    <div className="border-[0.05rem]  flex flex-col">
      <header className="flex flex-col items-center">
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
      </header>
      <div
        className="flex-1 cursor-pointer"
        onClick={() => {
          setDaySelected(undefined);
          setDaySelected(new Date(year, monthIndex, day.date()));
          setShowEventModal();
        }}
      >
        {dayEvents.map((evt: any, idx) => (
          <div
            key={idx}
            // onClick={() => setSelectedEvent(evt)}
            className={`bg-${evt.label}-200 p-1 mr-3 text-gray-600 text-sm rounded mb-1 truncate`}
          >
            {evt.title}
          </div>
        ))}
      </div>
    </div>
  );
}