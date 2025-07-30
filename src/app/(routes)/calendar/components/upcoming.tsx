import React from "react";
import dayjs from "dayjs";

import { Separator } from "@/components/ui/separator";
import { Heading3, Heading4, Paragraph } from "@/components/ui/typography";

import { EventType } from "@/types";
import { getUpcomingEvents } from "@/lib/api-calls/events";
import { useCustomEffect } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { createArray } from "@/utils/format-numbers";
import useMounted from "@/hooks/useMounted";

export default function Labels() {
  const [currentEvents, setEvents] = React.useState<EventType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const mounted = useMounted();

  const fetchRecentEvents = async () => {
    if (!mounted) return;
    setLoading(true);
    let res = await getUpcomingEvents();

    if (res) {
      setEvents(res);
    }

    setLoading(false);
  };

  useCustomEffect(fetchRecentEvents, [mounted]);

  return (
    <React.Fragment>
      <Heading3 className="text-gray-500 font-bold mt-4 mb-2 text-sm lg:text-md">
        Upcoming events
      </Heading3>
      <Separator />
      <div className="flex flex-col gap-2 my-2">
        {loading &&
          createArray(5).map((_, index) => <EventSkeleton key={index} />)}
        {currentEvents.map((event, index) => (
          <Event event={event} key={index} />
        ))}
        {!loading && currentEvents.length === 0 ? (
          <Paragraph className="text-center my-4 text-md lg:text-base font-bold">
            No upcoming events.
          </Paragraph>
        ) : null}
        {!loading && currentEvents.length === 0 ? (
          <Card className="h-[80px] w-full flex items-center justify-center">
            <Paragraph>No upcoming events</Paragraph>
          </Card>
        ) : null}
      </div>
    </React.Fragment>
  );
}

const EventSkeleton = () => (
  <Card className="p-2 flex flex-col gap-2">
    <Skeleton className="h-4 w-4 rounded-full" />
    <Skeleton className="w-full h-[10px] rounded-full" />
    <Skeleton className="w-[40%] h-[10px] rounded-full" />
  </Card>
);

const Event = ({ event }: { event: EventType }) => {
  return (
    <Card className="p-2 flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: event.calendar.color }}
        />
        <Heading4 className="text-xs lg:text-sm font-bold line-clamp-1">
          {event.summary}
        </Heading4>
      </div>
      <Paragraph className="text-xs lg:text-xs">
        {dayjs(event.startDate).format("DD MMM, YYYY, HH:mm")}
      </Paragraph>
    </Card>
  );
};
