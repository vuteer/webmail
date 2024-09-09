import { Separator } from "@/components/ui/separator"; 

import React, { useContext } from "react";

export default function Labels() {

  return (
    <React.Fragment>
      <p className="text-gray-500 font-bold mt-4 mb-2">Upcoming events</p>
      <Separator />
      
    </React.Fragment>
  );
}