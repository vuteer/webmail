import { Calendar, ChevronLeft, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heading3, Paragraph } from "@/components/ui/typography";
import React from "react";

type EventType = {
  id: string;
  summary: string;
  description: string;
  location: string;
  startDate: string; // ISO string
};

interface EventModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: EventType[];
  setSelected: any;
  openSheet: () => void;
}

export function EventModal({
  open,
  onOpenChange,
  events,
  setSelected,
  openSheet,
}: EventModalProps) {
  const [highlightedEvent, setHighlightedEvent] =
    React.useState<EventType | null>(null);
  const single = events.length === 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {single || highlightedEvent ? "Event Details" : "Day Events"}
          </DialogTitle>
        </DialogHeader>

        {!single && !highlightedEvent && (
          <div className="space-y-4">
            <ul className="space-y-2">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="border rounded-md p-3 hover:bg-muted cursor-pointer transition"
                  onClick={() => setHighlightedEvent(event)}
                >
                  <Paragraph className="font-medium">{event.summary}</Paragraph>
                  <span className="text-xs lg:text-sm text-muted-foreground line-clamp-2">
                    {event.description || "No description provided"}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              variant={"secondary"}
              onClick={openSheet}
            >
              Add Event
            </Button>
          </div>
        )}

        {(single || highlightedEvent) && (
          <div className="space-y-4">
            {events.length > 1 ? (
              <Button
                variant="outline"
                className="space-x-3"
                size="sm"
                onClick={() => setHighlightedEvent(null)}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </Button>
            ) : null}
            <Heading3 className="text-lg font-semibold">
              {highlightedEvent?.summary || events[0].summary}
            </Heading3>

            <p className="text-sm text-muted-foreground">
              {highlightedEvent?.description || events[0].description}
            </p>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-1" />
              <span>{highlightedEvent?.location || events[0].location}</span>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mt-1" />
              <span>
                {new Date(
                  highlightedEvent?.startDate || events[0].startDate,
                ).toLocaleString()}
              </span>
            </div>

            <div className="pt-4 flex w-full gap-2 items-center">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => {
                  setSelected(highlightedEvent || events[0]);
                  openSheet();
                }}
              >
                Edit
              </Button>
              {events.length === 1 ? (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={openSheet}
                >
                  Add Event
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
