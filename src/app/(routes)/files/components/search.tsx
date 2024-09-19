import { AppInput } from "@/components";
import { useSearch } from "@/hooks";
import { useRouter } from "next/navigation";
import React from "react";

const SearchFile = () => {
    const [search, setSearch] = React.useState<string>(""); 
    const {push} = useRouter();
    
    const searchParams = useSearch(); 
    const folder = searchParams?.get("folder"); 
    const layout = searchParams?.get("layout"); 

    const handleKeyDown = (val: string) => {
        let str = `/files?`; 
        if (layout) str = str + `layout=${layout}&`; 
        if (folder) str = str + `folder=${folder}&`
        if (val.length > 1) str = str + `q=${val}`; 
       
        push(str); 
    }
    return (
        <AppInput 
            value={search}
            setValue={setSearch}
            onKeyUp={(val: string) => handleKeyDown(val)}
            placeholder={"Search for file..."}
            cls="w-[200px] lg:w-[300px]"
            containerClassName="rounded-full"
        />
    )
};

export default SearchFile; 