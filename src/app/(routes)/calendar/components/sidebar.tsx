import React from "react";
import { CalendarHeader } from "./calendar-header";

import { Calendars } from "./calendars";
import Upcoming from "./upcoming";

export default function Sidebar() {
  return (
    <aside className="border border-t-0 border-b-0 px-2 py-5 hidden lg:block lg:w-full max-w-none lg:max-w-[320px]  h-[88vh]">
      <CalendarHeader />
      <div className="overflow-auto h-[75vh]">
        <Calendars />
        <Upcoming />
      </div>
    </aside>
  );
}
