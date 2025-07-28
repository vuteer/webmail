import React, { useContext } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading2 } from "@/components/ui/typography";
import CalendarPopover from "@/components/popovers/calendar-select";
import { calendarStateStore } from "@/stores/calendar";
import { useSearch } from "@/hooks";

export function CalendarHeader() {
  const [mounted, setMounted] = React.useState<boolean>(false);
  const [weekMonth, setWeekMonth] = React.useState<number>(0);
  const [weekYear, setWeekYear] = React.useState<number>(
    new Date().getFullYear(),
  );

  const {
    day,
    week,
    year,
    monthIndex,
    setDay,
    setWeek,
    setMonthIndex,
    setYear,
    setShowEventModal,
  } = calendarStateStore();

  const searchParams = useSearch();
  const cal = searchParams?.get("cal") || "week";

  const getMonthWeek = (week: number, currentYear: number) => {
    const startOfYear = dayjs(`${currentYear}-01-01`);

    // Get the start of the week for the given week number
    const weekStart = startOfYear.week(week).startOf("week");

    // Extract the month (0-based, so January is 0, February is 1, etc.)
    const month = weekStart.month();

    // Check the year of the week start date
    const weekYear = weekStart.year();

    // Determine if the week is in the next year
    const year =
      weekYear !== currentYear
        ? weekYear < currentYear
          ? currentYear - 1
          : currentYear + 1
        : currentYear;
    return { month, year };
  };
  getMonthWeek(week, year);

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    if (!mounted || cal !== "week") return;
    let month = getMonthWeek(week, year);
    setWeekMonth(month.month);
    setWeekYear(month.year);
  }, [mounted, week]);

  function handlePrev() {
    if (cal === "month") setMonthIndex(monthIndex - 1);
    if (cal === "year") setYear(year - 1);
    if (cal === "week") {
      let newWeek = week - 1;

      if (newWeek > 0) setWeek(week - 1);
      else {
        // get the last week of the year
        const endOfYear = dayjs(`${weekYear}-12-31`);
        const lastWeekNumber = endOfYear.week();
        setWeek(lastWeekNumber);
      }
    }
    if (cal === "day") setDay(day - 1);
  }
  function handleNext() {
    if (cal === "month") setMonthIndex(monthIndex + 1);
    if (cal === "year") setYear(year + 1);
    if (cal === "week") {
      // check to see if it is the last week
      // get the last week of the year
      const endOfYear = dayjs(new Date(weekYear, 11, 23));
      // const startOfYear = dayjs(new Date(week))
      const lastWeekNumber = endOfYear.week();

      let newWeek = week + 1;
      console.log(
        endOfYear.format("DD MMM YYYY"),
        lastWeekNumber,
        newWeek,
        weekYear,
      );
      if (newWeek === lastWeekNumber) {
        // get start of year
        const startOfYear = dayjs(`${weekYear}-01-01`);
        // Calculate the week number of the first day
        const firstWeekNumber = startOfYear.week();
        setWeek(firstWeekNumber);
      } else setWeek(newWeek);
    }
    if (cal === "day") setDay(day + 1);
    // setMonthIndex(monthIndex + 1);
  }
  function handleReset() {
    if (cal === "month") {
      setMonthIndex(
        monthIndex === dayjs().month()
          ? monthIndex + Math.random()
          : dayjs().month(),
      );
    }
    if (cal === "year") setYear(new Date().getFullYear());
    if (cal === "week") setWeek(dayjs().week());
    if (cal === "day") setDay(dayjs().date());
  }

  return (
    <>
      <div className="py-1 w-full flex flex-col justify-between items-center gap-2">
        <div className="flex items-center justify-between w-full">
          <Button variant="ghost" size="icon" onClick={handlePrev}>
            <ChevronLeft size={18} />
          </Button>

          <Heading2 className=" text-xs lg:text-md text-gray-500 font-bold">
            {cal === "month" &&
              dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
            {cal === "year" && year}

            {cal === "week" && (
              <>
                Week {week} -{" "}
                {dayjs(new Date(weekYear, weekMonth)).format("MMM, YYYY")}
              </>
            )}
            {/*  */}
            {cal === "day" &&
              dayjs(new Date(year, monthIndex, day)).format("DD MMM, YYYY")}
          </Heading2>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <ChevronRight size={18} />
          </Button>
        </div>
        <div className="w-full flex items-center justify-between gap-2 ">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setShowEventModal()}
              className="min-w-[100px] rounded-full flex gap-2 items-center "
            >
              <Plus size={18} />
              <span className=""> Event</span>
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="min-w-[100px] rounded-full"
            >
              Today
            </Button>
          </div>
          <CalendarPopover />
        </div>
      </div>
      <Separator className="my-3" />
    </>
  );
}
