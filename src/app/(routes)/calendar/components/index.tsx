"use client";

import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

import { useCustomEffect } from "@/hooks";
import useMounted from "@/hooks/useMounted";
import { Button } from "../ui/button";

const events = [{ title: "Meeting", start: new Date() }];

export const Calendar = () => {
  const [events, setEvents] = React.useState([]);
  const mounted = useMounted();

  const fetchEvents = async () => {
    if (!mounted) return;
    // const res = await getCalendar();
    // console.log(res);
    // setEvents(res || []);
  };

  const handleDateClick = (info: any) => {
    alert(`Clicked on date: ${info.dateStr}`);
    // You can open a modal or insert a new event here
  };

  const handleEventClick = (info: any) => {
    alert(`Event: ${info.event.title}`);
    // You could open edit modal here
  };

  const handleEventDrop = (info: any) => {
    alert(`Moved: ${info.event.title} to ${info.event.startStr}`);
    // Call backend API to update event timing
  };

  const handleEventResize = (info: any) => {
    alert(`Resized: ${info.event.title} to end ${info.event.endStr}`);
    // Call backend API to update event duration
  };

  useCustomEffect(fetchEvents, [mounted]);

  return (
    <div className="h-full p-4 bg-white dark:bg-zinc-900 rounded-xl shadow">
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold"></h1>
        <Button onClick={fetchEvents}>🔄 Refresh</Button>
      </div> */}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          right: "prev,next today",
          center: "title",
          left: "dayGridMonth,timeGridWeek,dayGridDay,listMonth",
        }}
        height="85vh"
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
      />
    </div>
  );
};
