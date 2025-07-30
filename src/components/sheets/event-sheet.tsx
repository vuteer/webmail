import React from "react";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Label } from "../ui/label";
import AppInput from "../common/app-input";
import { Separator } from "../ui/separator";
import { EventType } from "@/types";
import { Calendar, Trash2 } from "lucide-react";
import AppCheckbox from "../common/app-checkbox";
import { Combobox, ComboboxType } from "../ui/combo-box";
import { calendarStateStore } from "@/stores/calendar";
import { Button } from "../ui/button";
import { createToast } from "@/utils/toast";
import { createEvent } from "@/lib/api-calls/events";
import { eventStateStore } from "@/stores/events";
import { Paragraph } from "../ui/typography";

function combineDateAndTime(date: Date, timeStr: string): Date {
  const dateFormatted = dayjs(date).format("YYYY-MM-DD");
  const fullDateTime = dayjs(
    `${dateFormatted} ${timeStr}`,
    "YYYY-MM-DD h:mm A",
  );
  return fullDateTime.toDate();
}

function combineDateAndAddOneHour(date: Date, timeStr: string): Date {
  const base = dayjs(date).format("YYYY-MM-DD");
  const combined = dayjs(`${base} ${timeStr}`, "YYYY-MM-DD h:mm A");
  const plusOneHour = combined.add(1, "hour");
  return plusOneHour.toDate();
}

