// thread item
import React, { use } from "react";
import { useQueryState, useQueryStates } from "nuqs";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading4, Paragraph } from "@/components/ui/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { ThreadType } from "@/types";

import { useMailNumbersStore } from "@/stores/mail-numbers";

import { AppAvatar } from "@/components";
import {
  Archive2,
  ExclamationCircle,
  GroupPeople,
  Star2,
  Trash,
} from "@/components/icons/icons";
import { formatDate } from "@/lib/utils";
import { useThreadStore } from "@/stores/threads";
import { updateMailFlags } from "@/lib/api-calls/mails";
import { handleToggleFlag, includesFlag } from "./thread-items/actions";

interface ThreadProps {
  thread: ThreadType;
  index: number;
}

const Thread: React.FC<ThreadProps> = ({ thread, index }) => {
  const [threadId, setThreadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");
  const { updateThread } = useThreadStore();

  const { from, date, subject, flags, labels, cc, bcc, messageId } = thread;

  const [archived, setArchived] = React.useState<boolean>(true);

  // zustand state
  const { inbox, lessFromNumber } = useMailNumbersStore();

  const handleOpenMail = async () => {
    if (!includesFlag("\\Seen", flags)) {
      // 1. Optimistic update
      const previousFlags = [...thread.flags];
      const newFlags = [...previousFlags, "\\Seen"];
      updateThread(messageId, { flags: newFlags });

      let success = await updateMailFlags(
        thread.messageId,
        sec || "inbox",
        "Seen",
        "add",
      );
      if (!success) {
        updateThread(messageId, { flags: previousFlags });
      }
    }
    setThreadId(messageId);
    if (inbox) lessFromNumber("unread", 1);
  };

  return (
    <div
      className={cn(
        "group relative duration-700 p-1 pb-0 rounded-lg my-1 w-full cursor-pointer overflow-hidden hover:bg-background  ",
        threadId === messageId ? "bg-secondary" : "",
      )}
      onClick={handleOpenMail}
    >
      <ThreadButtons
        index={index}
        starred={includesFlag("\\Flagged", flags)}
        important={includesFlag("$Important", flags)}
        archived={archived}
        setArchived={setArchived}
      />
      <div className="flex items-center gap-3 py-4 px-2 w-full overflow-hidden">
        <AppAvatar
          name={from.name || "No Name"}
          dimension="h-10 w-10"
          src={
            from.image ||
            from.avatar ||
            "https://res.cloudinary.com/dyo0ezwgs/image/upload/v1701022046/digital/users/profiles/v0bhjiet4xpkkeqpygn0.png"
          }
        />
        <div className="flex flex-col flex-1">
          <div className="flex-1 flex gap-3 items-center">
            <Heading4 className="text-sm lg:text-md leading-0">
              {from.name || "No Name"}
            </Heading4>
            <div className="flex-1 flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <div
                  className={cn(
                    "h-2 w-2 rounded-full",
                    includesFlag("\\Seen", flags)
                      ? "bg-transparent"
                      : "bg-main-color",
                  )}
                />
                <Star2
                  className={cn(
                    "h-4 w-4",
                    includesFlag("\\Flagged", flags)
                      ? "fill-yellow-400 stroke-yellow-400"
                      : "fill-transparent ",
                  )}
                />
              </div>
              <Paragraph>{formatDate(date.split(".")[0] || "")}</Paragraph>
            </div>
          </div>
          <Paragraph className="text-muted-foreground">{subject}</Paragraph>
        </div>
      </div>
    </div>
  );
};

export default Thread;

export const ThreadPlaceholder = () => (
  <>
    <div className="flex gap-1 my-2 w-full">
      <Skeleton className="w-8 h-8 rounded-full bg-secondary" />
      <div className="flex flex-col gap-1 w-full">
        <div className="flex justify-between items-center">
          <Skeleton className="w-[100px] rounded-full h-[13px] bg-secondary" />
          <div className="flex gap-2 items-center">
            {/* <Paperclip size={18}/> */}
            <Skeleton className="w-[70px] h-[12px] rounded-full bg-secondary" />
          </div>
        </div>
        <Skeleton className="w-[150px] rounded-full h-[13px] bg-secondary" />
        <div className="flex items-end w-full">
          <div className="w-full">
            <Skeleton className="w-full h-[10px] rounded-full my-1 bg-secondary" />
            <Skeleton className="w-full h-[10px] rounded-full my-1 bg-secondary" />
            <Skeleton className="w-[80%] h-[10px] rounded-full my-1 bg-secondary" />
          </div>
        </div>
      </div>
    </div>
    <Separator />
  </>
);

const ThreadButtons = ({
  index,
  starred,
  important,
  archived,
  setArchived,
}: {
  index: number;
  starred: boolean;
  important: boolean;
  archived: boolean;
  setArchived: (archived: boolean) => void;
}) => {
  const { threads, updateThread } = useThreadStore();
  const [threadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");

  return (
    <div
      className={cn(
        "dark:bg-panelDark absolute right-2 top-0 z-[25] flex  items-center gap-1 rounded-xl border bg-white p-1 shadow-sm opacity-0 group-hover:opacity-100",
        index === 0 ? "top-4" : "top-[-1]",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 overflow-visible [&_svg]:size-3.5"
            onClick={() =>
              handleToggleFlag(
                threadId,
                sec,
                threads,
                updateThread,
                "\\Flagged",
              )
            }
          >
            <Star2
              className={cn(
                "h-4 w-4",
                starred
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-transparent stroke-[#9D9D9D] dark:stroke-[#9D9D9D]",
              )}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={"top"}
          className="mb-1 bg-white dark:bg-[#1A1A1A]"
        >
          {starred ? "Unstar" : "Star"}
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 [&_svg]:size-3.5",
              important
                ? "hover:bg-orange-200/70 dark:hover:bg-orange-800/40"
                : "",
            )}
            onClick={() =>
              handleToggleFlag(
                threadId,
                sec,
                threads,
                updateThread,
                "$Important",
              )
            }
          >
            <ExclamationCircle
              className={cn(important ? "fill-orange-400" : "fill-[#9D9D9D]")}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={index === 0 ? "bottom" : "top"}
          className="dark:bg-panelDark mb-1 bg-white"
        >
          Important
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 [&_svg]:size-3.5"
            onClick={(e) => {
              e.stopPropagation();
              // moveThreadTo('archive');
            }}
          >
            <Archive2 className="fill-[#9D9D9D]" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side={index === 0 ? "bottom" : "top"}
          className="dark:bg-panelDark mb-1 bg-white"
        >
          Archive
        </TooltipContent>
      </Tooltip>
      {!false ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 hover:bg-[#FDE4E9] dark:hover:bg-[#411D23] [&_svg]:size-3.5"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                // moveThreadTo('bin');
              }}
            >
              <Trash className="fill-[#F43F5E]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side={index === 0 ? "bottom" : "top"}
            className="dark:bg-panelDark mb-1 bg-white"
          >
            Move to Trash
          </TooltipContent>
        </Tooltip>
      ) : null}
    </div>
  );
};
