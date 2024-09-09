import { useRouter } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSearch } from "@/hooks";


export type ContactType = "internal" | "external"; 
// {type, setType}: {type: ContactType, setType: React.Dispatch<ContactType>}
const TabItems = () => {
    const {push} = useRouter(); 
    const searchParams = useSearch(); 
    const currentLayout = searchParams?.get("type") || "internal"; 

    const handleTabClick = (type: ContactType) => {
        const entries: any = searchParams?.entries(); 

        let queryStr = ''; 

        for (const [key, value] of entries) {
            if (key !== "type") queryStr = queryStr + `${key}=${value}&`;
        };

        queryStr = queryStr + `type=${type}`;

        push(`/contacts?${queryStr}`); 
    }
    return (
        <Tabs defaultValue={currentLayout} >
            <TabsList>
                <TabsTrigger value="internal" onClick={() => handleTabClick("internal")}>
                    Internal
                </TabsTrigger>
                <TabsTrigger value="external" onClick={() => handleTabClick("external")}>
                    External
                </TabsTrigger>
            </TabsList>
        </Tabs>

    )
};

export default TabItems; 