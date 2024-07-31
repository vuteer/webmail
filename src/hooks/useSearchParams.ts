// for getting the search params 
import React from 'react'
import {  useSearchParams } from "next/navigation";

export const useSearch = () => {
    const [mounted, setMounted] = React.useState(false);
    const searchParams = useSearchParams(); 

    React.useEffect(() => {
        setMounted(true)
    }, []); 

    if (!mounted) return null; 

    return searchParams;

}