// sort popover 
"use client"; 
import React from "react";

import {  EllipsisVertical } from "lucide-react";
import {Paragraph} from "@/components/ui/typography";

import PopoverContainer from "./container";
import {AppLinkButton} from "@/components";

import {ThreadInfoType} from "@/types"; 
import { deleteThread } from "@/lib/api-calls/mails";
import { createToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearchParams";
import { Button } from "../ui/button";
import Confirm from "../modals/confirm";
import { useMailStoreState } from "@/stores/mail-store";

type UpdateType = "important" | "archived" | "junk" | "starred" | "trashed" | "flag"; 
const ThreadPopover = (
    {
        thread, threadInfo, 
        setThreadInfo, handleOpenUpdateThread, 
        setChanged, setTitle, setMessage, setOpenConfirmModal
    }: 
    {
        thread: string,
        threadInfo: ThreadInfoType,
        setThreadInfo: React.Dispatch<ThreadInfoType>,
        handleOpenUpdateThread: (
            type: UpdateType, value: boolean,
            setTitle: React.Dispatch<string>, 
            setMessage: React.Dispatch<string>,
            setOpenConfirmModal: React.Dispatch<boolean>
        ) => void, 
        setChanged: React.Dispatch<any>; 
        setTitle: React.Dispatch<string>; 
        setMessage: React.Dispatch<string>; 
        setOpenConfirmModal: React.Dispatch<boolean>; 
        // setLoading: React.Dispatch<boolean>; 
    }
) => {

    const [loading, setLoading] = React.useState<boolean>(false); 
    const [openDeleteForeverModal, setOpenDeleteForeverModal] = React.useState<boolean>(false); 

    const {push} = useRouter(); 
    const searchParams = useSearch(); 

    const sec = searchParams?.get("sec"); 

    const { addDeletedThreads } = useMailStoreState(); 

    let list = ["flag", "starred"]; 
    list.push(threadInfo.trashed ? "Delete forever": "Delete")
    if (threadInfo.trashed) list.push("Recover from trash"); 

    const handleDelete = async () => {
        setLoading(true); 

        let res = await deleteThread(thread); 
        if (res) {
            createToast("success", "Thread was delete successfully!");
            // push deleted thread to zustand state so as to filter
            if (threadInfo.trashed) addDeletedThreads(thread)
            push(`/?sec=${sec}`); 
        };

        setLoading(false); 
    }
    return (
        <>
            <Confirm
                title="Delete thread forever"
                description="The thread will be deleted forever. Do you wish to proceed with the action? Remember it is not reversible."
                isOpen={openDeleteForeverModal}
                onClose={() => setOpenDeleteForeverModal(false)}
            >
                <div className="flex w-full justify-end">
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Proceed
                    </Button>
                </div>
            </Confirm>
            <PopoverContainer
                contentClassName="w-[200px] absolute  -right-5"
                trigger={
                    <AppLinkButton
                        type="ghost"
                        size="sm"
                    >
                        <EllipsisVertical size={18}/>
                    </AppLinkButton>
                }
            >

                <div className="flex flex-col gap-2">
                    {
                        list.map((item: string, index: number) => {
                            let title: UpdateType = item === "flag" ? "flag": item === "starred" ? "starred": "trashed"; 
                            let val: boolean = !threadInfo[title]
                            
                            
                            return (
                                <Paragraph 
                                    key={index} 
                                    className="duration-700 cursor-pointer hover:text-main-color flex items-center gap-2"
                                    onClick={() => {
                                        setChanged({[title]: val}); 

                                        if (item === "Delete forever") setOpenDeleteForeverModal(true); 
                                        else handleOpenUpdateThread(title, val, setTitle, setMessage, setOpenConfirmModal); 
                                    }}
                                >
                                    <span className={"text-xs lg:text-sm"}>{item === "Delete" || item === "Delete forever" || item === "Recover from trash"? "": threadInfo[title] ? "Remove from": "Add to"} {item === "flag" ? "flagged": item}</span>
                                </Paragraph>
                        )})
                    }
                </div>
            </PopoverContainer>
        </>
    )
};

export default ThreadPopover; 