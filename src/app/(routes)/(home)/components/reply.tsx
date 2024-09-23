import React from "react";
import { v4 as uuidv4 } from "uuid";

import { ChevronsUpDown, Info, Paperclip, Send, SquarePen, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ImageUploadModal from "@/components/modals/image-upload";

import EditorContainer from "@/components/editor";
import { cn } from "@/lib/utils";

import { generateHTMLStr, removeHtmlTags } from "@/utils/html-string";

import { AttachmentType, FileType, ThreadInfoType } from "@/types";
import { sendMail } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";
import GenerateIcon from "@/components/utils/generate-icon";
import { Heading3 } from "@/components/ui/typography";

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
  const [files, setFiles] = React.useState<AttachmentType[]>([]);
  const [openFileUpload, setOpenFileUpload] = React.useState<boolean>(false);
  const [height, setHeight] = React.useState<string>("h-[30vh]")

  const [clearEditor, setClearEditor] = React.useState<boolean>(false);

  const [sLoading, setSLoading] = React.useState<boolean>(false);
  const [dLoading, setDLoading] = React.useState<boolean>(false); 

  React.useEffect(() => {
    if (replyRef) replyRef.current?.classList.add("translate-y-full")
    setFiles([])
  }, [mail_id])

  const validate = (draft?: boolean) => {
    if (!removeHtmlTags(reply, false)) {
      createToast("error", "Nothing to reply!");
      return;
    }
    if (draft) setDLoading(true);
    else setSLoading(true);

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
        archived: false,
        important: false,
        starred: false,
        flag: false,
        forwarded: false,
        trashed: false,
        junk: false
      },
      attachments: files,
      createdAt: new Date(),
    };

    setThreads([...threads, threadItem]);
    return threadItem;
  };

  const handleSendMail = async (draft?: boolean) => {
    let threadItem = validate(draft);
    if (!threadItem) return;


    let res = await sendMail({ ...threadItem, reply_to });
     
    if (res) {
      createToast("success", draft ? "Mail saved to drafts" :"Reply has been sent.");
      let updatedThreads = [...threads.filter((itm: any) => itm.messageId !== threadItem.messageId), { ...threadItem, id: res, info: { ...threadItem.info, read: true } }]
      setClearEditor(true);

      setThreads(updatedThreads);
      replyRef.current?.classList.add("translate-y-full");
    }

    if (draft) setDLoading(false);
    else setSLoading(false); 
  };

  return (
    <div
      className={cn("absolute z-10 bottom-3 translate-y-full bg-background w-full  duration-700 left-0 flex flex-col gap-2 p-3 my-2 overflow-hidden")}
      ref={replyRef}
    >
      <ImageUploadModal
        files={files}
        setFiles={setFiles}
        isOpen={openFileUpload}
        onClose={() => setOpenFileUpload(false)}
      />

      <Separator />

      <div className="flex gap-2 justify-end">
        <Button
          variant="ghost"
          size={"icon"}
          onClick={() => {
            if (height === "h-[30vh]") setHeight("h-[50vh]")
            else setHeight("h-[30vh]");
          }}
          disabled={sLoading || dLoading}
        >
          <ChevronsUpDown size={18} />
        </Button>

        <Button
          className="hover:text-danger"
          size={"icon"}
          variant={"outline"}
          onClick={() => {
            replyRef.current?.classList.add("translate-y-full");
          }}
          disabled={sLoading || dLoading}
        >
          <X size={18} />
        </Button>
      </div>
      {/* </div> */}
      <Separator />

      <div className="w-full bg-background">
        <EditorContainer
          setContent={setReply}
          clear={clearEditor}
          setClear={setClearEditor}
          height={height}
        />
      </div>

      <Attachments files={files} />
      <ReplyButtons
        setOpenFileUpload={setOpenFileUpload}
        handleSend={handleSendMail}
        sLoading={sLoading}
        dLoading={dLoading}
      />
    </div>
  );
};

export default ThreadReply;

// common reply buttons

export const ReplyButtons = ({
  sLoading,
  dLoading, 
  setOpenFileUpload,
  handleSend,
}: {
  sLoading: boolean;
  dLoading: boolean; 
  setOpenFileUpload: React.Dispatch<boolean>;
  handleSend: (draft?: boolean) => Promise<void>;

}) => (
  <>
    <Separator />
    <div className="flex justify-end items-center gap-2 w-full my-2">
      <Button
        variant="outline"
        onClick={() => setOpenFileUpload(true)}
        className="flex gap-2 items-center hover:text-main rounded-full min-w-[120px]"
        disabled={dLoading || sLoading}
      >
        <Paperclip size={18} /> Attachment
      </Button>
      <Button
        variant="outline"
        onClick={() => handleSend(true)}
        className="flex gap-2 items-center hover:text-main rounded-full min-w-[120px]"
        disabled={dLoading || sLoading}
      >
        <SquarePen size={18} /> Sav{dLoading ? "ing...":"e"}
      </Button>
      <Button
        onClick={() => handleSend(false)}
        disabled={dLoading || sLoading}
        className="flex gap-2 items-center hover:text-main rounded-full min-w-[120px]" variant="outline">
        <Send size={18} /> Send{sLoading ? "ing...": ""}
      </Button>
    </div>
  </>
);


// attachments
export const Attachments = ({ files }: { files: AttachmentType[] }) => {

  return (
    <>
      {
        files.length > 0 && (
          <>
            <Separator />
            <Heading3 className="text-xs lg:text-sm font-bold my-2">Attachments</Heading3>
            <div className="py-2 flex items-center gap-2">
              {
                files.map((file: AttachmentType, index: number) => (
                  <GenerateIcon
                    key={index}
                    id={file.id}
                    type={file.type}
                    size={file.size}
                    title={file.title}
                    onRemove={(fileId: string) => {}}
                  />
                ))
              }
            </div>
          </>
        )
      }
    </>
  )
}

