// add event modal

import React from "react";
import { Calendar, Clock } from "lucide-react";
import dayjs from "dayjs";

import { Modal } from "./modal";
import AppInput from "../common/app-input";
import { Button } from "../ui/button";
import FormTitle from "../forms/components/form-title";
import { Separator } from "../ui/separator";
import { Paragraph } from "../ui/typography";
import { Checkbox } from "../ui/checkbox";

import { calendarStateStore } from "@/stores/calendar";
import CalendarPopover from "../popovers/calendar-popover";
import { createToast } from "@/utils/toast";
import { cancelEvent, createEvent, updateEvent } from "@/lib/api-calls/events";
import { EventLabelType, EventType } from "@/types";
// import { labels } from "../calendar/labels";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

interface AddEventProps {
  isOpen: boolean;
  onClose: () => void;
  event?: EventType;
}

const AddEvent: React.FC<AddEventProps> = ({ isOpen, onClose, event }) => {
  const {
    daySelected,
    setDaySelected,
    selectedTime,
    setSelectedTime,
    addEvent,
    addEvents,
    events,
  } = calendarStateStore();

  const [title, setTitle] = React.useState<string>(event?.title || "");
  const [group, setGroup] = React.useState<boolean>(event?.group || false);
  const [list, setList] = React.useState<string>(event?.list?.join(", ") || "");
  const [label, setLabel] = React.useState<EventLabelType>(
    event?.label || "work",
  );
  const [enteredTime, setEnteredTime] = React.useState<string>(
    event?.time || selectedTime,
  );

  const [cLoading, setCLoading] = React.useState<boolean>(false);
  const [dLoading, setDLoading] = React.useState<boolean>(false);

  const handleCreateOrUpdateEvent = async () => {
    if (!title) {
      createToast("error", "Provide a title for the event!");
      return;
    }

    if (!daySelected || !selectedTime) {
      createToast("error", "Provide a date and a time for the event!");
      return;
    }

    // validate list here
    if (group) {
      let listArr = list.trim().split(",");
      listArr = listArr.filter((lst) => lst);
      if (listArr.length === 0) {
        createToast("error", "Unselect the group!");
        return;
      }
    }

    // validate time here

    let doc: any = {
      title,
      date: daySelected,
      time: selectedTime,
      label,
    };

    if (group) doc.list = list;

    // check if there is anything to update
    if (event) {
      let original = {
        title: event.title,
        date: event.date,
        time: event.time,
        label: event.label,
        list: event.list,
      };

      if (JSON.stringify(doc) === JSON.stringify(original)) {
        createToast("error", "Nothing to update!");
        return;
      }
    }

    setCLoading(true);
    let res = event ? await updateEvent(event.id, doc) : await createEvent(doc);

    if (res) {
      createToast(
        "success",
        `Event was ${event ? "updated" : "created"} successfully!`,
      );
      // add event to state
      if (!event) addEvent({ ...doc, id: res, status: "active" });
      if (event) {
        // addEvents([]);
        let updatedEvents = [
          ...events.filter((evnt) => evnt.id !== event.id),
          { ...doc, status: "active" },
        ];
        addEvents([...updatedEvents]);
      }
      setTitle("");
      setGroup(false);
      setList("");
      onClose();
    }

    setCLoading(false);
  };

  const handleCancellingEvent = async () => {
    if (!event) return;

    setDLoading(true);
    let res = await cancelEvent(event.id);

    if (res) {
      createToast(
        "success",
        event.status === "active" ? "Event cancelled!" : "Event uncancelled!",
      );
      let status = event.status === "active" ? "cancelled" : "active";
      let updatedEvents: any = [
        ...events.filter((evnt) => evnt.id !== event.id),
        { ...event, status },
      ];
      addEvents([...updatedEvents]);
      onClose();
    }
    setDLoading(false);
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setDaySelected(undefined);
        setSelectedTime("8:00 AM");
      }}
      title="Add to schedule"
      description="Add an event to your schedule. You can add a group event such as an organization level event and add the people to be notified or group"
    >
      <AppInput
        value={title}
        disabled={cLoading || dLoading}
        setValue={setTitle}
        placeholder={"Team building"}
        label="Event title"
      />

      <FormTitle title="Day of event" />
      <CalendarPopover
        trigger={
          <div className="px-1 py-2 rounded-lg flex w-full justify-between items-center cursor-pointer hover:bg-secondary">
            <Paragraph>
              {daySelected || event?.date
                ? dayjs(event?.date || daySelected).format("DD MMM, YYYY")
                : "Select date"}
            </Paragraph>
            <Calendar size={19} />
          </div>
        }
        triggerClassName="w-full"
        date={event?.date || daySelected}
        setDate={setDaySelected}
      />
      <Separator />
      <FormTitle title="Actual time of event" />
      <AppInput
        value={event?.time || selectedTime || enteredTime}
        setValue={setEnteredTime}
        onKeyUp={(val) => setSelectedTime(val)}
        placeholder={"8:00 AM"}
        icon={<Clock size={19} />}
        containerClassName="w-full"
        cls="py-0 px-1"
        disabled={cLoading || dLoading}
      />

      <Separator />

      <LabelSelect label={label} setLabel={setLabel} />

      <div
        className={"flex gap-2 items-center cursor-pointer my-2"}
        onClick={() => setGroup(!group)}
      >
        <Checkbox
          checked={group}
          onCheckedChange={() => setGroup(!group)}
          disabled={cLoading || dLoading}
        />
        <FormTitle title="Group Event" />
      </div>
      {group && (
        <AppInput
          value={list}
          setValue={setList}
          placeholder={"accounts, hr@domain.com, ceo@domain.com..."}
          label="List of people in event"
          textarea={true}
          disabled={cLoading || dLoading}
        />
      )}

      <div className="flex gap-2 justify-end my-2">
        <Button
          disabled={cLoading || dLoading}
          onClick={handleCreateOrUpdateEvent}
          className="min-w-[150px]"
          variant={"outline"}
        >
          {event ? "Updat" : "Creat"}
          {cLoading ? "ing..." : "e"}
        </Button>
        {event && (
          <Button
            disabled={cLoading || dLoading}
            className="min-w-[150px]"
            variant={event?.status === "active" ? "destructive" : "secondary"}
            onClick={handleCancellingEvent}
          >
            {event?.status === "active" ? "C" : "Un"}ancel
            {dLoading ? "ling..." : ""}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default AddEvent;

const LabelSelect = ({
  label,
  setLabel,
}: {
  label: EventLabelType;
  setLabel: React.Dispatch<EventLabelType>;
}) => {
  return (
    <>
      <FormTitle title={`Select event type: ${label}`} />

      <div className="grid grid-cols-7 gap-1">
        {labels.map((itm: any, index: number) => (
          <Card
            key={index}
            className={cn(
              label === itm.title.toLowerCase() ? "border-main-color" : "",
              "flex flex-col items-center justify-center rounded-sm py-1 px-2 cursor-pointer duration-700 hover:border-main-color",
            )}
            onClick={() => setLabel(itm.title.toLowerCase())}
          >
            <div
              className={cn(`w-[30px] h-[30px] rounded-full`)}
              style={{ background: itm.bg }}
            />
            <Paragraph className="text-xs lg:text-xs font-bold mt-1">
              {itm.title}
            </Paragraph>
          </Card>
        ))}
      </div>
    </>
  );
};
