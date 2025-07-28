import React from "react";
import { CalendarHeader } from "./calendar-header";

import { Calendars } from "./calendars";
import Upcoming from "./upcoming";

export default function Sidebar() {
  return (
    <aside className="border border-t-0 border-b-0 px-2 py-5 w-full max-w-[350px] overflow-auto h-[88vh]">
      <CalendarHeader />
      <Calendars />
      <Upcoming />
    </aside>
  );
}
