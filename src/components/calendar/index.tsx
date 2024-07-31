"use client"; 

import React, { useState, useContext, useEffect } from "react";
 
import { getMonth } from "@/utils/month";
import CalendarHeader from "./calendar-header";
import Sidebar from "./sidebar";
import Month from "./month";
// import GlobalContext from "./context/GlobalContext";
// import EventModal from "./event-modal";

const Calendar = () => {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  // const { monthIndex, showEventModal } = useContext(GlobalContext);

  // useEffect(() => {
  //   setCurrentMonth(getMonth(monthIndex));
  // }, [monthIndex]);

  return (
    <React.Fragment>
      {/* {showEventModal && <EventModal />} */}

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currenMonth} />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Calendar;