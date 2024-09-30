// mail signature 
"use client";
import Container from "./container";
import AppImage from "@/components/common/app-image"; 
import { Heading3, Paragraph } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card"

import {userPreferencesStore} from "@/stores/user-preferences"; 

const MailSignature = () => {
    const { signature } = userPreferencesStore(); 

    
    return (
        <Container title="Mail Signature">
            {
                !signature && (
                    <Paragraph className="text-sm lg:text-md font-bold my-3">Contact your domain admin for the mail signature setup!</Paragraph>
                )
            }
            {
                signature && (
                    <>
                        <Paragraph className="my-3">
                            <span className="font-bold">NB:</span>
                            Only the domain admin can make edits of this. 
                        </Paragraph>

                        <Card className="w-full p-2">
                            <Heading3 className="text-sm lg:text-md text-center">Sample Mail</Heading3>
                            <Separator className="my-2"/>
                            <div className="w-full h-[15vh] p-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-7 h-7 rounded-full"/>
                                    <div>
                                        <Skeleton className="w-[150px] rounded-full h-[10px]"/>
                                        <Skeleton className="mt-1 w-[100px] rounded-full h-[10px]"/>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 my-3">
                                    <Skeleton className="w-full h-[10px] rounded-full"/>
                                    <Skeleton className="w-full h-[10px] rounded-full"/>
                                    <Skeleton className="w-full h-[10px] rounded-full"/>
                                    <Skeleton className="w-full h-[10px] rounded-full"/>
                                    
                                </div>
                            </div>
                            <Separator className="my-2"/>
                            <div className={"flex gap-2 items-center h-[80px] py-2 "}>
                                <AppImage 
                                    src={signature.logo}
                                    alt="company logo"
                                    title="company logo"
                                    width={70}
                                    height={75}
                                    nonBlur={true}
                                    cls="rounded-lg"
                                />
                                <div className="flex flex-col justify-between">
                                    <Heading3 className="text-sm lg:text-md">{signature.name}</Heading3>
                                    <Paragraph className="text-xs lg:text-sm font-bold">{signature.title}</Paragraph>
                                    <Paragraph className="text-xs lg:text-xs">{signature.slogan}</Paragraph>
                                    <Paragraph className="text-xs lg:text-xs">{signature.address}</Paragraph>
                                </div>
                            </div>
                        </Card>

                    </>
                )
            }
        </Container>
    )
};

export default MailSignature; 