// yearly overview
import dayjs from "dayjs";

import { getYear } from "@/utils/month";
import React from "react";

import { cn } from "@/lib/utils";
import { calendarStateStore } from "@/stores/calendar";
import { createToast } from "@/utils/toast";
import { eventStateStore } from "@/stores/events";
import { EventModal } from "./event-modal";
import { EventSheet } from "@/components/sheets/event-sheet";

export const handleSelectEvent = (
  day: number,
  month: number,
  year: number,
  setDaySelected: any,
  // setShowEventModal: any,
) => {
  setDaySelected(new Date(year, month, day));
  // setShowEventModal();
};
function getDayClass(day: any) {
  const format = "DD-MM-YY";
  const nowDay = dayjs().format(format);
  const currDay = day.format(format);
  const slcDay = "";
  // daySelected && daySelected.format(format);
  if (nowDay === currDay) {
    return "bg-blue-500 text-white";
  } else if (currDay === slcDay) {
    return "bg-blue-100 text-blue-600 font-bold";
  } else {
    return "";
  }
}
const Year = () => {
  const [currentYear, setCurrentYear] = React.useState<any>(getYear());
  const { year, setDaySelected, setShowEventModal } = calendarStateStore();
  React.useEffect(() => {
    setCurrentYear(getYear(year));
  }, [year]);

  return (
    <div className="px-2 py-3 pb-8 w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-5 h-[80vh] overflow-auto">
      {currentYear.map((month: any, index: number) => (
        <div key={index} className="p-3">
          <p className="px-3 text-gray-500 font-bold my-2">
            {dayjs(new Date(year, index)).format("MMMM")}
          </p>
          <div className="grid grid-cols-7 grid-rows-6 gap-1 gap-y-2">
            {month[0].map((day: any, i: number) => (
              <span
                key={i}
                className="text-sm py-1  font-bold flex items-center justify-center"
              >
                {day.format("dd").charAt(0)}
              </span>
            ))}
            {month.map((row: any, i: number) => (
              <React.Fragment key={i}>
                {row.map((day: any, idx: any) => (
                  <Day day={day} index={idx} key={idx} />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Year;

const Day = ({ day, index }: { day: any; index: number }) => {
  const { monthIndex, year, setDaySelected, setShowEventModal } =
    calendarStateStore();
  const { events } = eventStateStore();
  const [dayEvents, setDayEvents] = React.useState<any[]>([]);
  const [openEventModal, setOpenEventModal] = React.useState<boolean>(false);
  const [hasEvents, setHasEvents] = React.useState<boolean>(false);
  const [openEventSheet, setOpenEventSheet] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<any>(null);

  React.useEffect(() => {
    setHasEvents(false);
    // if (dayjs(event.startDate).format("YYYY") !== year) return;

    let has = events.filter(
      (event) =>
        dayjs(event.startDate).format("DD MMM YYYY") ===
        day.format("DD MMM YYYY"),
    );

    if (has.length > 0) {
      setHasEvents(true);
      setDayEvents(has);
    }
  }, [events, year]);

  // Get the start of today
  const startOfToday = dayjs().startOf("day");

  // Check if the date is before the start of today
  const isBeforeToday = day.isBefore(startOfToday);
  return (
    <>
      <EventModal
        open={openEventModal}
        onOpenChange={(stt) => setOpenEventModal(stt)}
        events={dayEvents}
        setSelected={setSelected}
        openSheet={() => {
          handleSelectEvent(
            day.format("D"),
            day.format("M") - 1,
            year,
            setDaySelected,
            // setShowEventModal,
          );
          setOpenEventSheet(true);
        }}
      />

      <EventSheet
        open={openEventSheet}
        onClose={() => {
          setOpenEventSheet(false);
          setSelected(null);
          setOpenEventModal(false);
        }}
        event={selected}
      />

      <span
        onClick={() => {
          handleSelectEvent(
            day.format("D"),
            day.format("M") - 1,
            year,
            setDaySelected,
            // setShowEventModal,
          );
          if (hasEvents) setOpenEventModal(true);
          else setOpenEventSheet(true);
        }}
        className={cn(
          "cursor-pointer duration-700  flex items-center justify-center rounded-full",
          "hover:bg-secondary",
          hasEvents
            ? "bg-green-500 text-white hover:text-black"
            : "bg-transparent text-primary",
          `${getDayClass(day)}`,
          isBeforeToday ? "text-gray-500 cursor-not-allowed" : "",
        )}
      >
        <span className="text-xs font-normal">{day.format("D")}</span>
      </span>
    </>
  );
};
