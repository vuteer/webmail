import React from "react";
 
import SmallCalendar from "./small-calendar";
import Labels from "./labels";
import Upcoming from "./upcoming"; 

export default function Sidebar() {
  return (
    <aside className="border border-t-0  p-5 w-full max-w-64">
       
      <SmallCalendar />
      <Labels />
      <Upcoming />
    </aside>
  );
}