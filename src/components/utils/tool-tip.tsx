// tool tip
"use client";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const TooltipComponent = ({
  children,
  text,
}: {
  children: React.ReactNode;
  text: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <span className="text-sm">{text}</span>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
 

export default TooltipComponent;
