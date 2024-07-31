/*
    Custom 404 page. You can add your own image and styles to match your style
*/
import type { Metadata } from 'next';
import Image from "next/image";

import {generateStaticMetadata} from "@/utils/metadata"; 
import {Card} from "@/components/ui/card"; 


import Buttons from "@/components/error-components/404"; 
 
export const metadata: Metadata = generateStaticMetadata('404 - Not Found', "");

export default function NotFound() {
  return (
    <main className='flex flex-col w-[100vw] min-h-[100vh] max-w-[80rem] py-4 px-2 mx-auto max-sm:max-w-[100vw]'>
        <Card className="flex-1 flex flex-col items-center justify-center pb-4">
          <div className='relative w-full h-[70vh] max-sm:h-[50vh]'>
            <Image 
              alt='404 error'
              src='https://res.cloudinary.com/dyo0ezwgs/image/upload/v1698627657/digital/utils/404_latest_b_zyu0e1.png'
              fill
              style={{objectFit: "contain"}}
              title='404 error'
            />
          </div>
          <h1 className='my-2 font-bold text-md'>Oops! You seem to have lost your way. We can help you, click on any option below</h1>
          <Buttons />
        </Card>
    </main>
  );
}

