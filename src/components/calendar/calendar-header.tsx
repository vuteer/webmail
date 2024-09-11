import React, { useContext } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import dayjs from "dayjs";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Heading2 } from "../ui/typography";
import CalendarPopover from "@/components/popovers/calendar-select"
import { calendarStateStore } from "@/stores/calendar";
import { useSearch } from "@/hooks"; 


export default function CalendarHeader() {
  // const [openAddEventModal, setOpenAddEventModal] = React.useState<boolean>(false); 

  const { day, week, year, monthIndex, setDay, setWeek, setMonthIndex, setYear, setShowEventModal } = calendarStateStore(); 

  const searchParams = useSearch(); 
  const cal = searchParams?.get("cal") || "week"; 

  function handlePrev() {
    if (cal === "month") setMonthIndex(monthIndex - 1);
    if (cal === "year") setYear(year - 1)
    if (cal === "week") setWeek(week - 1); 
    if (cal === "day") setDay(day - 1); 
  }
  function handleNext() {
    if (cal === "month") setMonthIndex(monthIndex + 1);
    if (cal === "year") setYear(year + 1);
    if (cal === "week") setWeek(week + 1); 
    if (cal === "day") setDay(day + 1); 
    // setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    if (cal === "month") {
      setMonthIndex(
        monthIndex === dayjs().month()
          ? monthIndex + Math.random()
          : dayjs().month()
      );
    }
    if (cal === "year") setYear(new Date().getFullYear())
    if (cal === "week") setWeek(dayjs().week())
    if (cal === "day") setDay(dayjs().date())
  }
  return (
    <>
      
    
      <header className="px-4 py-2 flex gap-2 items-center justify-between">
        <div className="flex justify-between items-center gap-2">
          <Button
            onClick={() => setShowEventModal()}
            className="rounded-full flex gap-2 items-center min-w-[150px]"
          >
            <Plus size={18}/>
            <span className=""> Create</span>
          </Button>
          <Button onClick={handleReset} variant="secondary" className="rounded-full min-w-[150px]">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft size={18}/>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight size={18}/>
          </Button>
          <Heading2 className="ml-4 text-lg lg:text-xl text-gray-500 font-bold">
            {cal === "month" && dayjs(new Date(dayjs().year(), monthIndex)).format(
              "MMMM YYYY"
            )}
            {
              cal === "year" && year
            }
            {
              cal === "week" && (
                <>
                  Week {week} - {dayjs(new Date(year, monthIndex)).format("MMM, YYYY")}
                </>
              )
            }
            {
              cal === "day" && (
                dayjs(new Date(year, monthIndex, day)).format("DD MMM, YYYY")
              )
            }
          </Heading2>

        </div>
        <div className="flex items-center gap-2">
          <Button variant={"ghost"}>
            <Search size={18}/>
          </Button>
          <CalendarPopover />
        </div>
      </header>
      <Separator />
    </>
  );
}