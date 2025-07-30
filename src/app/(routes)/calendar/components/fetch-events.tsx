import React from "react";

// fetch events based on day, week, month, or year

import { useCustomEffect, useSearch } from "@/hooks";
import { getEvents } from "@/lib/api-calls/events";
import { calendarStateStore } from "@/stores/calendar";
import useMounted from "@/hooks/useMounted";
import { eventStateStore } from "@/stores/events";

export const FetchEvents = () => {
  const { setCalendars } = calendarStateStore();
  const { setEvents } = eventStateStore();
  const mounted = useMounted();

  React.useEffect(() => {
    if (!mounted) return;
    setCalendars();
    setEvents();
  }, [mounted]);

  return <></>;
};
