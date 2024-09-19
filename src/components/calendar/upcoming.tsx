import React from "react";

import { Separator } from "@/components/ui/separator"; 
import { Heading3, Heading4, Paragraph } from "@/components/ui/typography"; 

import {cn} from "@/lib/utils"; 
import { EventType } from "@/types";
import { getRecentEvents } from "@/lib/api-calls/events";
import { useCustomEffect } from "@/hooks";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { createArray } from "@/utils/format-numbers";
import { getBg } from "./labels";
import dayjs from "dayjs";
import { calendarStateStore } from "@/stores/calendar";

export default function Labels() {
  const [currentEvents, setEvents] = React.useState<EventType[]>([]); 
  const [loading, setLoading] = React.useState<boolean>(true); 

  const {events} = calendarStateStore()

  const fetchRecentEvents = async () => {
    setLoading(true); 
    let res = await getRecentEvents(); 

    if (res) {
      setEvents(res); 
    };

    setLoading(false); 
  }

  useCustomEffect(fetchRecentEvents, [events]); 

  return (
    <React.Fragment>
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">Upcoming events</Heading3>
      <Separator />
      <div className="flex flex-col gap-2 my-2">
        {
          loading && (
            createArray(5).map((_, index) => <EventSkeleton key={index}/>)
          )
        }
        {
          currentEvents.map((event, index) => <Event event={event} key={index}/>)
        }
        {
          !loading && currentEvents.length === 0 && (
            <Paragraph className="text-center my-4 text-md lg:text-base font-bold">No upcoming events.</Paragraph>
          )
        }
      </div>
    </React.Fragment>
  );
};

const EventSkeleton = () => (
  <Card className="p-2 flex flex-col gap-2">
    <Skeleton className="h-4 w-4 rounded-full"/>
    <Skeleton className="w-full h-[10px] rounded-full"/>
    <Skeleton className="w-[40%] h-[10px] rounded-full"/>
  </Card>
);

const Event = ({event}: {event: EventType}) => {

  return (
    <Card className="p-2 flex flex-col gap-2">
      <div className="h-4 w-4 rounded-full" style={{backgroundColor: getBg(event.label || "")}}/>
      <Heading4 className="text-sm lg:text-md font-bold line-clamp-1">{event.title}</Heading4>
      <Paragraph className="text-xs lg:text-sm">{dayjs(new Date(event.date)).format("DD MMM, YYYY")} | {event.time}</Paragraph>
    </Card>
  )
}