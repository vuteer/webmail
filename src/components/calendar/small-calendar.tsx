import React, { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
// import GlobalContext from "../context/GlobalContext";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { getMonth } from "@/utils/month";

export default function SmallCalendar() {
  const [currentMonthIdx, setCurrentMonthIdx] = useState(
    dayjs().month()
  );
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIdx));
  }, [currentMonthIdx]);

//   const {
//     monthIndex,
//     setSmallCalendarMonth,
//     setDaySelected,
//     daySelected,
//   } = useContext(GlobalContext);

//   useEffect(() => {
//     setCurrentMonthIdx(monthIndex);
//   }, [monthIndex]);

  function handlePrevMonth() {
    setCurrentMonthIdx(currentMonthIdx - 1);
  }
  function handleNextMonth() {
    setCurrentMonthIdx(currentMonthIdx + 1);
  }
  function getDayClass(day: any) {
  
    const format = "DD-MM-YY";
    const nowDay = dayjs().format(format);
    const currDay = day.format(format);
    // const slcDay = daySelected && daySelected.format(format);
    // if (nowDay === currDay) {
    //   return "bg-blue-500 rounded-full text-white";
    // } else if (currDay === slcDay) {
    //   return "bg-blue-100 rounded-full text-blue-600 font-bold";
    // } else {
    //   return "";
    // }
  }
  return (
    <div className="mt-1">
      <header className="flex items-center justify-between my-1">
        <p className="text-gray-500 font-bold my-2">
          {dayjs(new Date(dayjs().year(), currentMonthIdx)).format(
            "MMMM YYYY"
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
      <Card className="grid grid-cols-7 grid-rows-6 gap-1 p-2">
        {currentMonth[0].map((day: any, i: number) => (
          <span key={i} className="text-sm py-1 text-center font-bold">
            {day.format("dd").charAt(0)}
          </span>
        ))}
         
        {currentMonth.map((row: any, i: number) => (
          <React.Fragment key={i}>
            {row.map((day: any, idx: any) => (
              <Button
                key={idx}
                // onClick={() => {
                //   setSmallCalendarMonth(currentMonthIdx);
                //   setDaySelected(day);
                // }}
                variant={"ghost"}
                size="sm"
                className={` ${getDayClass(day)}`}
              >
                <span className="text-xs font-normal">{day.format("D")}</span>
              </Button>
            ))}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
}