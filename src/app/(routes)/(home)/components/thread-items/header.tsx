// thread header
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Archive,
  ArchiveX,
  Lightning,
  Printer,
  Reply,
  ThreeDots,
  Trash,
  Star,
  Inbox,
} from "@/components/icons/icons";

// import { ThreadActionButton } from "./thread-action-button";
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

export const MailHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 py-2">
        {/* <ThreadActionButton
          icon={X}
          label={"close"}
          onClick={() => {}}
          className="hidden md:flex"
        /> */}
        <Button
          size="sm"
          variant="ghost"
          className="p-0 px-2 py-1 cursor-pointer hover:text-red-500 duration-700"
        >
          <X size={20} />
        </Button>
        <div className="dark:bg-iconDark/20 relative h-5 w-0.5 rounded-full bg-[#E7E7E7]" />{" "}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // setMode('replyAll');
            // setActiveReplyId(emailData?.latest?.id ?? '');
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
        <Starred starred={true} />
        <Archived archived={true} />
        <Trashed trashed={false} />
        <Dots />
      </div>
    </div>
  );
};

export const Starred = ({ starred }: { starred: boolean }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            // onClick={handleToggleStar}
            className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white dark:bg-[#313131]"
          >
            <Star
              className={cn(
                "ml-[2px] mt-[2.4px] h-5 w-5",
                starred
                  ? "fill-yellow-400 stroke-yellow-400"
                  : "fill-transparent stroke-[#9D9D9D] dark:stroke-[#9D9D9D]",
              )}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
          {starred ? "Unstar" : "Star"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Archived = ({ archived }: { archived: boolean }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            // onClick={() => moveThreadTo('archive')}
            className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white dark:bg-[#313131]"
          >
            <Archive className="fill-iconLight dark:fill-iconDark" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-white dark:bg-[#313131]">
          Archive
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const Trashed = ({ trashed }: { trashed: boolean }) => {
  return (
    <>
      {!trashed && (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                // onClick={() => moveThreadTo('bin')}
                className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg border border-[#FCCDD5] bg-[#FDE4E9] dark:border-[#6E2532] dark:bg-[#411D23]"
              >
                <Trash className="fill-[#F43F5E]" />
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="bg-white dark:bg-[#313131]"
            >
              Move to Bin
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export const Dots = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-lg bg-white focus:outline-none focus:ring-0 dark:bg-[#313131]">
          <ThreeDots className="fill-iconLight dark:fill-iconDark" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#313131]">
        {/* <DropdownMenuItem onClick={() => setIsFullscreen(!isFullscreen)}>
          <Expand className="fill-iconLight dark:fill-iconDark mr-2" />
          <span>
            {isFullscreen
              ? t('common.threadDisplay.exitFullscreen')
              : t('common.threadDisplay.enterFullscreen')}
          </span>
        </DropdownMenuItem> */}

        {false ? (
          <DropdownMenuItem
          // onClick={() => moveThreadTo('inbox')}
          >
            <Inbox className="mr-2 h-4 w-4" />
            <span>Move to Inbox</span>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                // printThread();
              }}
            >
              <Printer className="fill-iconLight dark:fill-iconDark mr-2 h-4 w-4" />
              <span>Print thread</span>
            </DropdownMenuItem>
            <DropdownMenuItem
            // onClick={() => moveThreadTo('spam')}
            >
              <ArchiveX className="fill-iconLight dark:fill-iconDark h-4 w-4 mr-2" />
              <span>Move to Spam</span>
            </DropdownMenuItem>
          </>
        )}
        {/* !isImportant */}
        {true && (
          <DropdownMenuItem
          // onClick={handleToggleImportant}
          >
            <Lightning className="fill-iconLight dark:fill-iconDark mr-2" />
            <span>Mark as Important</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
