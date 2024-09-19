import React from "react";
 
import SmallCalendar from "./small-calendar";
import Labels from "./labels";
import Upcoming from "./upcoming"; 

export default function Sidebar() {
  return (
    <aside className="border border-t-0 px-2 py-5 w-full max-w-64 overflow-auto h-[85vh]">
       
      <SmallCalendar />
      <Labels />
      <Upcoming />
    </aside>
  );
}