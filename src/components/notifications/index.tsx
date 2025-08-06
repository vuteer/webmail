"use client";
import { X } from "lucide-react";

import { Card } from "../ui/card";
import { Heading4, Paragraph } from "../ui/typography";

import { useNotificationStateStore } from "@/stores/notification-store";
import { NotificationType } from "@/types";
import { Button } from "../ui/button";

const Notifications = () => {
  const { notifications, clearNotifications } = useNotificationStateStore();

  return (
    <>
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
      {notifications.length > 0 ? (
        <>
          <div className=" w-[300px] overflow-hidden absolute z-30 bottom-0 right-0 p-3">
            <div className="overflow-y-auto flex flex-col justify-end  ">
              {notifications.map((doc: NotificationType, index: number) => (
                <Notification key={index} notification={doc} />
              ))}
            </div>
          </div>
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

  return (
    <Card className="relative flex flex-col gap-2 px-3 py-2 my-2 w-full">
      <span
        className="cursor-pointer hover:text-destructive duration-700 self-end absolute top-0 right-0 m-2 z-40"
        onClick={() => removeNotificationFromState(notification)}
      >
        <X size={16} />
      </span>
      <Heading4 className="text-[.7rem] lg:text-[.7rem] capitalize">
        {notification.title}
      </Heading4>
      <Paragraph className=" text-[.7rem] lg:text-[.7rem] line-clamp-2 ">
        {notification.message}
      </Paragraph>
    </Card>
  );
};
