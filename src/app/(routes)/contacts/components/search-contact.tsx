import { AppInput } from "@/components"
import { useRouter } from "next/navigation";
import React from "react";


const SearchContact = () => {
    const [search, setSearch] = React.useState<string>("");
    const {push} = useRouter(); 

    const handleSearch = (val: string) => {
        if (val.length > 2) {
            push(`/contacts?q=${val}`)
        } else push("/contacts")
    }
    return (
        <AppInput 
            value={search}
            setValue={setSearch}
            placeholder="Search contact..."
            cls="w-[250px]"
            onKeyUp={val => handleSearch(val)}
            containerClassName="rounded-full"
        />
    )
};

export default SearchContact; 