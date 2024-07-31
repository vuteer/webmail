// mail components
import React from "react"; 
import { useRouter } from "next/navigation";
import { 
    Archive, ArrowLeft, File, Info, Printer, 
    Reply, Star, Trash2 
} from "lucide-react";

import { AppAvatar } from "@/components";
import { Button } from "@/components/ui/button";
import { Heading1, Heading3, Paragraph } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import ThreadPopover from "@/components/popovers/thread-more";

import { ContactType, ThreadType } from "@/types";
import { useSearch } from "@/hooks/useSearchParams";
import { formatDateToString } from "@/utils/dates";
import Confirm from "@/components/modals/confirm";
import { createToast } from "@/utils/toast";
import { updateThread } from "@/lib/api-calls/mails";

import {ThreadInfoType} from "@/types"; 
import { saveContact } from "@/lib/api-calls/contacts";

// update thread 
const handleUpdateThread = async (
    threadID: string, 
    threadInfo: ThreadInfoType, 
    changed: any, 
    setThreadInfo: React.Dispatch<ThreadInfoType>,
    setChanged: React.Dispatch<any>,
    setOpenConfirmModal: React.Dispatch<boolean>, 
    setLoading: React.Dispatch<boolean>,
    push: (str: string) => void
) => {
    if (!threadID) return; 
    let newInfo = {...threadInfo, ...changed}; 
  
    let title: any = Object.keys(changed); 
    title = title[0]; 
    setLoading(true)
    // handle server update here 
    let res = await updateThread(threadID, changed); 

    if (res) {
        createToast("success", `Mail ${changed[title] ? "moved to": "removed from"} ${title}`)
        setChanged(undefined); 
        setThreadInfo(newInfo); 
        setOpenConfirmModal(false);

        if (title === "trashed") push(changed[title] ? "/?sec=trash": "/?sec=inbox")

    }

    setLoading(false)
}

// open update thread modal
const handleOpenUpdateThread = (
    type: "important" | "archived" | "junk" | "starred" | "trashed" | "flag",
    value: boolean,
    setTitle: React.Dispatch<string>,
    setMessage: React.Dispatch<string>,
    setOpenConfirmModal: React.Dispatch<boolean>
) => {
    let titleVal = type === "trashed" ? "Delete thread": `Mark as ${type}`; 
    let messageVal = `Would you like to ${value ? "move mail to": "remove mail from"} ${type === "flag" ? "flagged": type}`; 

    setTitle(titleVal);
    setMessage(messageVal); 

    setOpenConfirmModal(true); 
}

// buttons 
export const Buttons = (
    {reply, thread, threadInfo, setThreadInfo}: 
    {
        reply: () => void, 
        thread: string,  
        threadInfo: ThreadInfoType,
        setThreadInfo: React.Dispatch<ThreadInfoType>
    }
) => {
     
    const {push} = useRouter(); 
    const searchParams = useSearch(); 

    const threadID = searchParams?.get("threadId"); 
    const sec = searchParams?.get("sec"); 

    const [loading, setLoading] = React.useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = React.useState<boolean>(false); 
    const [message, setMessage] = React.useState<string>(""); 
    const [title, setTitle] = React.useState<string>(""); 
    const [changed, setChanged] = React.useState<any>(); 

  
    return (
        <div className="flex justify-between py-2">
            <Confirm
                title={title}
                description={message}
                isOpen={openConfirmModal}
                onClose={() => {
                    setOpenConfirmModal(false);
                    setTitle("");
                    setMessage(""); 
                    setChanged(undefined); 
                }}
            >
                <div className="flex justify-end w-full">
                    <Button 
                        onClick={() => threadID && handleUpdateThread(
                            threadID, 
                            threadInfo,
                            changed, 
                            setThreadInfo,
                            setChanged,
                            setOpenConfirmModal, 
                            setLoading,
                            push
                        )} 
                        disabled={loading}
                    >
                        Proceed
                    </Button>
                </div>
            </Confirm>
            <div className="flex gap-2 items-center">
                <ButtonIcon 
                    icon={<ArrowLeft size={18}/>}
                    onClick={() => {
                        push(`/?sec=${sec}`)
                    }}
                />
                <ButtonIcon 
                    icon={<Archive size={18}/>}
                    type={threadInfo.archived ? "secondary": "ghost"}
                    onClick={() => {
                        setChanged({archived: !threadInfo.archived})
                        handleOpenUpdateThread("archived", !threadInfo.archived, setTitle, setMessage, setOpenConfirmModal);
                        
                    }}
                />
                <ButtonIcon 
                    icon={<Info size={18}/>}
                    type={threadInfo.important ? "secondary": "ghost"}
                    onClick={() => {
                        setChanged({important: !threadInfo.important}); 
                        handleOpenUpdateThread("important", !threadInfo.important, setTitle, setMessage, setOpenConfirmModal)
                    }}
                />

                
            </div>
            
            <div className="flex items-center gap-2">
                <ButtonIcon 
                    icon={<Reply size={18}/>}
                    onClick={reply}
                />
                <ThreadPopover 
                    thread={thread} 
                    threadInfo={threadInfo}
                    setThreadInfo={setThreadInfo}
                    setChanged={setChanged}
                    handleOpenUpdateThread={handleOpenUpdateThread}
                    setTitle={setTitle}
                    setMessage={setMessage}
                    setOpenConfirmModal={setOpenConfirmModal}
                />
            </div>
        </div>
    )
}


