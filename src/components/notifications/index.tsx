"use client";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import { Card } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Heading4, Paragraph } from "../ui/typography";

import { useNotificationStateStore } from "@/stores/notification-store";
import { NotificationType } from "@/types";
import { Button } from "../ui/button";
import { updateThread } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";
import dayjs from "dayjs";

const Notifications = () => {
  const { notifications, clearNotifications } = useNotificationStateStore();

  return (
    <>
      {notifications.length > 0 ? (
        <>
          <div className="h-[100vh] w-[300px] overflow-hidden absolute z-30 top-0 right-0 p-3">
            <ScrollArea className="h-[100vh] w-full">
              {notifications.map((doc: NotificationType, index: number) => (
                <Notification key={index} notification={doc} />
              ))}
            </ScrollArea>
          </div>
          {notifications.length > 4 && (
            <div className="absolute bottom-0 right-0 my-5 z-40 flex justify-center w-[300px]">
              <Button
                variant={"outline"}
                className="text-sm  rounded-full flex items-center gap-4 w-fit shadow-2xl hover:text-danger"
                onClick={() => clearNotifications()}
              >
                Clear Notifications <X size={19} />
              </Button>
            </div>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Notifications;

const Notification = ({ notification }: { notification: NotificationType }) => {
  const { removeNotificationFromState } = useNotificationStateStore();
  
  const { push } = useRouter();

  const handleOpenMail = (e: any) => {
    e.stopPropagation();
    e.preventDefault(); 

    if (notification.type === "mail") push(`/?sec=inbox&threadId=${notification.thread}`);
    removeNotificationFromState(notification)
  };

  const handleMailUpdate = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    let res = await updateThread(notification.thread, {read: true}); 
    if (res) createToast("success", "Mail marked as read.");
    removeNotificationFromState(notification)
  }
  return (
    <Card
      className="relative flex flex-col gap-2 px-3 py-2 my-2 w-full hover:border-main"
      onClick={notification.type === "mail" ? handleOpenMail: () => {}}
    >
      <span
        className="cursor-pointer hover:text-destructive duration-700 self-end absolute top-0 right-0 m-2 z-40"
        onClick={() => removeNotificationFromState(notification)}
      >
        <X size={16} />
      </span>
      <Heading4 className="text-[.7rem] lg:text-[.7rem] capitalize">
        { notification.type === "mail" && `New Mail from ${notification.from}`}
        {notification.type === "appointment" && `${notification.title} - Appointment reminder`}
        {notification.type === "event" && `${notification.title} - Event reminder`}
      </Heading4>
      <Paragraph className="mt-3 text-[.7rem] lg:text-[.7rem] line-clamp-2 ">
        {notification.type === "mail" && `Subject: ${notification.subject}`}
        {notification.type === "appointment" && `Appointment reminder at ${notification.time} with ${notification.with} more ${notification.with === 1 ? `person`: `people`}`}
        {notification.type === "event" && `Event reminder on ${dayjs(new Date(notification.date)).format("DD MMM, YYYY")} at ${notification.time}.`}
      </Paragraph>
      
      {
        notification.type === "mail" && (
          <span className="text-[.7rem] lg:text-[.7rem] hover:text-main cursor-pointer transition-all block my-2" onClick={(e: React.MouseEvent<HTMLSpanElement>) => handleMailUpdate(e)}>
            Mark as read
          </span>
        )
      }
    </Card>
  );
};
