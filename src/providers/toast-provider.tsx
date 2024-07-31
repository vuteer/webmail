'use client'; 
// toast provider - uses sonner package
import React from 'react';
import { Toaster } from 'sonner'; 
// import { useTheme } from 'next-themes';

export const ToasterProvider = () => {
    // const {theme} = useTheme(); 
     
    return (
        <Toaster 
            closeButton 
            position="top-center" 
            richColors 
            theme={"dark"} 
            toastOptions={{
                style: {width: "fit-content", minWidth: "150px", marginLeft: "100px"}
            }}
        />
    )
}