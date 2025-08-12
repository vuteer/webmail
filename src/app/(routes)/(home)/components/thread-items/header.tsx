// thread header
import { useState } from "react";
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

import { handleToggleFlag, handleToggleLocation, printThread } from "./actions";
import { useMailStoreState } from "@/stores/mail-store";
import { useMailNumbersStore } from "@/stores/mail-numbers";

import { MailTrashModal } from "./delete-modal";
import { Paragraph } from "@/components/ui/typography";
import { deleteMails } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";

export const MailHeader = ({ threadId }: { threadId: string }) => {
  const { threads } = useThreadStore();
  const { inbox, drafts, sent, archive, junk, trash } = useMailNumbersStore();
  const [, setMode] = useQueryState("mode");
  const [, setThreadId] = useQueryState("threadId");
  const [, setDraftId] = useQueryState("draftId");
  const [sec] = useQueryState("sec");
  const [, setActiveReplyId] = useQueryState("activeReplyId");

  const currentIndex = threads.findIndex(
    (thread) => thread.messageId === threadId,
  );
  const total =
    sec === "inbox"
      ? inbox
      : sec === "drafts"
        ? drafts
        : sec === "sent"
          ? sent
          : sec === "archive"
            ? archive
            : sec === "junk"
              ? junk
              : sec === "trash"
                ? trash
                : 0;

  const isFromAdmin =
    threads[currentIndex]?.from.name === "Mail Delivery System";

  const handleNextOrPrev = (dir: "next" | "prev") => {
    const threadsLength = threads.length;
    if (threadsLength <= 1) return;

    // next

    let moveToIndex = dir === "next" ? currentIndex + 1 : currentIndex - 1;

    if (dir === "next" && moveToIndex > threadsLength - 1) moveToIndex = 0;
    if (dir === "prev" && moveToIndex < 0) moveToIndex = threadsLength - 1;
    const newThread = threads[moveToIndex];
    setThreadId(newThread.messageId);
    setActiveReplyId(null);
    setMode(null);
  };

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
                setDraftId(null);
              }}
            >
              <X size={20} />
            </Button>
            <div className="dark:bg-iconDark/20 relative h-5 w-0.5 rounded-full bg-[#E7E7E7]" />{" "}
            <div className="hidden lg:flex gap-2">
              <Button
                disabled={threads.length === 1}
                variant="ghost"
                size="sm"
                className="p-0 px-2 py-1"
                onClick={() => handleNextOrPrev("prev")}
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                disabled={threads.length === 1}
                variant="ghost"
                size="sm"
                className="p-0 px-2 py-1"
                onClick={() => handleNextOrPrev("next")}
              >
                <ChevronRight size={18} />
              </Button>
            </div>
            <div className="dark:bg-iconDark/20 relative h-5 w-0.5 rounded-full bg-[#E7E7E7] hidden lg:block" />{" "}
            <Paragraph className="hidden lg:flex items-center gap-2 font-semibold">
              <span>&nbsp;{currentIndex + 1}</span>
              <span>out of</span>
              <span>{total}</span>
            </Paragraph>
          </div>
          <div className="flex items-center gap-2">
            {sec === "inbox" && !isFromAdmin && (
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
                  <div className="justify-start text-xs lg:text-sm leading-none text-black dark:text-white">
                    Reply All
                  </div>
                </div>
              </button>
            )}
            <Starred threadId={threadId} />
            <Important threadId={threadId} />
            {(sec === "inbox" || sec === "archive") && (
              <Archived threadId={threadId} />
            )}
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
  const { setInitialNumbers } = useMailNumbersStore();
  const { fetchThreads } = useThreadStore();
  const [loading, setLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [sec, setSec] = useQueryState("sec");
  const [, setThreadId] = useQueryState("threadId");
  const [page] = useQueryState("page");
  const [sort] = useQueryState("sort");

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
  const handleDeletePermanently = async () => {
    try {
      setLoading(true);
      const res = await deleteMails(sec || "INBOX", [threadId]);

      if (res) {
        createToast(
          "Successfully deleted",
          "Mail Permanently deleted",
          "success",
        );
        setThreadId(null);
        // setSec("inbox");
        setInitialNumbers();
        setOpenConfirmModal(false);
        fetchThreads(
          sec || "INBOX",
          Number(page || 0),
          sort ? "unread=true" : "",
          false,
          true,
        );
      }
    } catch (err: any) {
      createToast("Error", "Deletion failed. Try Again!", "danger");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <MailTrashModal
        loading={loading}
        isOpen={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onMoveToTrash={toggleTrashed}
        onDelete={handleDeletePermanently}
      />

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setOpenConfirmModal(true)}
              disabled={loading}
              className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg border border-[#FCCDD5] bg-[#FDE4E9] dark:border-[#6E2532] dark:bg-[#411D23]"
            >
              <Trash className="fill-[#F43F5E]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
            {sec === "trash" ? "Restore" : "Move to Bin"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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
    const action: "add" | "remove" = sec === "junk" ? "remove" : "add";
    let res = await handleToggleLocation(
      threadId,
      sec,
      sec !== "junk" ? "junk" : "inbox",
      setLoading,
      action,
    );

    if (res) {
      setThreadId(null);
      setSec(action === "add" ? "junk" : "inbox");
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
        {sec !== "inbox" && sec !== "sent" ? (
          <DropdownMenuItem onClick={toggleInbox} disabled={loading}>
            <Inbox className="fill-iconLight dark:fill-iconDark  mr-2 h-4 w-4" />
            <span>Move to Inbox</span>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            printThread(mails);
          }}
          disabled={loading}
        >
          <Printer className="fill-iconLight dark:fill-iconDark mr-2 h-4 w-4" />
          <span>Print thread</span>
        </DropdownMenuItem>
        {sec !== "junk" && sec !== "sent" ? (
          <DropdownMenuItem onClick={toggleSpam} disabled={loading}>
            <ArchiveX className="fill-iconLight dark:fill-iconDark h-4 w-4 mr-2" />
            <span>{"Move to Spam"}</span>
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
