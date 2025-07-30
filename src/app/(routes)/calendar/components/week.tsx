import React from "react";
import dayjs, { Dayjs } from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

import { getWeek } from "@/utils/month";
import { Paragraph } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { calendarStateStore } from "@/stores/calendar";
import { EventType } from "@/types";
import Events from "./events";
import { createToast } from "@/utils/toast";
import { eventStateStore } from "@/stores/events";
import { EventSheet } from "@/components/sheets/event-sheet";

dayjs.extend(weekOfYear);

export const isToday = (date: any) =>
  dayjs(new Date()).format("DD MMM, YYYY") === date;

export const selectCubeTime = (
  day: Date | undefined,
  time: string,
  setSelectedTime: any,
  setDaySelected: any,
) => {
  setSelectedTime(time);
  setDaySelected(day);
};
const Week = () => {
  const [currentWeek, setCurrentWeek] = React.useState<any>(getWeek());
  const [mounted, setMounted] = React.useState<boolean>(false);

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const { week, setWeek } = calendarStateStore();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!mounted) return;
    setWeek(dayjs().week());
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;
    setCurrentWeek(getWeek(week));
  }, [week, mounted]);

  return (
    <div className="w-full p-4">
      <div className="flex">
        <div className="w-[89px]" />
        <div className="flex-1 grid grid-cols-7">
          {days.map((day, index) => (
            <Day key={index} day={day} current={currentWeek[index]} />
          ))}
        </div>
      </div>
      <div className="border-t overflow-auto h-[80vh] pb-8">
        {hours.map((hour) => (
          <Hour key={hour} currentWeek={currentWeek} hour={hour} />
        ))}
      </div>
    </div>
  );
};

export default Week;

export const generateHour = (hour: number) =>
  hour === 0
    ? "12:00 AM"
    : hour < 12
      ? `${hour}:00 AM`
      : hour === 12
        ? "12:00 PM"
        : `${hour - 12}:00 PM`;

export const Day = ({
  day,
  current,
  noBorder,
}: {
  day: string;
  current: any;
  noBorder?: boolean;
}) => {
  // Check if the appointment time has passed
  const isPast = current.isBefore(dayjs());
  return (
    <div
      className={cn(
        "text-center flex flex-col items-center  pb-2",
        noBorder ? "" : "border-l",
        isPast ? "opacity-50 cursor-not-allowed" : "",
      )}
    >
      <div className=" text-gray-500 mb-1">
        <Paragraph>{day}</Paragraph>
      </div>
      <div
        className={cn(
          `text-2xl font-semibold`,
          "rounded-full w-8 h-8 flex items-center justify-center",
          isToday(current.format("DD MMM, YYYY"))
            ? "bg-blue-500 text-white  mx-auto"
            : "",
        )}
      >
        <Paragraph>{current.format("DD")}</Paragraph>
      </div>
    </div>
  );
};

export const checkEvent = (event: EventType, hour: number) => {
  const eventHour = Number(dayjs(event.startDate).format("HH"));
  if (eventHour === hour) return event;
  return false;
};

const Hour = ({ hour, currentWeek }: { hour: number; currentWeek: any }) => {
  const { events } = eventStateStore();
  const [hourEvents, setHourEvents] = React.useState<EventType[]>([]);

  React.useEffect(() => {
    const updatedCurr = currentWeek.map((curr: Dayjs) =>
      curr.format("MM-DD-YYYY"),
    );
    let currentEvents: EventType[] = [];
    for (let i = 0; i < events.length; i++) {
      const curr = events[i];
      const eventDate = dayjs(curr.startDate).format("MM-DD-YYYY");
      if (updatedCurr.includes(eventDate)) {
        let event = checkEvent(curr, hour);
        if (event) currentEvents.push(event);
      }
    }
    setHourEvents(currentEvents);
  }, [events, currentWeek]);

  return (
    <div key={hour} className="flex border-b h-[100px]">
      <div className="border-r px-4 p-7 text-xs text-gray-500 w-[90px] h-full flex flex-col justify-center">
        {generateHour(hour)}
      </div>
      <div className="flex-1 grid grid-cols-7 -mr-1">
        {Array.from({ length: 7 }).map((_, index) => (
          <HourGrid
            hour={hour}
            currentIndex={index}
            currentWeek={currentWeek}
            key={index}
            events={getEventsOfBox(hourEvents, index)}
          />
        ))}
      </div>
    </div>
  );
};

const HourGrid = ({
  hour,
  currentIndex,
  currentWeek,
  events,
}: {
  hour: number;
  currentIndex: number;
  currentWeek: any;
  events: EventType[];
}) => {
  const { setSelectedTime, setDaySelected } = calendarStateStore();
  const [showEventSheet, setShowEventSheet] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<EventType | null>(
    null,
  );

  let time = generateHour(hour);
  let date = currentWeek[currentIndex].format("D");
  let month = currentWeek[currentIndex].format("M");
  let year = currentWeek[currentIndex].format("YYYY");

  let datetimeString = `${year}-${month.padStart(2, "0")}-${date.padStart(2, "0")} ${time}`;

  let isPast = dayjs(datetimeString, "YYYY-MM-DD h:mm A").isBefore(dayjs());

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

      <div
        className={cn(
          "border-r px-1 py-2  flex flex-col items-start w-full",
          isPast ? "bg-secondary/80 cursor-not-allowed" : "cursor-pointer",
        )}
        onClick={() => {
          if (isPast) {
            createToast(
              "Schedule Error",
              "Event can only be set in the future!",
              "danger",
            );
            return;
          }

          selectCubeTime(
            new Date(year, month - 1, date),
            time,
            setSelectedTime,
            setDaySelected,
          );
          if (!showEventSheet) setShowEventSheet(true);
        }}
      >
        <Events
          events={events}
          setSelectedEvent={setSelectedEvent}
          setOpenEventSheet={setShowEventSheet}
        />
      </div>
    </>
  );
};

const getEventsOfBox = (events: EventType[], index: number) => {
  let items: EventType[] = [];

  for (let i = 0; i < events.length; i++) {
    let event = events[i];
    let date = event.startDate;

    let day = dayjs(date).day();

    if (day === index) items.push(event);
  }

  return items;
};

// nyoko ya njeri, mk, joyce, samidoh, gathee wa njeri, jn
