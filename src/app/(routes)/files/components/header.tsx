// files header component 
"use client";

import React from "react"; 
import { useRouter } from "next/navigation";
import {Folder, LayoutGrid, List, Plus} from "lucide-react"; 

import {Button} from "@/components/ui/button"; 
import {Heading3} from "@/components/ui/typography"; 
import {Separator} from "@/components/ui/separator"; 
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSearch } from "@/hooks";

interface HeaderProps {
    setOpenNewFileModal: React.Dispatch<boolean>;
    setAddFolderModal: React.Dispatch<boolean>;
}

const Header: React.FC<HeaderProps> = ({
    setOpenNewFileModal,
    setAddFolderModal
}) => {
    const [layout, setLayout] = React.useState<LayoutType>("list"); 

    return (
        <>
            <div className="py-2 flex justify-between items-center">
                <div>
                    <Heading3 className="text-xs lg:text-sm">Total Files - 78</Heading3>
                    <Heading3 className="text-xs lg:text-sm">Total Size - 54MB</Heading3>
                </div>

                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setOpenNewFileModal(true)}
                    >
                        <Plus size={18}/>
                    </Button>
                    <Button 
                        className="flex items-center gap-2" 
                        variant="outline"
                        onClick={() => setAddFolderModal(true)}
                    >
                        <Folder size={18}/>
                        <span>Add folder</span>
                    </Button>
                    <TabItems 
                        layout={layout}
                        setLayout={setLayout}
                    />
                </div>
            </div>

            <Separator />
        </>
    )
}

export default Header; 

export type LayoutType = "grid" | "list"
const TabItems = ({layout, setLayout}: {layout: LayoutType, setLayout: React.Dispatch<LayoutType>}) => {
    const {push} = useRouter(); 
    const searchParams = useSearch(); 
    const currentLayout = searchParams?.get("layout") || "grid"; 

    const handleTabClick = (type: LayoutType) => {
        const entries: any = searchParams?.entries(); 

        let queryStr = ''; 

        for (const [key, value] of entries) {
            if (key !== "layout") queryStr = queryStr + `${key}=${value}&`;
        };

        queryStr = queryStr + `layout=${type}`;

        push(`/files?${queryStr}`); 
    }
    return (
        <Tabs defaultValue={currentLayout} >
            <TabsList>
                <TabsTrigger value="list" onClick={() => handleTabClick("list")}>
                    <List size={18}/>
                </TabsTrigger>
                <TabsTrigger value="grid" onClick={() => handleTabClick("grid")}>
                    <LayoutGrid size={18}/>
                </TabsTrigger>
            </TabsList>
        </Tabs>

    )
}