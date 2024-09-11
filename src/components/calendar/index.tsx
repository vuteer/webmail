"use client"; 

import React, { useState, useEffect } from "react";
 
import { getMonth, getYear } from "@/utils/month";
import CalendarHeader from "./calendar-header";
import Sidebar from "./sidebar";
import Month from "./month";
import Year from "./year"; 
import Week from "./week"; 
import DayContainer from "./day-container"; 

import { calendarStateStore } from "@/stores/calendar";
import AddEvent from "../modals/add-event";
import { useSearch } from "@/hooks"; 

type CalendarType = "day" | "week" | "month" | "year"; 

const Calendar = () => {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const {monthIndex, showEventModal, setShowEventModal} = calendarStateStore(); 

  const searchParams = useSearch(); 
  const cal = searchParams?.get("cal") || "week"; 

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  
  return (
    <>
       
      <AddEvent 
        isOpen={showEventModal}
        onClose={() => setShowEventModal()}
      />

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          {
            cal === "month" && (
                <Month month={currenMonth} />
            )
          }
          {
            cal === "year" && (
              <Year />
            )
          }
          {
            (cal === "week" || !cal) && (
              <Week />
            )
          }
          {
            cal === "day" && (
              <DayContainer />
            )
          }
        </div>
      </div>
    </>
  );
}

export default Calendar;