export const EventSheet = ({
  event,
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  event: EventType | null;
}) => {
  const { daySelected, selectedTime } = calendarStateStore();
  const { appendEvent, updateEvent, deleteEvent } = eventStateStore();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [summary, setSummary] = React.useState<string>("");
  const [location, setLocation] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<Date>(new Date());
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [status, setStatus] = React.useState<string>("confirmed");
  const [calendar, setCalendar] = React.useState<string>("");

  React.useEffect(() => {
    if (event) {
      setSummary(event.summary ?? "");
      setLocation(event.location ?? "");
      setDescription(event.description ?? "");
      setStartDate(new Date(event.startDate));
      setEndDate(new Date(event.endDate));
      setStatus(event.status?.toLowerCase() ?? "confirmed");
      setCalendar(event.calendar?.id ?? "");
    } else {
      setSummary("");
      setLocation("");
      setDescription("");
      setStartDate(new Date());
      setEndDate(new Date());
      setStatus("confirmed");
      setCalendar("");
    }
  }, [event]);

  React.useEffect(() => {
    if (daySelected) {
      setStartDate(combineDateAndTime(new Date(daySelected), selectedTime));
    }
  }, [daySelected]);
  React.useEffect(() => {
    if (startDate) {
      // Step 1: Extract time string from startDate
      const timeString = dayjs(startDate).format("h:mm A"); // e.g., "6:00 AM"
      // Step 2: Combine with the same date and add 1 hour
      const computedEndDate = combineDateAndAddOneHour(startDate, timeString);
      // Step 3: Set the new end date
      setEndDate(computedEndDate);
    }
  }, [startDate]);
  const handleChange = () => {
    onClose();
    setSummary("");
    setLocation("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStatus("confirmed");
    setCalendar("");
  };

  // handle save or update
  const handleSave = async () => {
    if (
      !calendar ||
      !summary ||
      !startDate ||
      !endDate ||
      !location ||
      !description
    ) {
      createToast("Input Error", "Please fill in all fields", "danger");
      return;
    }

    let ev: any = {
      calendar,
      description,
      endDate,
      location,
      startDate,
      summary,
      status,
    };

    let update: any = {};

    if (event) {
      const current = {
        calendar: event?.calendar?.id,
        description: event?.description,
        endDate: new Date(event?.endDate),
        location: event?.location,
        startDate: new Date(event?.startDate),
        summary: event?.summary,
        status: event?.status,
      };

      if (JSON.stringify(current) === JSON.stringify(ev)) {
        createToast("Validation Error", "Nothing to update", "danger");
        return;
      }

      if (event.summary !== summary) update.summary = summary;
      if (event.location !== location) update.location = location;
      if (event.description !== description) update.description = description;
      if (new Date(event.startDate) !== new Date(startDate))
        update.startDate = startDate;
      if (new Date(event.endDate) !== new Date(endDate))
        update.endDate = endDate;
      if (event.status.toLowerCase() !== status)
        update.status = status.toUpperCase();
    }
    setLoading(true);

    try {
      if (event) {
        const urlArr = event.url.split("/");

        await updateEvent(urlArr[urlArr.length - 1], event.calendar.id, update);
      } else {
        await appendEvent(ev);
      }
      createToast("Success", "Event saved successfully", "success");
      onClose();
      setSummary("");
      setStartDate(new Date());
      setEndDate(new Date());
      setStatus("confirmed");
      setCalendar("");
      setLocation("");
      setDescription("");
    } catch (error) {
      createToast("Server Error", "Failed to save event", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleChange}>
      <SheetContent className="lg:min-w-[400px]">
        <SheetTitle>{event ? "Edit Event" : "Add Event"}</SheetTitle>
        <SheetDescription>
          {event
            ? "Edit event details as you see fit"
            : "Add a new event to your calendar"}
        </SheetDescription>
        <Separator className="mt-3" />
        <div className="my-5 space-y-3">
          <div className="flex items-center justify-between">
            {!event ? (
              <Calendars calendar={calendar} setCalendar={setCalendar} />
            ) : (
              <Paragraph className="flex items-center gap-3">
                <span>Calendar: {event.calendar.displayName}</span>
                <span
                  className="block w-3 h-3 rounded-full "
                  style={{ backgroundColor: event.calendar.color }}
                />
              </Paragraph>
            )}
            {event && (
              <Button
                variant="ghost"
                disabled={loading}
                size="sm"
                className="group"
                onClick={async () => {
                  setLoading(true);
                  const del = await deleteEvent(event.id);
                  if (del) {
                    createToast(
                      "Success",
                      "Event deleted successfully",
                      "success",
                    );
                    onClose();
                  } else {
                    createToast("Error", "Failed to delete event", "danger");
                  }
                  setLoading(false);
                }}
              >
                <Trash2
                  size={16}
                  className="text-red-500 group-hover:text-red-300 duration-500"
                />
              </Button>
            )}
          </div>
          <InputPair
            value={summary}
            setValue={setSummary}
            placeholder="Meeting with Lucy"
            label="Event title"
            disabled={loading}
          />
          <InputPair
            value={location}
            setValue={setLocation}
            placeholder="CBD or online"
            label="Location"
            disabled={loading}
          />
          <InputPair
            value={description}
            setValue={setDescription}
            placeholder="Meeting to discuss the progress of the social media accounts"
            label="Short  Description"
            textarea={true}
            disabled={loading}
          />
          <Separator />

          <div>
            <Label>Date & Time</Label>
          </div>
          <div className="space-y-3">
            <DateSelect label="From" date={startDate} setDate={setStartDate} />
            <DateSelect label="To" date={endDate} setDate={setEndDate} />
          </div>
          {/* <div className="flex items-center gap-2">
            <AppCheckbox
              text="All Day"
              checked={allDay}
              onCheck={() => setAllDay(!allDay)}
            />
          </div> */}
          <Separator />
          <Statuses status={status} setStatus={setStatus} />
          <Button
            className="w-full my-3"
            onClick={handleSave}
            disabled={loading}
          >
            {event ? "Updat" : "Creat"}
            {loading ? "ing..." : "e"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const statuses: ComboboxType[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "tentative", label: "Tentative" },
  { value: "cancelled", label: "Cancelled" },
];

const Calendars = ({
  calendar,
  setCalendar,
}: {
  calendar: string;
  setCalendar: React.Dispatch<string>;
}) => {
  const { calendars } = calendarStateStore();

  const selectedCalendar = (calId: string) =>
    calendars.find((cal: any) => cal.id === calId);
  return (
    <div className="flex flex-col gap-2">
      <Label className="flex items-center gap-2">
        <span>Calendar</span>
        {calendar ? (
          <span
            className="block w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                selectedCalendar(calendar)?.calendarColor ?? "transparent",
            }}
          />
        ) : null}
      </Label>
      <Combobox
        values={calendars.map((calendar: any) => ({
          value: calendar.id,
          label: calendar.displayName,
        }))}
        value={calendar}
        setValue={setCalendar}
        title="calendar"
      />
    </div>
  );
};

const Statuses = ({
  status,
  setStatus,
}: {
  status: string;
  setStatus: React.Dispatch<string>;
}) => (
  <div className="flex flex-col gap-2">
    <Label>Status</Label>
    <Combobox
      values={statuses}
      value={status}
      setValue={setStatus}
      title="status"
    />
  </div>
);

const DateSelect = ({
  date,
  setDate,
  label,
}: {
  date: Date;
  setDate: React.Dispatch<Date>;
  label: string;
}) => {
  return (
    <div className="gap-2 flex flex-col">
      <Label className="flex items-center gap-2">
        <Calendar size={16} />
        <span>{label}</span>
      </Label>
      <DatePicker
        selected={date}
        // showIcon
        onChange={(dt: any) => setDate(dt)}
        showTimeSelect
        dateFormat="Pp"
        className="px-3 cursor-pointer text-xs lg:text-xs bg-secondary !flex !items-center gap-2 w-full !py-3"
      />
    </div>
  );
};

const InputPair = ({
  label,
  value,
  setValue,
  placeholder,
  textarea,
  disabled,
}: {
  label: string;
  value: string;
  setValue: React.Dispatch<string>;
  placeholder: string;
  textarea?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <AppInput
        value={value}
        setValue={setValue}
        placeholder={placeholder}
        textarea={textarea}
        disabled={disabled}
      />
    </div>
  );
};
