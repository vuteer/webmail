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

// const FetchEvents = () => {
//     const [mounted, setMounted] = React.useState<boolean>(false);

//     const searchParams = useSearch();
//     const cal = searchParams?.get("cal") || "week";

//     const {
//         day,
//         week,
//         year, monthIndex, addEvents
//     } = calendarStateStore();

//     React.useEffect(() => setMounted(true), []);

//     const fetchEvents = async () => {
//         if (!mounted) return;
//         // addEvents([])
//         let query = '';
//         // if (cal === "day") query = `cal=${cal}&d=${day}&m=${monthIndex}&y=${year}`;
//         // if (cal === "week") query = `cal=${cal}&w=${week}&m=${monthIndex}&y=${year}`;
//         // if (cal === "month") query = `cal=${cal}&m=${monthIndex}&y=${year}`;
//         if (cal === "year") query = `cal=${cal}&y=${year}`;

//         if (cal === "day" || cal === "week" || cal === "month") query = `cal=month&m=${monthIndex}&y=${year}`

//         let res = await getEvents(query);
//         if (res) addEvents(res.docs)
//     }
//     // cal, day, week, year,
//     useCustomEffect(fetchEvents, [mounted, monthIndex])
//     return (
//         <></>
//     )
// };

// export default FetchEvents;