// button icon 

const ButtonIcon = (
    {icon, onClick, text, type, disabled}: 
    {
        icon: React.ReactNode, 
        onClick?: () => void, 
        text?: string, 
        type?: any, 
        disabled?: boolean
    }) => (
    <Button 
        disabled={disabled} 
        variant={type || "ghost"} 
        size={text ? "default": "icon"} 
        onClick={onClick} 
        className="flex gap-2 items-center"
    >
        {icon}
        {text && <span>{text}</span>}
    </Button>
);

// header
export const Header = (
    {thread}: 
    {thread: ThreadType}
) => {
    const [loading, setLoading] = React.useState<boolean>(false); 
    const [from, setFrom] = React.useState<ContactType>(thread.from); 
    const [openSaveModal, setOpenSaveModal] = React.useState<boolean>(false); 

    console.log("PUSH SAVED CONTACT TO ZUSTAND STATE - LINE 211 MAIL-ITEMS.TS")
    const handleSaveContact = async () => {
        setLoading(true); 
        let res = await saveContact({email: from.email, name: from.name}); 

        if (res){
            createToast("success", "Contact has been saved!"); 
            setFrom({...from, saved: true});
            setOpenSaveModal(false)
        }; 

        setLoading(false); 
    }
    return (
        <>
            <Confirm
                title={`Save ${from.name} to your contacts`}
                description={"The contact will be saved in your contacts, making it easy to send mail to them."}
                isOpen={openSaveModal}
                onClose={() => setOpenSaveModal(false)}
            >
                <div className="flex w-full justify-end">
                    <Button onClick={handleSaveContact} disabled={loading}>
                        Save
                    </Button>
                </div>
            </Confirm>
            <div className="py-4 flex justify-between items-end">
                <div className="flex gap-2 items-center">
                    <AppAvatar 
                        src={from.avatar}
                        name={from.name}
                        dimension="w-10 h-10"
                    />
                    <div>
                        <Heading3 className="text-sm lg:text-md ">{from.name}</Heading3>
                        <Paragraph className="text-xs lg:text-sm text-gray-500">{from.email}</Paragraph>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {
                        !from.saved && (
                            <Button 
                                className="flex items-center gap-2 text-xs" 
                                size="sm"
                                onClick={() => setOpenSaveModal(true)}
                            >
                                <File size={17}/> Save Contact
                            </Button>
                        )
                    }
                    <Paragraph>{formatDateToString(thread.createdAt)}</Paragraph>
                </div>
            </div>
            <Heading1 className="text-md lg:text-lg my-2">{thread.subject}</Heading1>

        </>
)};


// message buttons 
export const MessageButtons = ({thread, reply, threadInfo, setThreadInfo}: 
    {
        thread: string, 
        reply: () => void, 
        threadInfo: ThreadInfoType,
        setThreadInfo: React.Dispatch<ThreadInfoType>
    }
) => {
    const {push} = useRouter(); 

    const [loading, setLoading] = React.useState<boolean>(false);
    const [openConfirmModal, setOpenConfirmModal] = React.useState<boolean>(false); 
    const [message, setMessage] = React.useState<string>(""); 
    const [title, setTitle] = React.useState<string>(""); 
    const [changed, setChanged] = React.useState<any>(); 

    return (
        <>
            <Confirm
                title={title}
                description={message}
                isOpen={openConfirmModal}
                onClose={() => {
                    setOpenConfirmModal(false);
                    setTitle("");
                    setMessage(""); 
                    setChanged(undefined); 
                }}
            >
                <div className="flex justify-end w-full">
                    <Button 
                        onClick={() => handleUpdateThread(
                            thread, 
                            threadInfo,
                            changed, 
                            setThreadInfo,
                            setChanged,
                            setOpenConfirmModal, 
                            setLoading,
                            push
                        )} 
                        disabled={loading}>
                        Proceed
                    </Button>
                </div>
            </Confirm>
            <Separator />
            <div className="px-2 w-full bg-background absolute bottom-0 left-0 z-10 py-2 pb-8 flex items-center justify-between">

                <div className="flex gap-2 items-center">
                    <ButtonIcon 
                        icon={<Reply size={18}/>}
                        text="Reply"
                        onClick={reply}
                    />
                    <ButtonIcon 
                        icon={<Printer size={18}/>}
                        text="Print"
                    />
                </div>
                {
                    !threadInfo.trashed && (
                        <div className="flex gap-2 items-center">
                            <ButtonIcon 
                                icon={threadInfo.starred ? <Star size={18} color="gold"/>: <Star size={18}/>}
                                text={threadInfo.starred ? "Starred": "Star"}
                                onClick={() => {
                                    setChanged({starred: !threadInfo.starred})
                                    handleOpenUpdateThread(
                                    "starred", !threadInfo.starred, setTitle, 
                                    setMessage, setOpenConfirmModal
                                )}}
                            />
                                    <ButtonIcon 
                                        icon={<Trash2 size={18}/>}
                                        text="Delete"
                                        onClick={() => {
                                            setChanged({trashed: !threadInfo.trashed})
                                            handleOpenUpdateThread(
                                            "trashed", !threadInfo.trashed, setTitle, 
                                            setMessage, setOpenConfirmModal
                                        )}}
                                    />

                        </div>
                    )
                }
            </div>
        </>
    )
}