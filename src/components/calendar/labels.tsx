import React from "react";
import { Card } from "@/components/ui/card"; 
import { Separator } from "@/components/ui/separator"; 
import { Heading3 } from "@/components/ui/typography"; 

import {cn} from "@/lib/utils"; 


export default function Labels() {

  return (
    <React.Fragment>
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">Labels</Heading3>
      <Separator />
      <div className="grid grid-cols-4 gap-2 items-center justify-center py-3">
        {
            labels.map((itm, index) => (
                <Card key={index} className="py-2 flex-1 flex items-center justify-center">
                  <div className={cn(`w-[30px] h-[30px] rounded-full`)} style={{background: itm.bg}}/>
                </Card>
            ))
        }
      </div>
    </React.Fragment>
  );
}

const labels = [
  {
      title: "Personal",
      bg: "#9B0047"
  },
  {
      title: "Work",
      bg: "#10282C"
  },
  {
      title: "Other",
      bg: "#586d51"
  },
  {
    title: "Other",
    bg: "#586d51"
  }
]