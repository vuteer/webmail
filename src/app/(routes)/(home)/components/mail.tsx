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

import { Buttons, Header, MessageButtons } from "./mail-items";
import {ThreadInfoType} from "@/types"; 
 
 

const Mail = ({}) => {
    const queryParams = useSearch(); 
    const [loading, setLoading] = React.useState<boolean>(true); 
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
    const [mails, setMails] = React.useState<MailType[]>([]); 

    const [count, setCount] = React.useState<number>(0); 
    const [page, setPage] = React.useState<number>(0); 
    const [moreLoading, setMoreLoading] = React.useState<boolean>(false); 

    const replyRef = React.useRef<HTMLDivElement>(null);

    const threadID = queryParams?.get("threadId") || ""; 
    // const page = queryParams?.get("thread_p") || "0";
    const sec = queryParams?.get("sec") || "";

    const fetchThread = async () => {
        if (!threadID) {
            setThread(undefined);
            setLoading(false);
            return
        }; 
        setLoading(true); 

        let res = await getThread(threadID);

        
        if (res) {
             
            setThread({...res.doc, info: null});
            setCount(res.count); 
            setThreadInfo(res.doc.info)
        }
 
        setTimeout(() => {setLoading(false)}, 2000)
    }; 

    const fetchMails = async () => {
        setMails([]); 
        if (!threadID) {
            setMailsLoading(false);
            return
        }; 

        setMailsLoading(true); 
        let res = await getMails(threadID, page); 
        if (res) {
            let docs = res.docs.map((doc: any) => ({
                ...doc, html: doc.html ? parse(`${doc.html}`): null
            }));
            setMails(docs); 
        }
        setMailsLoading(false); 
    }

    const fetchNextPageMails = async () => {
        if (!page || !threadID) return; 
        setMoreLoading(true)
        let res = await getMails(threadID, page); 
        if (res) {
            let docs = res.docs.map((doc: any) => ({
                ...doc, html: doc.html ? parse(`${doc.html}`): null
            }));
            setMails([...docs, ...mails])
        }
        setMoreLoading(false)
    }

    useCustomEffect(fetchThread, [threadID])
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
    }

    console.log(thread)

    return (
        <div className=" h-[100vh] relative overflow-hidden flex-1 flex flex-col gap-2 ">
            <Menu />
            <Separator />
            <div className="flex-1 flex flex-col">
                {loading && (
                    <div className="w-full h-full flex items-center justify-center">
                        <Paragraph>Loading...</Paragraph>
                    </div>
                )}
                {
                    !loading && !thread && (
                        <NoMailId />
                    )
                }
                {
                    !loading && thread && (
                        <div className="px-2">
                            <Buttons 
                                reply={openReplyComponent}
                                thread={thread.id}
                                threadInfo={threadInfo}
                                setThreadInfo={setThreadInfo}
                            />
                            <Separator />
                            <Header 
                                thread={thread} 
                                count={count + 1}
                            />
                            <Separator />

                            <div 
                                ref={scrollRef}
                                className="h-[70vh] pb-[5rem] overflow-scroll"
                            >
                                {
                                    count > (Number(page + 1) * 10) && (
                                        <>
                                            <div className="w-full flex items-center justify-center py-2">
                                                <span
                                                    className="font-bold cursor-pointer hover:text-main-color text-xs lg:text-sm"
                                                    onClick={() => {
                                                        let curr = page; 
                                                        setPage(curr + 1)
                                                    }}
                                                >Load{moreLoading ? "ing": " more"}...</span>
                                            </div>
                                            <Separator />

                                        </>
                                    )
                                }
                                {
                                    !mailsLoading && (
                                        <>
                                            {
                                                mails.map((mail, index) => (
                                                    <Message 
                                                        key={index}
                                                        messageId={mail.messageId}
                                                        id={mail.id}
                                                        text={mail.text}
                                                        html={mail.html}
                                                        info={mail.info}
                                                        createdAt={mail.createdAt}
                                                        attachments={mail.attachments}
                                                        mails={mails}
                                                        setMails={setMails}
                                                    />
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </div>
                            
                            {
                                sec !== "trash" && (
                                    <MessageButtons 
                                        thread={threadID} 
                                        reply={openReplyComponent} 
                                        threadInfo={threadInfo}
                                        setThreadInfo={setThreadInfo}
                                    />
                                )
                            }
                        </div>
                    )
                }
            </div>
 
            {/* reply */}
            {
                thread && sec !== "trash" && (
                    <ThreadReply 
                       replyRef={replyRef}
                       mail_id={threadID}
                       reply_to={thread?.from.email}
                        subject={thread.subject}
                        threads={mails}
                        setThreads={setMails}
                        scrollRef={scrollRef}
                    />

                )
            }
        </div>
    )
};

export default Mail; 







 



