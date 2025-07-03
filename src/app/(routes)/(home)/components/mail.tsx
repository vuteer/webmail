// actual mail container
import React from "react";
import parse from "html-react-parser";

import { Paragraph } from "@/components/ui/typography";
import NoMailId from "./no-mail";
import Menu from "../../components/menu";
import Message from "./message";
import { Separator } from "@/components/ui/separator";
import ThreadReply from "./reply";

import { useCustomEffect } from "@/hooks/useEffect";

import { useSearch } from "@/hooks/useSearchParams";
import { getThread, getMails } from "@/lib/api-calls/mails";

import { MailType, ThreadType } from "@/types";

// import { Buttons, Header, MessageButtons } from "./mail-items";
import { ThreadInfoType } from "@/types";
import { MailHeader } from "./thread-items/header";
import { MailDisplay } from "./thread-items/mail-display";

const Mail = ({}) => {
  const queryParams = useSearch();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [thread, setThread] = React.useState<ThreadType>();

  const [threadInfo, setThreadInfo] = React.useState<ThreadInfoType>({
    archived: false,
    important: false,
    junk: false,
    starred: false,
    flag: false,
    trashed: false,
  });
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  const [mailsLoading, setMailsLoading] = React.useState<boolean>(true);
  const [mails, setMails] = React.useState<ThreadType[]>([]);

  const [count, setCount] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(0);
  const [moreLoading, setMoreLoading] = React.useState<boolean>(false);

  const replyRef = React.useRef<HTMLDivElement>(null);

  const threadID = queryParams?.get("threadId") || "";
  // const page = queryParams?.get("thread_p") || "0";
  const sec = queryParams?.get("sec") || "";

  const fetchMails = async () => {
    setMails([]);
    if (!threadID) {
      setMailsLoading(false);
      return;
    }

    setMailsLoading(true);
    let res = await getMails(threadID, page, sec);
    if (res) {
      let docs = res.docs.map((doc: any) => ({
        ...doc,
        html: doc.html ? parse(`${doc.html}`) : null,
      }));
      setThread(res.docs.filter((doc: any) => !doc.inReplyTo)[0]);
      setMails(docs);
    }
    setMailsLoading(false);
  };

  const fetchNextPageMails = async () => {
    if (!page || !threadID) return;
    setMoreLoading(true);
    let res = await getMails(threadID, page, sec);
    if (res) {
      let docs = res.docs.map((doc: any) => ({
        ...doc,
        html: doc.html ? parse(`${doc.html}`) : null,
      }));
      setMails([...docs, ...mails]);
    }
    setMoreLoading(false);
  };

  useCustomEffect(fetchMails, [threadID]);
  useCustomEffect(fetchNextPageMails, [threadID, page]);

  React.useEffect(() => {
    if (loading) return;

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loading]); // Scroll to bottom when content changes

  // functions
  const openReplyComponent = () => {
    replyRef.current?.classList.remove("translate-y-full");
  };

  console.log(thread, mails);

  return (
    <div className="bg-background rounded-xl h-[100vh] relative overflow-hidden flex-1 flex flex-col gap-2 px-4 pt-5">
      <Menu />
      <Separator />
      <div className="flex-1 flex flex-col">
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <Paragraph>Loading...</Paragraph>
          </div>
        )}
        {!loading && !thread && <NoMailId />}
        {!loading && thread && (
          <div className="px-2 space-y-3">
            <MailHeader />
            <Separator />
            <MailDisplay subject={thread.subject} mails={mails} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Mail;
