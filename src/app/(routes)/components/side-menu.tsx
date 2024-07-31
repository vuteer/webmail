// side menu 
"use client";
import React from 'react'
import Link from "next/link";
import {  usePathname } from "next/navigation";
import { 
    AlignJustify, 
    CalendarDays, 
    CircleAlert, 
    CircleUser, 
    File,
    Files, 
    Inbox, 
    PlusCircle, 
    Send, 
    Star, 
    Trash2 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {getLocalStorageItem, setLocalStorageItem} from "@/helpers/local-storage"; 
import { useSearch } from "@/hooks/useSearchParams";
import { cn } from "@/lib/utils";
import { useAuthUser } from '@/auth/authHooks';


const SideMenu = () => {
    const params = useSearch();
    const pathname = usePathname(); 

    const auth = useAuthUser();
    const user = auth(); 
    const sec = params?.get("sec");

    const [mounted, setMounted] = React.useState<boolean>(false); 
    const [opened, setOpened] = React.useState<boolean>(false);


    React.useEffect(() => setMounted(true), [])
    React.useEffect(() => {
        if (!mounted) return; 
        let menu_open = getLocalStorageItem("menu"); 

        if (!menu_open) setOpened(false);
        else {
            if (menu_open === "yes") setOpened(true);
            else setOpened(false); 
        }
    }, [mounted]); 

    const handleMenuOpen = () => {
        setOpened(!opened); 
        setLocalStorageItem("menu", opened ? "no": "yes")
    }
    
    if (!mounted) return null; 

    return (
        <>
            {
                user && !pathname.includes("auth") && (
                    <nav
                        className={cn("border-r-[.01rem] duration-500 bg-background px-2 py-3 h-[100vh] pb-8 flex flex-col")}
                    >
                        <span className='flex items-center gap-2'>
                            <Button
                                variant="secondary"
                                size="icon"
                                onClick={handleMenuOpen}
                                
                            >
                                <AlignJustify size={18} />
                            </Button>
                            {opened && <span className="font-bold text-lg lg:text-3xl">Vu.Mail</span>}
                        </span>
                        <Separator className="my-3" />

                        <div className="flex-1">
                            {
                                menu.map((itm, index) => (
                                    <MenuItem
                                        item={itm}
                                        key={index}
                                        menuOpen={opened}
                                        current={pathname === "/" ? sec || "inbox": pathname}

                                    />))
                            }
                            <Separator className="my-3" />
                            {
                                more.map((itm: MenuItemType, index) => (
                                    <MenuItem 
                                        key={index}
                                        item={itm}
                                        menuOpen={opened}
                                        current={pathname === "/" ? sec || "inbox": pathname}

                                    />
                                ))
                            }
                        </div>
                        
                         
                    </nav>
                )
            }
        </>
    )
};

export default SideMenu;

// menu items

type MenuItemType = {
    text: string;
    icon: React.ReactNode;
    href: string;
};

let hover = "duration-500 hover:text-main-color hover:bg-main-bg hover:border-l-main-color"

const MenuItem = ({ item, menuOpen, current }:
    { item: MenuItemType, menuOpen: boolean, current: string }) => (
    <Link
        href={item.href}
        className={cn(current && item.href.includes(current) ? "bg-main-bg border-l-main-color text-main-color" : "border-l-transparent", "text-sm lg:text-md border-l-2  duration-700 my-2 px-2 py-2 flex gap-2 items-center", hover)}
    >
        {item.icon}
        <span className={cn(!menuOpen ? "hidden": "", "")}>{item.text}</span>
    </Link>
)

const menu: MenuItemType[] = [
    { text: "New Mail", icon: <PlusCircle size={18} />, href: "/write" },
    { text: "Inbox", icon: <Inbox size={18} />, href: "/?sec=inbox" },
    { text: "Starred", icon: <Star size={18} />, href: "/?sec=starred" },
    { text: "Sent", icon: <Send size={18} />, href: "/?sec=sent" },
    { text: "Drafts", icon: <File size={18} />, href: "/?sec=draft" },
    { text: "Important", icon: <CircleAlert size={18} />, href: "/?sec=important" },
    { text: "Trash", icon: <Trash2 size={18} />, href: "/?sec=trash" },
    ];
    
    const more: MenuItemType[] = [
    {text: "Calendar", icon: <CalendarDays size={18}/>, href: "/calendar"},
    { text: "Contacts", icon: <CircleUser size={18} />, href: "/contacts" },
    { text: "Files", icon: <Files size={18} />, href: "/files" },
]