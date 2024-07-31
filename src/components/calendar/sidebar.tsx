import React from "react";
 
import SmallCalendar from "./small-calendar";
import Labels from "./labels";

export default function Sidebar() {
  return (
    <aside className="border p-5 w-64">
       
      <SmallCalendar />
      <Labels />
    </aside>
  );
}