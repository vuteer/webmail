// yearly overview
import dayjs from "dayjs";

import { getYear } from "@/utils/month";
import React from "react"; 
 
import { cn } from "@/lib/utils";
import { calendarStateStore } from "@/stores/calendar";


const Year = () => {
    const [currentYear, setCurrentYear] = React.useState<any>(getYear()); 

    const {year} = calendarStateStore();

    React.useEffect(() => {setCurrentYear(getYear(year))}, [year])


    function getDayClass(day: any) {
  
        const format = "DD-MM-YY";
        const nowDay = dayjs().format(format);
        const currDay = day.format(format);
        const slcDay = ""; 
        // daySelected && daySelected.format(format);
        if (nowDay === currDay) {
          return "bg-blue-500 rounded-full text-white";
        } else if (currDay === slcDay) {
          return "bg-blue-100 rounded-full text-blue-600 font-bold";
        } else {
          return "";
        }
      }
    return (
        <div className="px-2 py-3 w-full grid grid-cols-5 gap-5">
            {
                currentYear.map((month: any, index: number) => (
                    <div  key={index} className="p-3">
                        <p className="px-3 text-gray-500 font-bold my-2">
                            {dayjs(new Date(year, index)).format(
                                "MMMM"
                            )}
                        </p>
                        <div className="grid grid-cols-7 grid-rows-6 gap-1">
                            {month[0].map((day: any, i: number) => (
                                <span key={i} className="text-sm py-1 text-center font-bold">
                                    {day.format("dd").charAt(0)}
                                </span>
                            ))}
                            {month.map((row: any, i: number) => (
                                <React.Fragment key={i}>
                                    {row.map((day: any, idx: any) => (
                                    <span
                                        key={idx}
                                        // onClick={() => {
                                        //   setSmallCalendarMonth(currentMonthIdx);
                                        //   setDaySelected(day);
                                        // }}
                                        // variant={"ghost"}
                                        // size="icon"
                                        className={cn("cursor-pointer duration-700  flex items-center justify-center", `${getDayClass(day)}`, "hover:bg-secondary rounded-full")}
                                    >
                                        <span className="text-xs font-normal">{day.format("D")}</span>
                                    </span>
                                ))}
                                </React.Fragment>
                            ))}

                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default Year; 