import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heading3, Heading4, Paragraph } from "@/components/ui/typography";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, SquarePen } from "lucide-react";
import { getEvents } from "@/lib/api-calls/events";
import { calendarStateStore } from "@/stores/calendar";
import { Skeleton } from "@/components/ui/skeleton";

export function Calendars() {
  const { calendars, calendarLoading } = calendarStateStore();

  return (
    <div className="my-3">
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">
        Calendars ({calendars.length})
      </Heading3>
      <Separator className="my-3" />
      {!calendars.length && !calendarLoading ? (
        <Card className="my-3 h-[70px] w-full flex items-center justify-center">
          <Paragraph className="font-bold">You have no calendars</Paragraph>
        </Card>
      ) : null}
      {calendars.length && !calendarLoading ? (
        <div className="space-y-1 py-3">
          {calendars.map((itm: any, index: number) => (
            <React.Fragment key={index}>
              <div className="px-1 flex-1 flex items-center justify-between rounded-sm cursor-pointer hover:bg-secondary duration-700">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(`w-[15px] h-[15px] rounded-full`)}
                    style={{ background: itm.calendarColor }}
                  />
                  <Paragraph className="text-sm lg:text-md font-bold mt-1">
                    {itm.displayName}
                  </Paragraph>
                </div>
                <Button variant="ghost" size="sm">
                  <SquarePen size={16} />
                </Button>
              </div>
              <Separator />
            </React.Fragment>
          ))}
        </div>
      ) : null}
      {calendarLoading && (
        <div className="space-y-3 py-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="w-full flex gap-2 items-center " key={index}>
              <Skeleton className="w-[15px] h-[15px] rounded-full" />
              <Skeleton className="w-full h-[15px]" />
            </div>
          ))}
        </div>
      )}

      <Button onClick={getEvents} className="w-full " variant="secondary">
        <Plus size={18} />
        <span>Add Calendar</span>
      </Button>
    </div>
  );
}
