import React, { useContext } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

import dayjs from "dayjs";
import { Button } from "../ui/button";
import { Heading2 } from "../ui/typography";
import CalendarPopover from "@/components/popovers/calendar-select"
import AddEvent from "../modals/add-event";

// import logo from "../assets/logo.png";
// import GlobalContext from "../context/GlobalContext";
export default function CalendarHeader() {
  const [openAddEventModal, setOpenAddEventModal] = React.useState<boolean>(false); 

//   const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  function handlePrevMonth() {
    // setMonthIndex(monthIndex - 1);
  }
  function handleNextMonth() {
    // setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    // setMonthIndex(
    //   monthIndex === dayjs().month()
    //     ? monthIndex + Math.random()
    //     : dayjs().month()
    // );
  }
  return (
    <>
      <AddEvent 
        isOpen={openAddEventModal}
        onClose={() => setOpenAddEventModal(false)}
      />
    
      <header className="px-4 py-2 flex gap-2 items-center justify-between">
        <div className="flex justify-between items-center gap-2">
          <Button
            onClick={() => setOpenAddEventModal(true)}
            className="rounded-full flex gap-2 items-center min-w-[150px]"
          >
            <Plus size={18}/>
            <span className=""> Create</span>
          </Button>
          <Button onClick={handleReset} variant="secondary" className="rounded-full min-w-[150px]">
            Today
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft size={18}/>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight size={18}/>
          </Button>
          <Heading2 className="ml-4 text-lg lg:text-xl text-gray-500 font-bold">
            {dayjs(new Date(dayjs().year(), 0)).format(
              "MMMM YYYY"
            )}
          </Heading2>

        </div>
        <div className="flex items-center gap-2">
          <Button variant={"ghost"}>
            <Search size={18}/>
          </Button>
          <CalendarPopover />
        </div>
      </header>
    </>
  );
}