// message component 
import React from "react";
import parse from "html-react-parser";
import { Copy, Forward, MoreHorizontal, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GenerateIcon from "@/components/utils/generate-icon";
import { Heading2, Paragraph } from "@/components/ui/typography";

import { formatDateToString } from "@/utils/dates";
import { AttachmentType, MailType } from "@/types";


interface MessageProps extends MailType {}; 


const Message: React.FC<MessageProps> = ({
    messageId, id, text, html, info, 
    createdAt, attachments
}) => {

    const [mounted, setMounted] = React.useState<boolean>(false); 
    const [closed, setClosed] = React.useState<boolean>(true); 

    React.useEffect(() => setMounted(true), []); 
    React.useEffect(() => {
        if (!mounted) return; 

        if (info) setClosed(info.read || false); 
    }, [mounted, info]);

    console.log( messageId, id, "HANDLE MAIL FORWARDING FROM HERE - LINE 24 message.tsx")
    return (
        <div className="w-full flex flex-col gap-2 py-3 my-2">
             
            <div className="w-full flex justify-end items-center py-1">
                {
                    info.draft && (
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs lg:text-sm">
                                <Send size={18}/><span>Send</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs lg:text-sm">
                                <Trash2 size={18}/><span>Discard</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs lg:text-sm">
                                <Copy size={18}/><span>Copy</span>
                            </Button>
                        </div>
                    )
                }
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs lg:text-sm">
                    <Forward size={18}/><span>Forward</span>
                </Button>
            </div>
            {
                !closed && (
                    <>
                        {html && (
                            <iframe
                                srcDoc={html}
                                height={html.length > 3900 ? 700 : 300}
                                
                            />
                        )}
                        {!html && text ? (
                            <Paragraph className="text-sm lg:text-md">
                                {text}
                            </Paragraph>
                        ) : (
                            <></>
                        )}
                        {attachments && <Attachments files={attachments}/>}     
                    </>
                )
            }

            <Button
                variant={!closed ? "secondary": "outline"}
                size={"icon"}
                onClick={() => setClosed(!closed)}
                className="my-2 rounded-2xl px-0 py-0 p-0 h-5 flex gap-2 items-center"
            >
                <MoreHorizontal />
            </Button>
            <Separator />
            <div className="my-3 flex items-center justify-between gap-2">
                <Paragraph className="text-xs lg:text-xs capitalize font-bold flex gap-2">
                    <span>{info.sent ? "outgoing": "incoming"} </span>
                    {info.forwarded && <span> | forwarded </span>}
                    {info.draft && <span>| draft </span>}
                </Paragraph>
                <Paragraph className="text-xs lg:text-xs">{formatDateToString(createdAt)}</Paragraph>
            </div>


            <Separator />
        </div>
    )
};

export default Message; 


const Attachments = ({files}: {files: AttachmentType[]}) => {

    return (
        <>
            {
                files.length > 0 && (
                    <>
                        <Separator />
                        <Heading2 className="text-sm lg:text-md my-2">{files.length} attachment{files.length === 1 ? "": "s"}</Heading2>
                        <div className="my-2 flex flex-wrap items-center gap-2">
                            {
                                files.map((file, index) => (
                                    <GenerateIcon 
                                        {...file}
                                        key={index}
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