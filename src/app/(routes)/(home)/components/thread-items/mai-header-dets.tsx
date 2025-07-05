import { useState, useCallback, useRef } from "react";
import { Lock, HardDriveDownload } from "lucide-react";
import { useQueryState } from "nuqs";
import { format } from "date-fns-tz";

import {
  Forward,
  Reply,
  ReplyAll,
  ThreeDots,
  Printer,
} from "@/components/icons/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import { MailIframe } from "./mail-iframe";
import { AppAvatar } from "@/components";
import { Separator } from "@/components/ui/separator";

import {
  cleanEmailDisplay,
  cleanNameDisplay,
  openAttachment,
  getFileIcon,
  formatFileSize,
  downloadAttachment,
  printThread,
  handleDownloadAllAttachments,
} from "./actions";

export const MailHeaderDetails = ({
  emailData,
  totalEmails,
  index,
}: {
  emailData: any;
  totalEmails: number;
  index: number;
}) => {
  const [openDetailsPopover, setOpenDetailsPopover] = useState<boolean>(false);
  const [preventCollapse, setPreventCollapse] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const collapseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [, setMode] = useQueryState("mode");
  const [, setActiveReplyId] = useQueryState("activeReplyId");

  // Function to handle popover state changes
  const handlePopoverChange = useCallback((open: boolean) => {
    setOpenDetailsPopover(open);

    if (!open) {
      // When closing the popover, prevent collapse for a short time
      setPreventCollapse(true);

      // Clear any existing timeout
      if (collapseTimeoutRef.current) {
        clearTimeout(collapseTimeoutRef.current);
      }

      // Set a timeout to allow collapse again after a delay
      collapseTimeoutRef.current = setTimeout(() => {
        setPreventCollapse(false);
      }, 300);
    }
  }, []);

  // Handle email collapse toggle
  const toggleCollapse = useCallback(() => {
    // Only toggle if we're not in prevention mode
    if (!preventCollapse && !openDetailsPopover) {
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed, preventCollapse, openDetailsPopover]);

  const DetailsPopover = () => (
    <Popover open={openDetailsPopover} onOpenChange={handlePopoverChange}>
      <PopoverTrigger asChild>
        <button
          className="hover:bg-iconLight/10 dark:hover:bg-iconDark/20 flex items-center gap-2 rounded-md p-2"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setOpenDetailsPopover(!openDetailsPopover);
          }}
          // ref={triggerRef}
        >
          <p className="text-muted-foreground text-xs underline dark:text-[#8C8C8C]">
            Details
          </p>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="dark:bg-panelDark flex w-[420px] overflow-auto rounded-lg border p-4 text-left shadow-lg"
        // onBlur={(e) => {
        //   if (!triggerRef.current?.contains(e.relatedTarget)) {
        //     setOpenDetailsPopover(false);
        //   }
        // }}
        // onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-1 text-sm">
          <div className="flex">
            <span className="w-24 text-end text-gray-500">From:</span>
            <div className="ml-3">
              <span className="text-muted-foreground text-nowrap pr-1 font-bold">
                {cleanNameDisplay(emailData?.from?.name)}
              </span>
              {/* {emailData?.sender?.name !== emailData?.sender?.email && ( */}
              {true && (
                <span className="text-muted-foreground text-nowrap">
                  {cleanEmailDisplay(emailData?.from?.email)}
                </span>
              )}
            </div>
          </div>
          <div className="flex">
            <span className="w-24 text-nowrap text-end text-gray-500">To:</span>
            <span className="text-muted-foreground ml-3 text-nowrap">
              {emailData?.to
                ?.map((t) => cleanEmailDisplay(t.email || t.address))
                .join(", ")}
            </span>
          </div>
          {emailData?.replyTo && emailData.replyTo.length > 0 && (
            <div className="flex">
              <span className="w-24 text-nowrap text-end text-gray-500">
                Reply-To:
              </span>
              <span className="text-muted-foreground ml-3 text-nowrap">
                {cleanEmailDisplay(emailData?.replyTo)}
              </span>
            </div>
          )}
          {emailData?.cc && emailData.cc.length > 0 && (
            <div className="flex">
              <span className="shrink-0text-nowrap w-24 text-end text-gray-500">
                CC:
              </span>
              <span className="text-muted-foreground ml-3 text-nowrap">
                {emailData?.cc
                  ?.map((t) => cleanEmailDisplay(t.email))
                  .join(", ")}
              </span>
            </div>
          )}
          {emailData?.bcc && emailData.bcc.length > 0 && (
            <div className="flex">
              <span className="w-24 text-end text-gray-500">BCC:</span>
              <span className="text-muted-foreground ml-3 text-nowrap">
                {emailData?.bcc
                  ?.map((t) => cleanEmailDisplay(t.email))
                  .join(", ")}
              </span>
            </div>
          )}
          <div className="flex">
            <span className="w-24 text-end text-gray-500">Date:</span>
            <span className="text-muted-foreground ml-3 text-nowrap">
              {emailData?.date && !isNaN(new Date(emailData.date).getTime())
                ? format(new Date(emailData.date), "PPpp")
                : ""}
            </span>
          </div>
          <div className="flex">
            <span className="w-24 text-end text-gray-500">Mailed-By:</span>
            <span className="text-muted-foreground ml-3 text-nowrap">
              {cleanEmailDisplay(
                emailData?.from?.email || emailData?.from?.address,
              )}
            </span>
          </div>
          <div className="flex">
            <span className="w-24 text-end text-gray-500">Signed-By:</span>
            <span className="text-muted-foreground ml-3 text-nowrap">
              {cleanEmailDisplay(
                emailData?.from?.email || emailData?.from?.address,
              )}
            </span>
          </div>
          {emailData.security.tls && (
            <div className="flex items-center">
              <span className="w-24 text-end text-gray-500">Security:</span>
              <div className="text-muted-foreground ml-3 flex items-center gap-1">
                <Lock className="h-4 w-4 text-green-600" />{" "}
                <span>Standard Encryption</span>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );

  const isLastEmail = totalEmails && index === totalEmails - 1;
  return (
    <div
      className="border  rounded-lg p-2 px-4 flex cursor-pointer flex-col pb-2 transition-all duration-200"
      onClick={toggleCollapse}
    >
      {/* mail header */}
      <div className="mt-3 flex w-full items-start justify-between gap-4 ">
        <div className="flex w-full justify-center items-center gap-2">
          <AppAvatar
            src={emailData.from.picture || emailData.from.image || ""}
            name={emailData.from.name || emailData.from.email}
            dimension="w-7 h-7"
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex w-full items-center justify-start">
              <div className="flex w-full flex-col">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span
                      onClick={(e) => {
                        // e.stopPropagation();
                        // e.preventDefault();
                        // setResearchSender({
                        //   name: emailData?.sender?.name || '',
                        //   email: emailData?.sender?.email || '',
                        //   //   extra: emailData?.sender?.extra || '',
                        // });
                      }}
                      className="hover:bg-muted font-semibold"
                    >
                      {emailData.from.name ||
                        emailData.from.email ||
                        emailData.from.address}
                      {/* {cleanNameDisplay(emailData?.sender?.name)} */}
                    </span>

                    {/* Details popover */}
                    <DetailsPopover />
                  </div>

                  {/* timee and dots */}
                  <div className="flex items-center justify-center">
                    <div className="text-muted-foreground mr-2 flex flex-col items-end text-sm font-medium dark:text-[#8C8C8C]">
                      <time>{formatDate(emailData?.date)}</time>
                    </div>

                    {/* options menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          className="inline-flex h-7 w-7 items-center justify-center gap-1 overflow-hidden rounded-md bg-white focus:outline-none focus:ring-0 dark:bg-[#313131]"
                        >
                          <ThreeDots className="fill-iconLight dark:fill-iconDark" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-[#313131]"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            printThread([emailData]);
                            // printMail();
                          }}
                        >
                          <Printer className="fill-iconLight dark:fill-iconDark mr-2 h-4 w-4" />
                          <span>Print</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          disabled={!emailData.attachments?.length}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDownloadAllAttachments(
                              emailData.subject || "email",
                              emailData.attachments || [],
                            )();
                          }}
                        >
                          <HardDriveDownload className="fill-iconLight dark:text-iconDark dark:fill-iconLight mr-2 h-4 w-4" />
                          Download All Attachments
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {/* to */}
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <p className="text-muted-foreground text-sm font-medium dark:text-[#8C8C8C]">
                      {"To"}:{" "}
                      {(() => {
                        // Combine to and cc recipients
                        const allRecipients = [
                          ...(emailData?.to || []),
                          ...(emailData?.cc || []),
                        ];

                        // If you're the only recipient
                        if (allRecipients.length === 1) {
                          return <span key="you">You</span>;
                        }

                        // Show first 3 recipients + count of others
                        const visibleRecipients = allRecipients.slice(0, 3);
                        const remainingCount = allRecipients.length - 3;

                        return (
                          <>
                            {visibleRecipients.map((recipient, index) => (
                              <span key={recipient.email}>
                                {cleanNameDisplay(recipient.name) ||
                                  cleanEmailDisplay(
                                    recipient.email || recipient.address,
                                  )}
                                {index < visibleRecipients.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                            {remainingCount > 0 && (
                              <span key="others">{`, +${remainingCount} others`}</span>
                            )}
                          </>
                        );
                      })()}
                    </p>
                    {(emailData?.bcc?.length || 0) > 0 && (
                      <p className="text-muted-foreground text-sm font-medium dark:text-[#8C8C8C]">
                        Bcc:{" "}
                        {emailData?.bcc?.map((recipient, index) => (
                          <span key={recipient.email || recipient.address}>
                            {cleanNameDisplay(recipient.name) ||
                              cleanEmailDisplay(
                                recipient.email || recipient.address,
                              )}
                            {index < (emailData?.bcc?.length || 0) - 1
                              ? ", "
                              : ""}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div
        className={cn(
          "h-0 overflow-hidden transition-all duration-200",
          !isCollapsed && "h-[1px]",
        )}
      ></div>

      {/* actual mail position */}
      <div
        className={cn(
          "grid overflow-hidden transition-all duration-200",
          isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="h-fit w-full p-0">
            {/* mail main body */}
            {emailData?.html ? (
              <>
                <MailIframe
                  html={emailData?.html}
                  senderEmail={emailData.from.email || emailData.from.address}
                />
              </>
            ) : null}
            {/* mail attachments */}
            {emailData?.attachments && emailData?.attachments.length > 0 ? (
              <div className="mb-4 flex flex-wrap items-center gap-2 pt-4">
                {emailData?.attachments.map((attachment, index) => (
                  <div key={index} className="flex">
                    <button
                      className="flex cursor-pointer items-center gap-1 rounded-[5px] bg-[#FAFAFA] px-1.5 py-1 text-sm font-medium hover:bg-[#F0F0F0] dark:bg-[#262626] dark:hover:bg-[#303030]"
                      onClick={() => openAttachment(attachment)}
                    >
                      {getFileIcon(attachment.filename)}
                      <span className="max-w-[15ch] truncate text-sm text-black dark:text-white">
                        {attachment.filename}
                      </span>{" "}
                      <span className="text-muted-foreground whitespace-nowrap text-sm dark:text-[#929292]">
                        {formatFileSize(attachment.size)}
                      </span>
                    </button>
                    <button
                      onClick={() => downloadAttachment(attachment)}
                      className="flex cursor-pointer items-center gap-1 rounded-[5px] px-1.5 py-1 text-sm"
                    >
                      <HardDriveDownload className="text-muted-foreground dark:text-muted-foreground h-4 w-4 fill-[#FAFAFA] dark:fill-[#262626]" />
                    </button>
                    {index < (emailData?.attachments?.length || 0) - 1 && (
                      <div className="m-auto h-2 w-[1px] bg-[#E0E0E0] dark:bg-[#424242]" />
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <Separator className="my-4" />
            {/* action buttons */}

            <div className="flex gap-2 py-4">
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(false);
                  setMode("reply");
                  setActiveReplyId(emailData.messageId);
                }}
                icon={
                  <Reply className="fill-muted-foreground dark:fill-[#9B9B9B]" />
                }
                text={"Reply"}
                shortcut={isLastEmail ? "r" : undefined}
              />
              {/* <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(false);
                  setMode("replyAll");
                  // setActiveReplyId(emailData.id);
                }}
                icon={
                  <ReplyAll className="fill-muted-foreground dark:fill-[#9B9B9B]" />
                }
                text={"Reply All"}
                shortcut={isLastEmail ? "a" : undefined}
              /> */}
              <ActionButton
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(false);
                  setMode("forward");
                  setActiveReplyId(emailData.messageId);
                }}
                icon={
                  <Forward className="fill-muted-foreground dark:fill-[#9B9B9B]" />
                }
                text={"Forward"}
                shortcut={isLastEmail ? "f" : undefined}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// props
type ActionButtonProps = {
  onClick: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
  text: string;
  shortcut?: string;
};

const ActionButton = ({ onClick, icon, text, shortcut }: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex h-7 items-center justify-center gap-1 overflow-hidden rounded-md border bg-white px-1.5 dark:border-none dark:bg-[#313131]"
    >
      {icon}
      <div className="flex items-center justify-center gap-2.5 pl-0.5 pr-1">
        <div className="justify-start text-sm leading-none text-black dark:text-white">
          {text}
        </div>
      </div>
      {shortcut && (
        <kbd
          className={cn(
            "border-muted-foreground/10 bg-accent h-6 rounded-[6px] border px-1.5 font-mono text-xs leading-6",
            "-me-1 ms-auto hidden max-h-full items-center md:inline-flex",
          )}
        >
          {shortcut}
        </kbd>
      )}
    </button>
  );
};
