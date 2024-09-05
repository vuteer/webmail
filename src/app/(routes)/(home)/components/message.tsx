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
import DeleteMessageModal from "@/components/modals/delete-message";
import ForwardMailModal from "@/components/modals/forward-mail";


interface MessageProps extends MailType { };

const Message: React.FC<MessageProps> = ({
    messageId, id, text, html, info,
    createdAt, attachments
}) => { 

    const [mounted, setMounted] = React.useState<boolean>(false);
    const [closed, setClosed] = React.useState<boolean>(true);
    const [iframeHeight, setIframeHeight] = React.useState<number>(0);

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

    console.log(messageId, id, "HANDLE MAIL FORWARDING FROM HERE - LINE 24 message.tsx")
     
    return (
        <>
            <DeleteMessageModal 
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                id={id}
                draft={info.draft}
            />
            <ForwardMailModal 
                isOpen={openForwardModal}
                onClose={() => setOpenForwardModal(false)}
                id={id}
            />
            <div className="w-full flex flex-col gap-2 py-3 my-2">

                <div className="w-full flex justify-end gap-2 items-center py-1">
                    {
                        info.draft && (
                            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-xs lg:text-sm">
                                <Send size={18} /><span>Send</span>
                            </Button>
                        )
                    }
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-2 text-xs lg:text-sm"
                        onClick={() => setOpenDeleteModal(true)}
                    >
                        <Trash2 size={18} /><span>{info.draft ? "Discard" : "Delete"}</span>
                    </Button>
                    {
                        !info.draft && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="flex items-center gap-2 text-xs lg:text-sm"
                                onClick={() => setOpenForwardModal(true)}
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
                    className="my-2 rounded-2xl px-0 py-0 p-0 h-5 flex gap-2 items-center"
                >
                    <MoreHorizontal />
                </Button>
                <Separator />
                <div className="my-3 flex items-center justify-between gap-2">
                    <Paragraph className="text-xs lg:text-xs capitalize font-bold flex gap-2">
                        <span>{info.sent ? "outgoing" : "incoming"} </span>
                        {info.forwarded && <span> | forwarded </span>}
                        {info.draft && <span>| draft </span>}
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
