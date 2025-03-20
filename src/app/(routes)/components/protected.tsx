// protect pages

"use client"; 
import React, { PropsWithChildren } from 'react'; 
import Link from 'next/link';

import { Heading1, Heading3, Paragraph } from '@/components/ui/typography';
import { Separator } from '@/components/ui/separator';
 
import { useAuthUser } from '@/auth/authHooks';
import useMounted from "@/hooks/useMounted"; 

import Menu from './menu';
import { cn } from '@/lib/utils';

type ProtectedProps = PropsWithChildren<{
    title: string; 
    backPage?: boolean; 
    className?: string; 
}>

const Protected = ({title, children, backPage, className}: ProtectedProps) => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false); 
    const mounted = useMounted();  

    const auth = useAuthUser(); 
    const user = auth(); 

    React.useEffect(() => {
        if (!mounted) return

        if (user) setLoggedIn(true); 
        else  setLoggedIn(false); 

        setLoading(false); 
    }, [user, mounted]); 

    if (!mounted) return <Placeholder />; 

    return (
        <>
            
            {
                loggedIn && !loading ? (
                    <>
                        
                        <div className={cn("py-2 flex-1 h-[100vh] overflow-hidden gap-2 flex flex-col px-2")}>
                            {
                                title && (
                                    <>
                                        <div className='flex justify-between items-center pl-2'>
                                            <Heading1 className="text-lg lg:text-2xl capitalize flex-1 ">{title}</Heading1>
                                            <Menu other={true}/>
                                        </div>
                                        <Separator />
                                    </>

                                )
                            }
                             
                            {children}
                        </div>
                    </>
                ): <></>
            }
            {
                (!loggedIn && !loading) ?
                (
                    <div className="p-2">
                        <Heading3 className="text-sm lg:text-md my-2">You are not authorized to access the page!</Heading3>
                        <Link href="/auth/login" className="text-sm lg:text-md hover:text-active-color">Click here to log in.</Link>
                    </div>
                ): <></>
            }
            {
                loading && <Placeholder />
            }
        </>
    )
};

export default Protected; 


// placeholder

const Placeholder = () => (
        <section className="flex-1 p-2 flex gap-2">
            {/* <Menu /> */}
            {/* <SideMenu /> */}
            <div className="flex-1 items-center justify-center bg-background rounded-lg px-2 py-4">
                <Paragraph>Loading...</Paragraph>
            </div>
        </section>
)