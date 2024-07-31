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

    const [mailsLoading, setMailsLoading] = React.useState<boolean>(true); 
    const [mails, setMails] = React.useState<MailType[]>([]); 
    const [count, setCount] = React.useState<number>(0); 

    const replyRef = React.useRef<HTMLDivElement>(null);

    const threadID = queryParams?.get("threadId") || ""; 
    const page = queryParams?.get("thread_p") || "0";
    

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

    useCustomEffect(fetchThread, [threadID])
    useCustomEffect(fetchMails, [threadID]);


    // functions 
    const openReplyComponent = () => {
        replyRef.current?.classList.remove("translate-y-full");
    }

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
                            />
                            <Separator />

                            <div className="h-[70vh] pb-[5rem] overflow-scroll">
                                {
                                    !mailsLoading && (
                                        <>
                                            {
                                                mails.map((mail, index) => (
                                                    <Message {...mail} key={index}/>
                                                ))
                                            }
                                        </>
                                    )
                                }
                            </div>

                            <MessageButtons 
                                thread={threadID} 
                                reply={openReplyComponent} 
                                threadInfo={threadInfo}
                                setThreadInfo={setThreadInfo}
                            />
                        </div>
                    )
                }
            </div>
 
            {/* reply */}
            {
                thread && (
                    <ThreadReply 
                       replyRef={replyRef}
                       mail_id={threadID}
                       reply_to={thread?.from.email}
                        subject={thread.subject}
                        threads={mails}
                        setThreads={setMails}
                    />

                )
            }
        </div>
    )
};

export default Mail; 







 



