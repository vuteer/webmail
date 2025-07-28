import React from "react";

import Day from "./day";

export default function Month({ month }: { month: any }) {
  return (
    <div className="h-[98%] flex-1 grid grid-cols-7 grid-rows-5">
      {month.map((row: any, i: any) => (
        <React.Fragment key={i}>
          {row.map((day: any, idx: any) => (
            <Day day={day} key={idx} rowIdx={i} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
