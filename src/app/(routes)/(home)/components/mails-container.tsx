// actual mail container
import React from "react";
import parse from "html-react-parser";
import { useQueryState } from "nuqs";

import { Paragraph } from "@/components/ui/typography";
import NoMailId from "./no-mail";
import Menu from "../../components/menu";
import { Separator } from "@/components/ui/separator";

import { useCustomEffect } from "@/hooks/useEffect";

import { ThreadType } from "@/types";

import { MailHeader } from "./thread-items/header";
import { MailDisplay } from "./thread-items/mail-display";
import { ReplyCompose } from "./thread-items/reply-compose";
import { useThreadStore } from "@/stores/threads";
import useMounted from "@/hooks/useMounted";
import { useMailStoreState } from "@/stores/mail-store";
import { cn } from "@/lib/utils";

const Mail = ({}) => {
  const { threads } = useThreadStore();
  const { mailsLoading, fetchThreads } = useMailStoreState();
  const mounted = useMounted();

  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [thread, setThread] = React.useState<ThreadType | null>(null);
  const [page, setPage] = React.useState<number>(0);

  const [mode] = useQueryState("mode");
  const [activeReplyId] = useQueryState("activeReplyId");
  const [threadId] = useQueryState("threadId");
  const [sec] = useQueryState("sec");

  let thrd = threads.find((t) => t.messageId === threadId);
  useCustomEffect(() => {
    if (!mounted || !thrd) return;
    if (thrd) setThread(thrd);
  }, [thrd, mounted]);

  useCustomEffect(() => {
    if (!mounted || !threadId) return;

    fetchThreads(threadId, page, sec || "inbox");
  }, [threadId, mounted]);

  React.useEffect(() => {
    if (mailsLoading) return;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mailsLoading]); // Scroll to bottom when content changes

  return (
    <div
      className={cn(
        "bg-background rounded-xl h-screen relative overflow-hidden flex-1 flex flex-col gap-2 px-1 lg:px-4 pt-5",
        threadId ? "flex" : "lg:flex hidden",
      )}
    >
      <Menu />
      <Separator />
      <div className="flex-1 flex flex-col ">
        {mailsLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <Paragraph>Loading...</Paragraph>
          </div>
        )}
        {!mailsLoading && (
          <>
            {!threadId && <NoMailId />}
            {threadId && thread && (
              <div className="px-2 space-y-3 flex flex-col h-full">
                <MailHeader threadId={threadId || ""} />
                <Separator />
                <MailDisplay subject={thread.subject} />
                {/* Sticky Reply Compose at Bottom - Only for last message */}
                {mode && (
                  <div
                    className="border-border bg-background sticky bottom-2 z-10  mb-4 py-2"
                    id={`reply-composer-${activeReplyId}`}
                  >
                    <ReplyCompose />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Mail;
