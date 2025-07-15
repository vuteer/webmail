// thread header
import { use, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import {
  Archive,
  ArchiveX,
  Printer,
  Reply,
  ThreeDots,
  Trash,
  Star,
  Inbox,
  ExclamationCircle,
} from "@/components/icons/icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThreadStore } from "@/stores/threads";

import {
  handleToggleFlag,
  // includesFlag,
  handleToggleLocation,
  printThread,
} from "./actions";
import { useMailStoreState } from "@/stores/mail-store";

export const MailHeader = ({ threadId }: { threadId: string }) => {
  const [, setMode] = useQueryState("mode");
  const [, setThreadId] = useQueryState("threadId");
  const [, setActiveReplyId] = useQueryState("activeReplyId");

  return (
    <>
      {threadId && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 py-2">
            <Button
              size="sm"
              variant="ghost"
              className="p-0 px-2 py-1 cursor-pointer hover:text-red-500 duration-700"
              onClick={() => {
                setMode(null);
                setThreadId(null);
                setActiveReplyId(null);
              }}
            >
              <X size={20} />
            </Button>
            <div className="dark:bg-iconDark/20 relative h-5 w-0.5 rounded-full bg-[#E7E7E7]" />{" "}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="p-0 px-2 py-1">
                <ChevronLeft size={18} />
              </Button>
              <Button variant="ghost" size="sm" className="p-0 px-2 py-1">
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMode("replyAll");
                setActiveReplyId(threadId);
              }}
              className="inline-flex h-7 items-center justify-center gap-1 overflow-hidden rounded-lg border bg-white px-1.5 dark:border-none dark:bg-[#313131]"
            >
              <Reply className="fill-muted-foreground dark:fill-[#9B9B9B]" />
              <div className="flex items-center justify-center gap-2.5 pl-0.5 pr-1">
                <div className="justify-start text-sm leading-none text-black dark:text-white">
                  Reply All
                </div>
              </div>
            </button>
            <Starred threadId={threadId} />
            <Important threadId={threadId} />
            <Archived threadId={threadId} />
            <Trashed threadId={threadId} />
            <Dots />
          </div>
        </div>
      )}
    </>
  );
};

export const Starred = ({ threadId }: { threadId: string }) => {
  const { threads, updateThread } = useThreadStore();
  // const [threadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");

  const starred = () => {
    let thread = threads.find((t) => t.messageId === threadId);
    if (!thread) return false;
    return thread.flags.includes("\\Flagged");
  };
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() =>
              handleToggleFlag(
                threadId,
                sec,
                threads,
                updateThread,
                "\\Flagged",
              )
            }
            className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white dark:bg-[#313131]"
          >
            <Star
              className={cn(
                "ml-[2px] mt-[2.4px] h-5 w-5",
                starred()
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-transparent stroke-[#9D9D9D] dark:stroke-[#9D9D9D]",
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
          {starred() ? "Unstar" : "Star"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Important = ({ threadId }: { threadId: string }) => {
  const { threads, updateThread } = useThreadStore();
  // const [threadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");

  const important = () => {
    let thread = threads.find((t) => t.messageId === threadId);
    if (!thread) return false;
    return thread.flags.includes("$Important");
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() =>
              handleToggleFlag(
                threadId,
                sec,
                threads,
                updateThread,
                "$Important",
              )
            }
            className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white dark:bg-[#313131]"
          >
            <ExclamationCircle
              className={cn(important() ? "fill-orange-400" : "fill-[#9D9D9D]")}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
          {important() ? "Not Important" : "Important"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Archived = ({ threadId }: { threadId: string }) => {
  const [loading, setLoading] = useState(false);
  const [sec, setSec] = useQueryState("sec");
  const [, setThreadId] = useQueryState("threadId");

  const toggleArchived = async () => {
    const action: "add" | "remove" = sec === "archive" ? "remove" : "add";
    let res = await handleToggleLocation(
      threadId,
      sec,
      sec !== "archive" ? "archive" : "inbox",
      setLoading,
      action,
    );

    if (res) {
      setThreadId(null);
      setSec(action === "add" ? "archive" : "inbox");
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleArchived}
            disabled={loading}
            className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white dark:bg-[#313131]"
          >
            <Archive className="fill-iconLight dark:fill-iconDark" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
          {sec === "archive" ? "Unarchive" : "Archive"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Trashed = ({ threadId }: { threadId: string }) => {
  const [loading, setLoading] = useState(false);
  const [sec, setSec] = useQueryState("sec");
  const [, setThreadId] = useQueryState("threadId");

  const toggleTrashed = async () => {
    const action: "add" | "remove" = sec === "trash" ? "remove" : "add";

    let res = await handleToggleLocation(
      threadId,
      sec,
      sec !== "trash" ? "trash" : "inbox",
      setLoading,
      action,
    );

    if (res) {
      setThreadId(null);
      setSec(action === "add" ? "trash" : "inbox");
    }
  };
  return (
    <>
      {true && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTrashed}
                className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg border border-[#FCCDD5] bg-[#FDE4E9] dark:border-[#6E2532] dark:bg-[#411D23]"
              >
                <Trash className="fill-[#F43F5E]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-white dark:bg-[#313131]"
            >
              {sec === "trash" ? "Restore" : "Move to Bin"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export const Dots = () => {
  const { mails } = useMailStoreState();

  const [loading, setLoading] = useState(false);
  const [sec, setSec] = useQueryState("sec");
  const [threadId, setThreadId] = useQueryState("threadId");

  const toggleSpam = async () => {
    if (!threadId) return;
    const action: "add" | "remove" = sec === "spam" ? "remove" : "add";
    let res = await handleToggleLocation(
      threadId,
      sec,
      sec !== "spam" ? "spam" : "inbox",
      setLoading,
      action,
    );

    if (res) {
      setThreadId(null);
      setSec(action === "add" ? "spam" : "inbox");
    }
  };
  const toggleInbox = async () => {
    if (!threadId) return;
    // const action: "add" | "remove" = sec === "spam" ? "remove" : "add";
    let res = await handleToggleLocation(
      threadId,
      sec,
      "inbox",
      setLoading,
      "remove",
    );

    if (res) {
      setThreadId(null);
      setSec("inbox");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-0 dark:bg-[#313131]">
          <ThreeDots className="fill-iconLight dark:fill-iconDark" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#313131]">
        {sec !== "inbox" ? (
          <DropdownMenuItem onClick={toggleInbox}>
            <Inbox className="fill-iconLight dark:fill-iconDark  mr-2 h-4 w-4" />
            <span>Move to Inbox</span>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            printThread(mails);
          }}
        >
          <Printer className="fill-iconLight dark:fill-iconDark mr-2 h-4 w-4" />
          <span>Print thread</span>
        </DropdownMenuItem>
        {sec !== "spam" ? (
          <DropdownMenuItem onClick={toggleSpam}>
            <ArchiveX className="fill-iconLight dark:fill-iconDark h-4 w-4 mr-2" />
            <span>{"Move to Spam"}</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
