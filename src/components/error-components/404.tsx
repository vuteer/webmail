// buttons for the 404 page
"use client"; 

import {useRouter} from "next/navigation"; 

import {Button} from "@/components/ui/button"; 
import {ChevronLeftCircle, Home} from "lucide-react"; 


const Buttons = () => {
    const router = useRouter(); 
    return (
        <div className='flex justify-center gap-2 self-center'>
            <Button 
                variant='outline'  
                className='flex gap-2 items-center min-w-[100px]'
                onClick={() => router.back()}
            >
                <ChevronLeftCircle className='w-5 h-5'/>&nbsp;Go Back
            </Button>
            <Button 
                variant='secondary' 
                className='flex gap-2 items-center min-w-[100px]'
                onClick={() => router.push("/")}
            >
                    <Home className='w-5 h-5'/>&nbsp;Home
            </Button>
        </div>
)};

export default Buttons; 