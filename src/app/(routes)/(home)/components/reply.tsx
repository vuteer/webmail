import React from "react";
import { v4 as uuidv4 } from "uuid";

import { Info, Paperclip, Send, SquarePen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ImageUploadModal from "@/components/modals/image-upload";

import EditorContainer from "@/components/editor";
import { cn } from "@/lib/utils";

import {generateHTMLStr, removeHtmlTags} from "@/utils/html-string"; 

import {ThreadInfoType} from "@/types"; 
import { sendMail } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";

interface ThreadReplyProps {
  replyRef: React.RefObject<HTMLDivElement>;
  mail_id: string;
  threads: any;
  setThreads: React.Dispatch<any>;
  reply_to: string;
  subject: string;
  threadInfo?: ThreadInfoType;
}

const ThreadReply: React.FC<ThreadReplyProps> = ({
  replyRef,
  mail_id,
  subject,
  threads,
  setThreads,
  reply_to,
  
}) => {
  const [reply, setReply] = React.useState<string>("");
  const [files, setFiles] = React.useState<string[]>([]);
  const [openFileUpload, setOpenFileUpload] = React.useState<boolean>(false);

  const [clearEditor, setClearEditor] = React.useState<boolean>(false); 


  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (replyRef) replyRef.current?.classList.add("translate-y-full")
  }, [mail_id])

  // fix clear editor on send

  const validate = (draft?: boolean) => {
    if (!removeHtmlTags(reply, false)) {
      createToast("error", "Nothing to reply!");
      return;
    }
    setLoading(true);
    let htmlStr = generateHTMLStr(subject, reply);

    let threadItem = {
      messageId: uuidv4(),
      thread: mail_id, 
      html: htmlStr,
      text: removeHtmlTags(reply),
      info: {
        sent: true, 
        draft: draft || false, 
        read: true, 
        archived:  false,
        important:  false,
        starred: false, 
        flag:  false,
        forwarded:  false,
        trashed:  false,
        junk:  false
      },
      attachments: [], 
      createdAt: new Date(),
    };

    console.log(threadItem, reply_to)
    setThreads([...threads, threadItem]);
    return threadItem;
  };

  const handleSendMail = async (draft?: boolean) => {
    let threadItem = validate(draft);
    if (!threadItem) return; 
     

    let res = await sendMail({...threadItem, reply_to});

    if (res) {
      createToast("success", "Reply has been sent.");
      let updatedThreads = [...threads.filter((itm: any) => itm.messageId !== threadItem.messageId), {...threadItem, info: {...threadItem.info, read: true}}]
      setClearEditor(true); 

      setThreads(updatedThreads); 
      replyRef.current?.classList.add("translate-y-full");
    }

    setLoading(false);
  };
 
  return (
    <div
      className={cn("absolute z-10 bottom-3 translate-y-full bg-background w-full  duration-700 left-0 flex flex-col gap-2 p-3 pb-5 my-2 overflow-hidden")}
      ref={replyRef}
    >
      <ImageUploadModal
        files={files}
        setFiles={setFiles}
        isOpen={openFileUpload}
        onClose={() => setOpenFileUpload(false)}
      />
       
        <Separator />

        <Button
          className="hover:text-danger self-end"
          size={"icon"}
          variant={"outline"}
          onClick={() => {
            replyRef.current?.classList.add("translate-y-full");
          }}
        >
          <X size={18}/>
        </Button>
      {/* </div> */}
      <Separator />

      <div className="w-full bg-background">
        <EditorContainer
          setContent={setReply}
          clear={clearEditor}
          setClear={setClearEditor}
        />
      </div>
      <ReplyButtons
        setOpenFileUpload={setOpenFileUpload}
        handleSend={handleSendMail}
        loading={loading}
         
      />
    </div>
  );
};

export default ThreadReply;

// common reply buttons

export const ReplyButtons = ({
  loading,
  setOpenFileUpload,
  handleSend,
}: {
  loading: boolean;
  setOpenFileUpload: React.Dispatch<boolean>;
  handleSend: (draft?: boolean) => Promise<void>;
   
}) => (
  <>
    <Separator />
    <div className="flex justify-end items-center gap-2 w-full my-2">
      {/* <div className="flex gap-3 my-2"> */}
    
        <Button
          variant="outline"
          onClick={() => handleSend(true)}
          className="flex gap-2 items-center hover:text-main rounded-full"
          disabled={loading}
        >
          <SquarePen size={18} /> Save to drafts
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpenFileUpload(true)}
          className="flex gap-2 items-center hover:text-main rounded-full"
          disabled={loading}

        >
          <Paperclip size={18} /> Attach file
        </Button>
      {/* </div> */}
      
      <Button 
        onClick={() => handleSend(false)} 
        disabled={loading}
        className="flex gap-2 items-center hover:text-main rounded-full" variant="outline">
        <Send size={18} /> Send
      </Button>
    </div>
    {/* <Card className="shadow-none border-destructive w-fit p-2 flex items-center gap-2">
      <Info size={18}/>
      <span className="text-sm lg:text-md">When sending a file, use the Attach file button. Do not drag into editor to save on space.</span>
    </Card> */}
  </>
);


