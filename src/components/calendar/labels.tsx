import React from "react";
import { Card } from "@/components/ui/card"; 
import { Separator } from "@/components/ui/separator"; 
import { Heading3, Paragraph } from "@/components/ui/typography"; 

import {cn} from "@/lib/utils"; 


export default function Labels() {

  return (
    <React.Fragment>
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">Labels</Heading3>
      <Separator />
      <div className="grid grid-cols-3 gap-1 items-center justify-center py-3">
        {
            labels.map((itm, index) => (
                <Card key={index} className="py-2 flex-1 flex flex-col items-center justify-center rounded-sm cursor-pointer hover:text-main-color duration-700">
                  <div className={cn(`w-[30px] h-[30px] rounded-full`)} style={{background: itm.bg}}/>
                  <Paragraph className="text-xs lg:text-xs font-bold mt-1">{itm.title}</Paragraph>
                </Card>
            ))
        }
      </div>
    </React.Fragment>
  );
}

export const labels = [
  {
      title: "Personal",
      bg: "#FFA500"
  },
  {
      title: "Work",
      bg: "#FFFF00"
  },
  {
      title: "Family",
      bg: "#228B22"
  },
  {
    title: "Special",
    bg: "#10282C"
  },
  {
    title: "Holiday",
    bg: "#ff0000"
  },
  {
    title: "Other",
    bg: "#808080"
  }
];

export const getBg = (label: string) => labels.filter((lbl) => lbl.title.toLowerCase() === label.toLowerCase())[0]?.bg || "#FFFF00";