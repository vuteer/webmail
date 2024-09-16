import React from "react";

import { Separator } from "@/components/ui/separator"; 
import { Heading3 } from "@/components/ui/typography"; 

import {cn} from "@/lib/utils"; 

export default function Labels() {

  return (
    <React.Fragment>
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">Upcoming events</Heading3>
      <Separator />
      
    </React.Fragment>
  );
};

