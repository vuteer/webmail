import React from "react";
 
import SmallCalendar from "./small-calendar";
import Labels from "./labels";

export default function Sidebar() {
  return (
    <aside className="border border-t-0  p-5 w-full max-w-64">
       
      <SmallCalendar />
      <Labels />
    </aside>
  );
}