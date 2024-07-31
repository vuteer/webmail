// threads 
import React from "react";
import {useRouter} from "next/navigation";
import { Trash2, Search, RefreshCcw } from "lucide-react";

import AppInput from "@/components/common/app-input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Heading1, Paragraph } from "@/components/ui/typography";
import Thread, { ThreadPlaceholder } from "./thread";
import SortPopover from "@/components/popovers/sort-mail"; 
import Confirm from "@/components/modals/confirm"; 

import { useCustomEffect } from "@/hooks/useEffect";
import { useSearch } from "@/hooks/useSearchParams";

import { createArray, numberWithCommas } from "@/utils/format-numbers";
import { createToast } from "@/utils/toast";
import { ThreadType } from "@/types";
import { deleteSelected, getThreads, markAsRead, searchThroughMail } from '@/lib/api-calls/mails';
import { cn } from '@/lib/utils';
import { useMailNumbersStore } from "@/stores/mail-numbers";

const Threads = ({title}: {title: string}) => {
    const [mounted, setMounted] = React.useState<boolean>(false); 
    const [loading, setLoading] = React.useState<boolean>(true); 
    const [threads, setThreads] = React.useState<ThreadType[]>([]); 
    const [count, setCount] = React.useState<number>(0); 
    
    const [openDeleteModal, setOpenDeleteModal] = React.useState<boolean>(false); 
    const [buttonLoading, setButtonLoading] = React.useState<boolean>(false); 

    const [selected, setSelected] = React.useState<string[]>([]);

    const searchParams = useSearch(); 
    const page = searchParams?.get("page") || "0"; 
    const sec = searchParams?.get("sec"); 
    const q = searchParams?.get("q") || "";
    const sort = searchParams?.get("sort") || ""; 

    // global state items
    const {inbox, setInitialNumbers} = useMailNumbersStore(); 

    React.useEffect(() => setMounted(true), []);

    const fetchThreads = async (dont_reload?: boolean) => {
        if (!mounted) return; 
        if (dont_reload) setLoading(true); 

        let res = (q || sort === "unread") ?
            await searchThroughMail(q, sort, title, page): 
            await getThreads(title, page)

        if (res) {
            setThreads(res.docs); 
            setCount(res.count); 
            
            setInitialNumbers(res.state.inbox, res.state.junk, res.state.drafts);

        }

        setTimeout(() => {setLoading(false)}, 1500) 
    }

    useCustomEffect(() => setSelected([]), [mounted, sec])
    useCustomEffect(fetchThreads, [mounted, title, page, q, sort]);

    // delete selected
    const handleDeleteSelected = async () => {
        setButtonLoading(true);

        // selected 
        let res = await deleteSelected(selected);

        if (res){
            createToast("success", "Mails deleted");
            await fetchThreads(selected.length > 15 ? true: false); 
            setSelected([]);
            setOpenDeleteModal(false)
        }

        setButtonLoading(false)
    }
    return (
        <>
            <Confirm
                title="Delete mails?"
                description="The mails will be moved to the trashed folder for 30 days before they are permanently deleted! Do you wish to proceed?"
                isOpen={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
            >
                <div className="flex justify-end w-full">
                    <Button onClick={handleDeleteSelected} disabled={buttonLoading}>
                        Proceed
                    </Button>
                </div>
            
            </Confirm>
            <div className="h-full flex flex-col max-w-[450px] w-full lg:min-w-[450px] border-r-[0.01rem] px-2 pt-2">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col gap-1">
                        <Heading1 className="text-lg lg:text-2xl capitalize flex flex-col">
                            {title} 
                        </Heading1>
                        {
                            (sec === "inbox" || !sec) ? (
                                <div className="flex gap-2 items-center text-xs lg:text-sm font-normal mt-1">
                                    <span>{`Total - ${numberWithCommas(count)}`}</span>
                                    {
                                        (inbox && (sec === "inbox" || !sec)) ? (
                                            <>
                                                <div className="h-[13px] w-[1px] bg-gray-500"/>
                                                <span>{`Unread - ${numberWithCommas(inbox)}`}</span>
                                            </>
                                        ): <></>
                                    }
                                </div>
                            ): <></>
                        }

                    </div>
                    
                    
                    <div className="flex items-center gap-1">
                        {(sec === "inbox" || !sec) ? <SortPopover />: <Button variant="ghost" size="sm" className="cursor-default w-[100px] hover:bg-background" />}
                        <Button 
                            variant="outline" 
                            disabled={loading || buttonLoading} 
                            onClick={() => fetchThreads(true)}
                            size={"sm"}
                        >
                            <RefreshCcw size={18}/>
                        </Button>
                    </div>
                </div>
                
                {
                    count ? (
                        <>
                            <Buttons 
                                selected={selected}
                                threads={threads}
                                loading={buttonLoading}
                                setThreads={setThreads}
                                setSelected={setSelected}
                                setOpenDeleteModal={setOpenDeleteModal}
                                setLoading={setButtonLoading}
                            />

                            <SearchInput loading={loading}/>
                        </>
                    ): <></>
                }

                <Separator className={cn(count ? "mt-4": "")}/>
                <div className="overflow-scroll h-[90vh] w-full pb-[9rem]">
                    {
                        loading && <Loading />
                    }
                    {
                        (!loading && count) ? (
                            <>
                                {threads.map((thread, index) => (
                                    <Thread 
                                        {...thread} 
                                        key={index}
                                        selected={selected}
                                        setSelected={setSelected}
                                    />
                                
                                ))}
                            </>
                        ): <></>
                    }
                    {
                        !loading && !count && (
                            <>
                                <Paragraph className="my-4 text-center">You have no mail.</Paragraph>
                            </>
                        )
                    }
                </div>
            </div>

        </>
    )
};

export default Threads; 


const Loading = () => (
    <>
        {
            createArray(15).map((_, index) => <ThreadPlaceholder key={index}/>)
        }
    </>
);

const SearchInput = ({loading}: {
    loading: boolean
}) => {
    const {push} = useRouter();
    const searchParams = useSearch(); 
    const [search, setSearch] = React.useState<string>(""); 
    const sec = searchParams?.get("sec") || "inbox"; 

    const handleSearch = () => {
        push(`/?sec=${sec}&q=${search}`);
    }

    return (
        <>  
            {
                search.length > 2 && (
                    <div className="flex justify-between items-center my-1">
                        <Paragraph className="text-xs lg:text-sm">Showing results for {search}</Paragraph>
                        <span 
                            className="text-xs lg:text-sm cursor-pointer duration-700 hover:text-destructive"
                            onClick={() => {
                                push(`/?sec=${sec}`);
                                setSearch("")
                            }}
                        >Reset</span>
                    </div>
                )
            }
            <AppInput 
                value={search}
                setValue={setSearch}
                disabled={loading}
                placeholder="Search..."
                icon={search.length < 2 && <Search size={20}/>}
                button={
                    search.length > 2 && (
                        <Button size="icon" disabled={loading} onClick={handleSearch}>
                            <Search size={18}/>
                        </Button>
                    )
                }
            />
        </>
    )
};


const Buttons = (
    {selected, threads, loading, setThreads, setLoading, setSelected, setOpenDeleteModal}:
    {
        selected: string[];
        threads: ThreadType[];
        loading: boolean;
        setThreads: React.Dispatch<ThreadType[]>;
        setSelected: React.Dispatch<string[]>;
        setOpenDeleteModal: React.Dispatch<boolean>;
        setLoading: React.Dispatch<boolean>;
    }
) => {
    const searchParams = useSearch();
    const sec = searchParams?.get("sec"); 

    const { lessFromNumber, inbox } = useMailNumbersStore();

    const handleRead = async (type: "all" | "selected") => {
        setLoading(true);

        let res = await markAsRead(type === "all", selected);

        if (res) {
            createToast("success", "Mails marked as read.")
            let new_threads = []; 
            let count = 0; 

            if (type === "all") {
                new_threads = threads.map(doc => ({...doc, unread: 0}))
            } else {
                for (let i = 0; i < threads.length; i++) {
                    let curr = threads[i]; 

                    if (selected.includes(curr.id)) {
                        new_threads.push({...curr, unread: 0}); 
                         
                        count = curr.unread + count; 
                    } else new_threads.push(curr)
                }
            }

            lessFromNumber("inbox", count)
            setThreads(new_threads); 
            setSelected([])

        };
        setLoading(false)
    }


    return (
        <div className="flex flex-col gap-2 py-1 my-1">
        <Separator />
        <div className="flex justify-between gap-1">
            {((sec === "inbox" || !sec) && inbox) ? (
                <div className="flex">
                    {selected.length > 0 &&  <Button variant="ghost" size="sm" disabled={loading} onClick={() => handleRead("selected")}>Read</Button>}
                    <Button variant="ghost" size="sm" disabled={loading} onClick={() => handleRead("all")}>Read All </Button>
                </div>
            ): <></>}
            <div className={cn((sec === "inbox" || !sec) ? "justify-end": "justify-start", "flex gap-2 flex-1")}>
                {
                    selected.length !== threads.length && (
                        <Button variant="secondary" size="sm" 
                            disabled={loading} 
                            onClick={() => {
                                setSelected(threads.map(doc => doc.id))
                            }}>
                                Select All
                        </Button>
                    )
                }
                {selected.length > 0 ? (
                    <>
                        <Button disabled={loading} variant="secondary" size="sm" className="" onClick={() => setSelected([])}>Unselect All </Button>
                        
                    </>
                ): <></>}
            </div>
            {selected.length > 0 ? (
                <Button 
                    variant="destructive" 
                    size="sm" 
                    disabled={loading}
                    onClick={() => setOpenDeleteModal(true)}
                >
                    <Trash2 size={18}/>
                </Button>

            ): <></>}
        </div>
        <Separator />
        
    </div>
    )
}