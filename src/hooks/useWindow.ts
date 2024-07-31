"use client"; 

import React from "react";

export const useWindow = () => {
    const [mounted, setMounted] = React.useState(false); 
    const windowObject = typeof window !== 'undefined' && window.location ? window: ""; 

    React.useEffect(() => {
        setMounted(true)
    }, []); 

    if (!mounted) return ''; 

    return windowObject; 
}