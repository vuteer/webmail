import pluralize from "pluralize";
import { motion, AnimatePresence } from "motion/react";

import { Check, Command, Loader, Paperclip, X as XIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Sparkles, CurvedArrow } from "@/components/icons/icons";
import { cn, formatFileSize } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface BottomActionsProps {
  handleSend: any;
  isLoading: boolean;
  aiIsLoading: boolean;
  subjectInput: any;
  settingsLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleAttachment: any;
  setValue: any;
  attachments: any;
  setHasUnsavedChanges: any;
  aiGeneratedMessage: any;
  setAiGeneratedMessage: any;
  editor: any;
  handleGenerateSubject: any;
  handleAiGenerate: any;
}
export const BottomActions = ({
  handleSend,
  isLoading,
  aiIsLoading,
  subjectInput,
  settingsLoading,
  fileInputRef,
  handleAttachment,
  setValue,
  attachments,
  setHasUnsavedChanges,
  aiGeneratedMessage,
  setAiGeneratedMessage,
  editor,
  handleGenerateSubject,
  handleAiGenerate,
}: BottomActionsProps) => {
  return (
    <>
      {/* Bottom Actions */}
      <div className="inline-flex w-full items-center justify-between self-stretch rounded-b-2xl bg-[#FFFFFF] px-3 py-3 outline-white/5 dark:bg-[#202020]">
        <div className="flex items-center justify-start gap-2">
          <div className="flex items-center justify-start gap-2">
            <button
              className="flex h-7 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-md bg-black pl-1.5 pr-1 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white"
              onClick={handleSend}
              disabled={isLoading || settingsLoading}
            >
              <div className="flex items-center justify-center gap-2.5 pl-0.5">
                <div className="text-center text-sm leading-none text-white dark:text-black">
                  <span>Send </span>
                </div>
              </div>
              <div className="flex h-5 items-center justify-center gap-1 rounded-sm bg-white/10 px-1 dark:bg-black/10">
                <Command className="h-3.5 w-3.5 text-white dark:text-black" />
                <CurvedArrow className="mt-1.5 h-4 w-4 fill-white dark:fill-black" />
              </div>
            </button>
            <button
              className="flex h-7 items-center gap-0.5 overflow-hidden rounded-md border bg-white/5 px-1.5 shadow-sm hover:bg-white/10 dark:border-none"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-3 w-3 fill-[#9A9A9A]" />
              <span className="hidden px-0.5 text-sm md:block">Add</span>
            </button>
            <Input
              type="file"
              id="attachment-input"
              className="hidden"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const fileList: any = event.target.files;
                const allowedList = [];

                if (fileList) {
                  for (let i = 0; i < fileList.length; i++) {
                    const file = fileList[i];
                    console.log(file.size, file.name);
                    if (file.size > 100) allowedList.push(file);
                  }
                }
                handleAttachment(
                  Array.from(fileList),
                  setValue,
                  attachments,
                  setHasUnsavedChanges,
                );
              }}
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              ref={fileInputRef}
              style={{ zIndex: 100 }}
            />
            {attachments && attachments.length > 0 && (
              <Popover modal={true}>
                <PopoverTrigger asChild>
                  <button
                    className="focus-visible:ring-ring flex items-center gap-1.5 rounded-md border border-[#E7E7E7] bg-white/5 px-2 py-1 text-sm hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-[#2B2B2B]"
                    aria-label={`View ${attachments.length} attached ${pluralize("file", attachments.length)}`}
                  >
                    <Paperclip className="h-3.5 w-3.5 text-[#9A9A9A]" />
                    <span className="font-medium">{attachments.length}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[100] w-[340px] rounded-lg p-0 shadow-lg dark:bg-[#202020]"
                  align="start"
                  sideOffset={6}
                >
                  <div className="flex flex-col">
                    <div className="border-b border-[#E7E7E7] p-3 dark:border-[#2B2B2B]">
                      <h4 className="text-sm font-semibold text-black dark:text-white/90">
                        Attachments
                      </h4>
                      <p className="text-muted-foreground text-xs dark:text-[#9B9B9B]">
                        {pluralize("file", attachments.length, true)}
                      </p>
                    </div>
                    <div className="max-h-[250px] flex-1 space-y-0.5 overflow-y-auto p-1.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {attachments.map((file: File, index: number) => {
                        const nameParts = file.name.split(".");
                        const extension =
                          nameParts.length > 1 ? nameParts.pop() : undefined;
                        const nameWithoutExt = nameParts.join(".");
                        const maxNameLength = 22;
                        const truncatedName =
                          nameWithoutExt.length > maxNameLength
                            ? `${nameWithoutExt.slice(0, maxNameLength)}…`
                            : nameWithoutExt;
                        return (
                          <div
                            key={file.name + index}
                            className="group flex items-center justify-between gap-3 rounded-md px-1.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/10"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded bg-[#F0F0F0] dark:bg-[#2C2C2C]">
                                {file.type.startsWith("image/") ? (
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    className="h-full w-full rounded object-cover"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <span className="text-sm" aria-hidden="true">
                                    {file.type.includes("pdf")
                                      ? "📄"
                                      : file.type.includes("excel") ||
                                          file.type.includes("spreadsheetml")
                                        ? "📊"
                                        : file.type.includes("word") ||
                                            file.type.includes(
                                              "wordprocessingml",
                                            )
                                          ? "📝"
                                          : "📎"}
                                  </span>
                                )}
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <p
                                  className="flex items-baseline text-sm text-black dark:text-white/90"
                                  title={file.name}
                                >
                                  <span className="truncate">
                                    {truncatedName}
                                  </span>
                                  {extension && (
                                    <span className="ml-0.5 flex-shrink-0 text-[10px] text-[#8C8C8C] dark:text-[#9A9A9A]">
                                      .{extension}
                                    </span>
                                  )}
                                </p>
                                <p className="text-muted-foreground text-xs dark:text-[#9B9B9B]">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(
                                e: React.MouseEvent<HTMLButtonElement>,
                              ) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const updatedAttachments = attachments.filter(
                                  (_: any, i: number) => i !== index,
                                );
                                setValue("attachments", updatedAttachments, {
                                  shouldDirty: true,
                                });
                                setHasUnsavedChanges(true);
                              }}
                              className="focus-visible:ring-ring ml-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-transparent hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2"
                              aria-label={`Remove ${file.name}`}
                            >
                              <XIcon className="text-muted-foreground h-3.5 w-3.5 hover:text-black dark:text-[#9B9B9B] dark:hover:text-white" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        <div className="flex items-start justify-start gap-2">
          <div className="relative">
            <AnimatePresence>
              {aiGeneratedMessage !== null ? (
                <ContentPreview
                  content={aiGeneratedMessage}
                  onAccept={() => {
                    editor.commands.setContent({
                      type: "doc",
                      content: aiGeneratedMessage
                        .split(/\r?\n/)
                        .map((line: any) => {
                          return {
                            type: "paragraph",
                            content:
                              line.trim().length === 0
                                ? []
                                : [{ type: "text", text: line }],
                          };
                        }),
                    });
                    setAiGeneratedMessage(null);
                  }}
                  onReject={() => {
                    setAiGeneratedMessage(null);
                  }}
                />
              ) : null}
            </AnimatePresence>
            <button
              className="flex h-7 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-md border border-[#8B5CF6] pl-1.5 pr-2 dark:bg-[#252525]"
              onClick={async () => {
                if (!subjectInput.trim()) {
                  await handleGenerateSubject();
                }
                setAiGeneratedMessage(null);
                await handleAiGenerate();
              }}
              disabled={isLoading || aiIsLoading}
            >
              <div className="flex items-center justify-center gap-2.5 pl-0.5">
                <div className="flex h-5 items-center justify-center gap-1 rounded-sm">
                  {aiIsLoading ? (
                    <Loader className="h-3.5 w-3.5 animate-spin fill-black dark:fill-white" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 fill-black dark:fill-white" />
                  )}
                </div>
                <div className="hidden text-center text-sm leading-none text-black md:block dark:text-white">
                  Generate
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const animations = {
  container: {
    initial: { width: 32, opacity: 0 },
    animate: (width: number) => ({
      width: width < 640 ? "200px" : "400px",
      opacity: 1,
      transition: {
        width: { type: "spring", stiffness: 250, damping: 35 },
        opacity: { duration: 0.4 },
      },
    }),
    exit: {
      width: 32,
      opacity: 0,
      transition: {
        width: { type: "spring", stiffness: 250, damping: 35 },
        opacity: { duration: 0.4 },
      },
    },
  },
  content: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.15, duration: 0.4 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  input: {
    initial: { y: 10, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.4 } },
    exit: { y: 10, opacity: 0, transition: { duration: 0.3 } },
  },
  button: {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { delay: 0.4, duration: 0.3 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  },
  card: {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: -10, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
  },
};

const ContentPreview = ({
  content,
  onAccept,
  onReject,
}: {
  content: string;
  onAccept?: (value: string) => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}) => (
  <motion.div
    variants={animations.card}
    initial="initial"
    animate="animate"
    exit="exit"
    className="dark:bg-subtleBlack absolute bottom-full right-0 z-30 w-[400px] overflow-hidden rounded-xl border bg-white p-1 shadow-md"
  >
    <div
      className="max-h-60 min-h-[150px] overflow-y-auto rounded-md p-1 text-sm"
      style={{
        scrollbarGutter: "stable",
      }}
    >
      {content.split("\n").map((line, i) => {
        return (
          <TextEffect
            per="char"
            preset="blur"
            as="div"
            className="whitespace-pre-wrap"
            speedReveal={3}
            key={i}
          >
            {line}
          </TextEffect>
        );
      })}
    </div>
    <div className="flex justify-end gap-2 p-2">
      <button
        className="flex h-7 items-center gap-0.5 overflow-hidden rounded-md border bg-red-700 px-1.5 text-sm shadow-sm hover:bg-red-800 dark:border-none"
        onClick={async () => {
          if (onReject) {
            await onReject();
          }
        }}
      >
        <div className="flex h-5 items-center justify-center gap-1 rounded-sm">
          <XIcon className="h-3.5 w-3.5" />
        </div>
        <span>Reject</span>
      </button>
      <button
        className="flex h-7 items-center gap-0.5 overflow-hidden rounded-md border bg-green-700 px-1.5 text-sm shadow-sm hover:bg-green-800 dark:border-none"
        onClick={async () => {
          if (onAccept) {
            await onAccept(content);
          }
        }}
      >
        <div className="flex h-5 items-center justify-center gap-1 rounded-sm">
          <Check className="h-3.5 w-3.5" />
        </div>
        <span>Accept</span>
      </button>
    </div>
  </motion.div>
);
