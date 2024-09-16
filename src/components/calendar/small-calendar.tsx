"use client"; 

import React, { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
 
import { getMonth } from "@/utils/month";
import { calendarStateStore } from "@/stores/calendar";
import { handleSelectEvent } from "./year";

import {cn} from "@/lib/utils"

export default function SmallCalendar() {
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const {
    smallCalendarMonth,
    setSmallCalendarMonth,
    setDaySelected,
    daySelected,
    setShowEventModal,
    year
  } = calendarStateStore();

  useEffect(() => {
    setCurrentMonth(getMonth(smallCalendarMonth));
  }, [smallCalendarMonth]);


  function handlePrevMonth() {
    setSmallCalendarMonth(smallCalendarMonth - 1);
  }
  function handleNextMonth() {
    setSmallCalendarMonth(smallCalendarMonth + 1);
  }
  function getDayClass(day: any) {
  
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    const slcDay = ""; 
    // daySelected && daySelected.format(format);
    if (nowDay === currDay) {
      return "bg-blue-500 text-white";
    } else if (currDay === slcDay) {
      return "bg-blue-100 text-blue-600 font-bold";
    } else {
      return "";
    }
  }
  return (
    <div className="mt-1">
      <header className="flex items-center justify-between my-1 pl-2">
        <p className="text-gray-500 font-bold my-2">
          {dayjs(new Date(dayjs().year(), smallCalendarMonth)).format(
            "MMM YYYY"
          )}
        </p>
        <div className="flex gap-2 self-end">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft size={18}/>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight size={18}/>
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-7 grid-rows-6 gap-1 py-2">
        {currentMonth[0].map((day: any, i: number) => (
          <span key={i} className="text-sm py-1 text-center font-bold">
            {day.format("dd").charAt(0)}
          </span>
        ))}
         
        {currentMonth.map((row: any, i: number) => (
          <React.Fragment key={i}>
            {row.map((day: any, idx: any) => (
              <span
                key={idx}
                onClick={() => handleSelectEvent(day.format("D"), smallCalendarMonth, year, setDaySelected, setShowEventModal)}
                className={cn("cursor-pointer duration-700  flex items-center justify-center", `${getDayClass(day)}`, "hover:bg-secondary rounded-full")}
              >
                <span className="text-xs font-normal">{day.format("D")}</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}