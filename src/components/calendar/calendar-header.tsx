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

  const { year, monthIndex, setMonthIndex, setYear, setShowEventModal } = calendarStateStore(); 

  const searchParams = useSearch(); 
  const cal = searchParams?.get("cal") || "month"; 

  function handlePrev() {
    if (cal === "month") setMonthIndex(monthIndex - 1);
    if (cal === "year") setYear(year - 1)
  }
  function handleNext() {
    if (cal === "month") setMonthIndex(monthIndex + 1);
    if (cal === "year") setYear(year + 1)
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