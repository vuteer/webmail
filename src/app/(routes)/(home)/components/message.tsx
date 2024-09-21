// message component 
import React from "react";
import parse from "html-react-parser";
import { CheckCheck, Copy, FilePenLine, Forward, ForwardIcon, MoreHorizontal, Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import GenerateIcon from "@/components/utils/generate-icon";
import { Heading2, Paragraph } from "@/components/ui/typography";

import { formatDateToString } from "@/utils/dates";
import { AttachmentType, MailType } from "@/types";
import DeleteMessageModal from "@/components/modals/delete-message";
import ForwardMailModal from "@/components/modals/forward-mail";
import { sendDraft } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";


interface MessageProps extends MailType {
    mails: MailType[];
    setMails: React.Dispatch<MailType[]>; 
 };

const Message: React.FC<MessageProps> = ({
    messageId, id, text, html, info,
    createdAt, attachments, mails, setMails
}) => { 

    const [mounted, setMounted] = React.useState<boolean>(false);
    const [closed, setClosed] = React.useState<boolean>(true);
    const [iframeHeight, setIframeHeight] = React.useState<number>(0);

    const [draft, setDraft] = React.useState<boolean>(info.draft || false); 
    const [forwarded, setForwarded] = React.useState<boolean>(info.forwarded || false); 
    const [loading, setLoading] = React.useState<boolean>(false); 

    const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false); 
    const [openForwardModal, setOpenForwardModal] = React.useState<boolean>(false); 

    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    React.useEffect(() => setMounted(true), []);
    React.useEffect(() => {
        if (!mounted) return;

        if (info) setClosed(info.read || false);
    }, [mounted, info]);

    React.useEffect(() => {
        if (!mounted || !html) return;
        // resizeIframe()
        let height = estimateBodyHeight(extractBodyContent(html));
        setIframeHeight(height + 100);
    }, [mounted, closed])

    
    const handleSendingDraft = async () => {
        setLoading(true); 

        let res = await sendDraft(id); 
        if (res) {
            createToast("success", "Draft has been sent!"); 
            setDraft(false); 
        };
        setLoading(false)
    }
    return (
        <>
            <DeleteMessageModal 
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                id={id}
                draft={info.draft}
                mails={mails}
                setMails={setMails}
            />
            <ForwardMailModal 
                isOpen={openForwardModal}
                onClose={() => setOpenForwardModal(false)}
                id={id}
                setForwarded={setForwarded}
            />
            <div className="w-full flex flex-col gap-2 py-3 my-2">

                <div className="w-full flex justify-end gap-2 items-center py-1">
                    {
                        draft && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-2 text-xs lg:text-sm"
                                disabled={loading}
                                onClick={handleSendingDraft}
                            >
                                <Send size={18} /><span>Send</span>
                            </Button>
                        )
                    }
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-xs lg:text-sm"
                        onClick={() => setOpenDeleteModal(true)}
                        disabled={loading}
                    >
                        <Trash2 size={18} /><span>{info.draft ? "Discard" : "Delete"}</span>
                    </Button>
                    {
                        !draft && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-2 text-xs lg:text-sm"
                                onClick={() => setOpenForwardModal(true)}
                                disabled={loading}
                            >
                                <Forward size={18} /><span>Forward</span>
                            </Button>
                        )
                    }
                </div>
                
                {
                    !closed && (
                        <>
                            {html && !html?.toString().startsWith("[object") && (
                                <div className="w-full h-fit">
                                    <iframe
                                        srcDoc={html}
                                        height={iframeHeight}
                                        className="iframe-item w-full"
                                        ref={iframeRef}
                                    />

                                </div>
                            )}
                            {!html && text ? (
                                <Paragraph className="text-sm lg:text-md">
                                    {text}
                                </Paragraph>
                            ) : (
                                <></>
                            )}
                            {
                                html?.toString().startsWith("[object") && !text && (
                                    <Paragraph>Attached file.</Paragraph>
                                )
                            }
                            {attachments && <Attachments files={attachments} />}
                        </>
                    )
                }

                <Button
                    variant={!closed ? "secondary" : "outline"}
                    size={"icon"}
                    onClick={() => setClosed(!closed)}
                    disabled={loading}
                    className="my-2 rounded-2xl px-0 py-0 p-0 h-5 flex gap-2 items-center"
                >
                    <MoreHorizontal />
                </Button>
                <Separator />
                <div className="my-3 flex items-center justify-between gap-2">
                    <Paragraph className="text-xs lg:text-xs capitalize font-bold flex gap-2">
                        <span>{info.sent ? "outgoing" : "incoming"} </span>
                        {forwarded && (
                            <span className="flex gap-2 items-center"> 
                                <span>|</span>  
                                <ForwardIcon size={15}/>
                                <span>Forwarded</span>
                            </span>
                        )}
                        {
                            info.sent && (
                                <span className="flex gap-2 items-center">
                                    <span>|</span> 
                                    {draft ? <FilePenLine size={15}/>: <CheckCheck size={15} className="text-green-500"/>}
                                    {draft ? " draft": "delivered"} 
                                </span>

                            )
                        }
                    </Paragraph>
                    <Paragraph className="text-xs lg:text-xs">{formatDateToString(createdAt)}</Paragraph>
                </div>


                <Separator />
            </div>
        </>
    )
};

export default Message;


const Attachments = ({ files }: { files: AttachmentType[] }) => {

    return (
        <>
            {
                files.length > 0 && (
                    <>
                        <Separator />
                        <Heading2 className="text-sm lg:text-md my-2">{files.length} attachment{files.length === 1 ? "" : "s"}</Heading2>
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
};


function extractBodyContent(htmlString: string) {
    // Create a new DOM parser
    const parser = new DOMParser();

    // Parse the HTML string into a document
    const doc = parser.parseFromString(htmlString, 'text/html');

    // Get the <body> element
    const bodyElement = doc.body;

    // Serialize the <body> element back to a string
    const bodyContent = new XMLSerializer().serializeToString(bodyElement);

    return bodyContent;
}


function estimateBodyHeight(htmlString: string) {
    // Create a temporary container to hold the HTML content
    const container = document.createElement('div');

    // Apply styles to make the container invisible but still measure its size
    container.style.position = 'absolute';
    container.style.visibility = 'hidden';
    container.style.width = '100%';  // Ensure it spans the full width
    container.style.height = 'auto'; // Allow it to grow as needed
    container.style.overflow = 'hidden'; // Hide overflow
    container.style.top = '-9999px'; // Move it off-screen

    // Set the HTML content of the container
    container.innerHTML = htmlString;

    // Append the container to the body
    document.body.appendChild(container);

    // Get the height of the container
    const height = container.offsetHeight;

    // Remove the container from the body
    document.body.removeChild(container);

    return height;
}
