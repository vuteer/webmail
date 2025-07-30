import React from "react";
import dayjs from "dayjs";

import { Paragraph } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { calendarStateStore } from "@/stores/calendar";

import { checkEvent, generateHour, isToday, selectCubeTime } from "./week";
import Events from "./events";
import { EventType } from "@/types";
import { createToast } from "@/utils/toast";
import { eventStateStore } from "@/stores/events";
import { EventSheet } from "@/components/sheets/event-sheet";

const DayContainer = () => {
  const [mounted, setMounted] = React.useState<boolean>(false);

  const {
    day,
    setDay,
    monthIndex,
    year,
    setSelectedTime,
    setDaySelected,
    setShowEventModal,
  } = calendarStateStore();
  const [currentDay, setCurrentDay] = React.useState<Date>(new Date());
  const [showEventSheet, setShowEventSheet] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | null>(
    null,
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!mounted) return;
    setDay(dayjs().date());
  }, [mounted]);

  React.useEffect(() => {
    setCurrentDay(new Date(year, monthIndex, day));
  }, [day]);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const isPastTime = (
    hour: number,
    year: number,
    monthIndex: number,
    day: number,
  ) => {
    let time = generateHour(hour);
    let datetimeString = `${year}-${(monthIndex + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${time}`;
    const past = dayjs(datetimeString, "YYYY-MM-DD h:mm A").isBefore(dayjs());
    return past;
  };
  return (
    <>
      <EventSheet
        open={showEventSheet}
        onClose={() => {
          setShowEventSheet(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />

      <div className="w-full p-4">
        <div className="flex">
          <div className="w-[89px]" />

          <div
            className={cn(
              "text-center flex flex-col items-center border-l pb-2 px-5",
            )}
          >
            <div className=" text-gray-500 mb-1">
              <Paragraph>
                {
                  days[
                    dayjs(
                      new Date(year, monthIndex, currentDay.getDate()),
                    ).day() || 0
                  ]
                }
              </Paragraph>
            </div>
            <div
              className={cn(
                `text-2xl font-semibold rounded-full w-8 h-8 flex items-center justify-center mx-auto`,
                isToday(
                  dayjs(
                    new Date(year, monthIndex, currentDay.getDate()),
                  ).format("DD MMM, YYYY"),
                )
                  ? "bg-blue-500 text-white"
                  : "border",
              )}
            >
              <Paragraph>{currentDay.getDate()}</Paragraph>
            </div>
          </div>
        </div>
        <div className="border-t overflow-auto h-[80vh] pb-8">
          {hours.map((hour) => (
            <div key={hour} className="flex border-b h-[100px]">
              <div
                className={cn(
                  "border-r px-4 p-7 text-xs text-gray-500 w-[90px] h-full flex flex-col justify-center",
                  isPastTime(hour, year, monthIndex, day)
                    ? "bg-secondary/80 "
                    : "",
                )}
              >
                {generateHour(hour)}
              </div>
              <div
                className={cn(
                  "flex-1 grid grid-cols-1 -mr-1 cursor-pointer py-2 px-4",
                  isPastTime(hour, year, monthIndex, day)
                    ? "bg-secondary/80 "
                    : "",
                )}
                onClick={() => {
                  let isPast = isPastTime(hour, year, monthIndex, day);

                  if (isPast) {
                    createToast(
                      "Schedule Error",
                      "Events can only be scheduled in the future!",
                      "danger",
                    );
                    return;
                  }
                  selectCubeTime(
                    new Date(year, monthIndex, day),
                    generateHour(hour),
                    setSelectedTime,
                    setDaySelected,
                  );
                  if (!showEventSheet) setShowEventSheet(true);
                }}
              >
                <HourEvents
                  hour={hour}
                  currentDay={currentDay}
                  setSelectedEvent={setSelectedEvent}
                  setShowSheet={setShowEventSheet}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DayContainer;

const HourEvents = ({
  hour,
  currentDay,
  setShowSheet,
  setSelectedEvent,
}: {
  hour: number;
  currentDay: Date;
  setShowSheet: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventType | null>>;
}) => {
  const [hourEvents, setHourEvents] = React.useState<EventType[]>([]);
  const { events } = eventStateStore();

  React.useEffect(() => {
    let currentEvents = [];
    setHourEvents([]);
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let date = event.startDate;

      if (
        dayjs(date).format("DD MMM, YYYY") ===
        dayjs(new Date(currentDay)).format("DD MMM, YYYY")
      ) {
        let checkedEvent = checkEvent(event, hour);
        if (checkedEvent) currentEvents.push(checkedEvent);
      }
    }
    setHourEvents(currentEvents);
  }, [events, currentDay]);

  return (
    <Events
      events={hourEvents}
      setSelectedEvent={setSelectedEvent}
      setOpenEventSheet={setShowSheet}
    />
  );
};
