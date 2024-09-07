// file container
"use client"; 

import React from "react"; 
import { ChevronLeft, ChevronRight, HelpCircle, Home, Plus } from "lucide-react";
import {v4 as uuidv4} from "uuid"; 

import {AppInput} from "@/components";
import { Button } from "@/components/ui/button";
import {Card} from "@/components/ui/card"; 
import {Paragraph} from "@/components/ui/typography";
import {Separator} from "@/components/ui/separator";
 
import Header from "./header"; 
import Grid, { GridPlaceholder } from "./grid";
import List, {ListPlaceholder} from "./list";
import ImageUploadModal from "@/components/modals/image-upload";
import AddFolderModal from "@/components/modals/folder";

import { createArray } from "@/utils/format-numbers";
import { cn } from "@/lib/utils";
import { useSearch, useCustomEffect } from "@/hooks";
import { AttachmentType } from "@/types";
import { getFiles } from "@/lib/api-calls/files";
import { useRouter } from "next/navigation";
import SearchFile from "./search";

const FilesContainer = ({}) => {

    const [loading, setLoading] = React.useState<boolean>(true); 
    const [search, setSearch] = React.useState<string>(""); 

    const [files, setFiles] = React.useState<AttachmentType[]>([]); 
    const [count, setCount] = React.useState<number>(0); 
    const [size, setSize] = React.useState<number>(0); 

    const [openNewFileModal, setOpenNewFileModal] = React.useState<boolean>(false)
    const [newFiles, setNewFiles] = React.useState<string[]>([]);

    const [addFolderModal, setAddFolderModal] = React.useState<boolean>(false);

    const {back, push} = useRouter(); 

    const searchParams = useSearch(); 
    const layout: any = searchParams?.get("layout") || "list"; 
    const folder = searchParams?.get("folder") || "";
    const q = searchParams?.get("q") || ""; 

    const fetchFiles = async () => {
        setFiles([])
        setLoading(true); 

        let res = await getFiles(folder, q); 

        if (res) {
            setFiles(res.docs);
            setCount(res.count);
            setSize(res.size); 
        };

        setLoading(false); 
    }

    useCustomEffect(fetchFiles, [folder, q]);

    let className = cn(
        layout === "grid" ? "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-2":
        "flex flex-col", "w-full overflow-auto pb-[20rem]"
    );

    return (
        <>
            <AddFolderModal 
                isOpen={addFolderModal}
                onClose={() => setAddFolderModal(false)}
                setFiles={setFiles}
                files={files}
                count={count}
                setCount={setCount}
            />

            <ImageUploadModal
                isOpen={openNewFileModal}
                onClose={() => setOpenNewFileModal(false)}
                files={newFiles}
                setFiles={setNewFiles}
            />
            <Header
                setOpenNewFileModal={setOpenNewFileModal}
                setAddFolderModal={setAddFolderModal}
                count={count}
                size={size}
            />
            {
                
                    <>
                        <div className="mt-3 flex justify-between gap-2">
                            {
                                folder ? (
                                    <div className="flex gap-2 items-center">
                                        <Button 
                                            variant={"ghost"} 
                                            className="gap-2 items-center"
                                            onClick={() => back()}
                                        >
                                            <ChevronLeft size={18}/>
                                            Back
                                        </Button>
                                        <Button
                                            variant={"ghost"}
                                            onClick={() => push("/files")}
                                        >
                                            <Home size={18}/>
                                        </Button>
                                    </div>
                                ): <div />
                            }
                            {(count || q) ? 
                                (
                                    <SearchFile />
                                ): <></>
                            }
                            
                        </div>
                        <Separator className="mb-3"/>
                    </>
                 
            }
            {
                loading && (
                    <div className={className}>
                        <>
                            {
                                createArray(40).map((_, index) => layout === "grid" ? <GridPlaceholder key={index}/>: <ListPlaceholder key={index}/>)
                            }
                        </>
                    </div>
                )
            }
            {
                !loading && files.length > 0 && (
                    <div className={className}>
                        <>
                            {
                                files.map((file, index) => layout === "grid" ? 
                                    <Grid 
                                        key={index} 
                                        file={file}
                                        files={files}
                                        setFiles={setFiles}
                                    />: 
                                    <List 
                                        key={index} 
                                        files={files}
                                        setFiles={setFiles}
                                        file={file}
                                    />
                                )
                            }
                        </>
                    </div>
                )
            }
             
            {
                !loading && !count && (
                    <Card className="w-full h-[85vh] flex flex-col gap-2 items-center justify-center">
                        <Paragraph>You have no files.</Paragraph>
                        <Button 
                            className="items-center gap-2 rounded-full"
                            onClick={() => setOpenNewFileModal(true)}
                            size={"sm"}
                        >
                            <Plus size={18}/>
                            Add File
                        </Button>
                    </Card>
                )
            }

            

        </>
    )
} 

export default FilesContainer; 