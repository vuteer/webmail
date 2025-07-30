"use client";

import React, { useState, useEffect } from "react";

import { getMonth } from "@/utils/month";
import Sidebar from "./sidebar";
import Month from "./month";
import Year from "./year";
import Week from "./week";
import DayContainer from "./day-container";

import { calendarStateStore } from "@/stores/calendar";
import { useSearch } from "@/hooks";
import { EventSheet } from "@/components/sheets/event-sheet";

const Calendar = () => {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal, setShowEventModal } =
    calendarStateStore();

  const searchParams = useSearch();
  const cal = searchParams?.get("cal") || "week";

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <>
      {/* <EventSheet
        open={showEventModal}
        onClose={() => {
          setShowEventModal();
        }}
      /> */}
      <div className="h-screen flex">
        <Sidebar />
        <div className="flex-1 h-full">
          {cal === "month" && <Month month={currenMonth} />}
          {cal === "year" && <Year />}
          {(cal === "week" || !cal) && <Week />}
          {cal === "day" && <DayContainer />}
        </div>
      </div>
    </>
  );
};

export default Calendar;
